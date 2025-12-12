import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;             
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}