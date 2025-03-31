// routes/authRoutes.js
const express = require('express');
const { registerUser , loginUser , authenticateToken } = require('../controllers/authController');

const router = express.Router();

// User registration route
router.post('/register', registerUser );

// User login route
router.post('/login', loginUser );

// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.email}, you are authenticated!`);
});

// Export the router
module.exports = router;