const { User, Submission, Challenge } = require('../models');
const bcrypt = require('bcryptjs'); // library for hashing passwords
const jwt = require("jsonwebtoken");
const path = require("path");
const mongoose = require('mongoose');
const fs = require("fs/promises");

async function searchUser(req, res, next) {
    try {
        const searchQuery = req.query.searchQuery;
        if (!searchQuery) {
            return res.status(400).json({message: 'Bad request: Missing searchQuery query parameter.'});
        }
        const users = await User.find({username: {$regex: `.*${searchQuery}.*`} });
        if (!users) {
            return res.status(404).json({messasge: `Not found: No users found for query ${searchQuery}`});
        }
        return res.status(200).json({users: users});
    } catch (err) {
        return res.status(500).json({message: `Error when searching user: ${err}`}); // SANS MENTION!!!
    }
}

async function createNewUser(req, res, next) {
    try {
        const {username, email, password, isAdmin} = req.body
        if (!username || !email || !password) {
            return res.status(400).json({message: 'Username or email or password is missing'});
        } else if (!email.includes('@')) {
            res.status(400).json({message: 'Email does not contain @'});
        }
        const salt = await bcrypt.genSalt(10);                    // salting is the process of adding a random value to 
        const hashedPassword = await bcrypt.hash(password, salt); // the password before hashing it, making it more secure.
        const newUser = await User.create({username, email, hashedPassword, isAdmin});

        const payload = {
            id: newUser._id,
            url: `http://localhost:3000/api/v1/users/avatar/`
                + newUser._id
        };

        if (!process.env.JWT_SECRET) {
            console.log('Missing JWT secret in backend environment');
            return res.status(500).json({message: 'Internal server error: for security purposes, see error in server console.'});
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 12, // 12 hours TTL
            secure: true
        });

        return res.status(201).json({
            user: newUser
        });
    } catch (err) {
        if (err.code === 11000 && err.keyValue) { // Mongoose error for field already existing
            const field = Object.keys(err.keyValue)[0]; // will be either username or email
            return res.status(409).json({message: `A user with ${field} '${field == 'username' ? req.body.username : req.body.email}' already exists`});
        }
        next(err);
    }
}

async function loginUser(req, res, next) {
    try {
        const {identifier, password} = req.body;
        if (!identifier || !password) {
            return res.status(400).json({message: 'Missing credentials'});
        }
        
        const user = await identifier.includes('@')
        ? await User.findOne({email: identifier}).select("+hashedPassword") 
        : await User.findOne({username: identifier}).select("+hashedPassword");

        if (!user) {
            res.status(404).json({message: "User not found"});
        }

        const passwordValid = await bcrypt.compare(password, user.hashedPassword);
        
        if(!passwordValid) {
            return res.status(401).json({ message: "Password is incorrect" });
        }
        // for putting image url in global store
        let url = ''
        const imgPath = path.join(process.env.UPLOADS, `${user._id}`)
        try {
            await fs.access(imgPath);
            url = `http://localhost:3000/api/v1/users/avatar/${user.id}`
        } catch(err) {}

        const payload = {
            id: user._id,
            url: url
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 12, // 12 hours TTL
            secure: true
    });

        return res.status(200).json({
            message: "Successfully logged in",
            token: token,
            user: user
        });

    } catch (err) {
        next(err);
    }
}

async function getUser(req, res, next) {
    try {
        const isMe = req.user.id === req.params.id
        const user = await User.findById(req.params.id).select(isMe ? '' : '-email');
        if (!user) {
            return res.status(404).json({message: "No user found with given id"});
        }
        // url to insert in the <img> tag
        //check if image exists, and only then return the url for the image
        //const url = `http://localhost:3000/api/v1/users/avatar/${req.user.id}`;
        let url = ''
        const imgPath = path.join(process.env.UPLOADS, `${req.params.id}`)
        try {
            await fs.access(imgPath);
            url = `http://localhost:3000/api/v1/users/avatar/${req.params.id}`
        } catch(err) {}

        res.status(200).json({user, isMe, url});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'req.'});
        }
        next(err);
    }
}

async function removeUser(req, res, next) {
    try {
        const cookieUser = await User.findById(req.user.id);
        if (req.user.id === req.params.id || cookieUser.isAdmin) {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                res.status(404).json({message: "No user found with given id"});
            }
            // delete user picture along with the user profile
            const imgPath = path.join(process.env.UPLOADS, `${req.user.id}`)
            fs.unlink(imgPath).catch(err => {
                if (err.code !== 'ENOENT') {
                    console.error('Failed to delete avatar:', err)
                }
            })
            // clear cookies, but only if you are the owner of the account
            if (req.user.id === req.params.id) {
                res.clearCookie('token', {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true
                });
            }
            return res.sendStatus(204); }
        else {
            return res.status(401).json({ message: 'You are not the owner of the account you are trying to delete' });
        }
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid id format'});
        }
        next(err);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        //checking whether the user who sent the request is the owner of the profile
        if (req.user.id === req.params.id) {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true } // new makes sure the updated user is returned
            );                                     // runValidators makes sure our Schema constraints (unique) are applied

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user: updatedUser });
        }
        else {
            res.status(401).json({ message: 'You are not the owner of the account you are trying to modify' });
        }
    } catch (err) {
        if (err.code === 11000) {
            // determine which field caused the conflict
            const field = Object.keys(err.keyPattern)[0];

            return res.status(409).json({
                message: `${field} '${field == 'username' ? req.body.username : req.body.email}' is taken`
            });
        }

        next(err);
    }
}

//update a profile picture of a user with specific id(no saving to database is involved)
function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json( { message: 'No file uploaded.' });
        }
        if ( req.avatarExists ) {
            return res.status(200).json({
                url: `http://localhost:3000/api/v1/users/avatar/`
                    + req.user.id  //url passed to frontend for calling get request to get a picture
            });
        }
        return res.status(201).json({
            url: `http://localhost:3000/api/v1/users/avatar/`
                + req.user.id  //url passed to frontend for calling get request to get a picture
        });
    } catch (err) {
        next(err);
    }
}

async function getTop100Users(req, res, next) {
    try {
        // Top 100 users (public)
        const leaderboard = await User
            .find({}, 'username points')
            .sort({ points: -1 })
            .limit(100);

        let currentUser = null;

        // Optional rank logic (only if logged in)
        if (req.user && req.user.id) {
            const foundUser = await User.findById(req.user.id);

            if (foundUser) {
                const inTop100 = leaderboard.some(
                    user => user._id.toString() === foundUser._id.toString()
                );

                // Only show rank if NOT in top 100
                if (!inTop100) {
                    const higherScoreCount = await User.countDocuments({
                        points: { $gt: foundUser.points }
                    });

                    currentUser = {
                        id: foundUser._id,
                        username: foundUser.username,
                        points: foundUser.points,
                        rank: higherScoreCount + 1
                    };
                }
            }
        }

        return res.status(200).json({
            leaderboard,
            currentUser
        });

    } catch (err) {
        next(err);
    }
}


async function getRelatedSubmissions(req, res, next) {
    try{
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({message: 'Bad request: must provide user ID'});
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({message: `Bad request: not a valid MongoDB object ID: ${userId}`})
        }
        const submissions = await Submission
            .find({author: userId}, 'title challenge') //selecting fields title and challenge
            .sort({createdAt: -1}) // date of creation
            .populate('challenge', 'name')
            .exec();
        //form the list of jsons with the submission details
        const responseBody = submissions.map((submission) => {
            return {
                submissionId: submission._id,
                challengeId: submission.challenge._id,
                challengeName: submission.challenge.name,
                submissionTitle: submission.title,
            };
        })
        return res.status(200).json(responseBody);
    } catch(err){
        next(err);
    }
}

module.exports = {
    createNewUser,
    loginUser,
    removeUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadImage,
    getTop100Users,
    getRelatedSubmissions,
    searchUser,
}