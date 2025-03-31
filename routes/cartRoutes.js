const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { addToCart, updateCartQuantity, getUserCart } = require("../controllers/cartController");

const router = express.Router();

// Apply authentication middleware to all cart routes
router.post("/add", authenticateToken, addToCart);
router.put("/update", authenticateToken, updateCartQuantity);
router.get("/", authenticateToken, getUserCart);

module.exports = router;
