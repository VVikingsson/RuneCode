const { User } = require('../models');
const bcrypt = require('bcryptjs'); // library for hashing passwords

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
        if (err.status === 11000 && err.keyValue) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({message: `$field already exists`, field})
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

async function removeUser(req, res, next) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        const name = deletedUser.username;
        res.status(200).json({message: `Successfully deleted user ${name}`});
    } catch (err) {
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

module.exports = {
    createNewUser,
    loginUser,
    removeUser,
    getAllUsers
}