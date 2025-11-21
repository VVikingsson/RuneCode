const { User } = require('../models');
const bcrypt = require('bcryptjs'); // library for hashing passwords
const path = require("path");

async function createNewUser(req, res, next) {
    try {
        const {username, email, password} = req.body
        if (!username || !email || !password) {
            return res.status(400).json({message: 'Username or email or password is missing'});
        }
        const salt = await bcrypt.genSalt(10);                    // salting is the process of adding a random value to 
        const hashedPassword = await bcrypt.hash(password, salt); // the password before hashing it, making it more secure.
        const newUser = await User.create({username, email, hashedPassword});

        return res.status(201).json({
            id: newUser._id,
            name: newUser.username,
            email: newUser.email
        });
    } catch (err) {
        if (err.code === 11000 && err.keyValue) { // Mongoose error for field already existing
            const field = Object.keys(err.keyValue)[0]; // will be either username or email
            return res.status(409).json({message: `A user with ${field} already exists`})
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
        
        const user = await identifier.includes('@') ? await User.findByEmail(identifier) : await User.findByUsername(identifier);
        const passwordValid = await bcrypt.compare(password, user.hashedPassword);
        
        if (passwordValid) {
            res.status(200).json({message: 'Successfully logged in', user: user});
        } else {
            res.status(401).json({message: 'Password is incorrect'});
        }
    } catch (err) {
        next(err);
    }
}

async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({message: "No user found with given id"});
        }
    res.status(200).json(user);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid id format'});
        }
        next(err);
    }
}

async function removeUser(req, res, next) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({message: "No user found with given id"});
        }
        res.status(200).json({message: `Successfully deleted user ${deletedUser.username}`});
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
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new makes sure the updated user is returned
        );                                     // runValidators makes sure our Schema constraints (unique) are applied

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (err) {
        next(err);
    }
}

//update a profile picture of a user with specific id(no saving to database is involved)
function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.status(200).json({
            message: 'File uploaded successfully',
            url: `http://localhost:3000/api/v1/users/${req.params.id}/image/`
                + req.params.id
                + path.extname(req.file.originalname) //url passed to frontend for calling get request to get a picture
        });
    } catch (err) {
        next(err);
    }
}

async function getTop100Users(req, res, next) {
    try {
        const users = await User.find().sort({points: -1}).limit(100);
        return res.status(200).json({length: users.length, leaderboard: users})
    } catch (err) {
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
    getTop100Users
}