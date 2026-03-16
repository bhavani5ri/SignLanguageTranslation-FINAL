// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but the user no longer exists.",
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired. Please log in again."
        : "Invalid token. Authentication failed.";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
