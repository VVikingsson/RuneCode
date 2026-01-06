const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated, please log in" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;  
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
    authenticateToken,
};