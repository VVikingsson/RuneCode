const jwt = require('jsonwebtoken');
const { User } = require('./models');

function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: ... }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function checkAdmin(req, res, next) {
    console.log(req.user);
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
}

module.exports = { 
    verifyJWT,
    checkAdmin 
    };
