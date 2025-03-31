const admin = require("firebase-admin");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid or expired token" });
    }

    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(403).json({ success: false, message: "Authentication failed. Invalid token." });
  }
};

module.exports = { authenticateToken };
