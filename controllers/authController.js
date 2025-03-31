const axios = require('axios');
const { auth, db } = require('../firebase'); // Import auth and db from firebase.js

// User registration
const registerUser = async (req, res) => {
  const { email, password, name, phone, role, storeName } = req.body;

  // Validate required fields
  if (!email || !password || !name || !phone || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password, name, phone, and role are required."
    });
  }

  // If the role is 'seller' or 'admin', storeName is required
  if ((role === 'seller' || role === 'admin') && !storeName) {
    return res.status(400).json({
      success: false,
      message: "Store name is required for sellers and admins."
    });
  }

  try {
    // Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Prepare user data to save in Firestore
    const userData = {
      uid: userRecord.uid,
      name,
      phone,
      role,
      storeName: (role === 'seller' || role === 'admin') ? storeName : null, // Store name for sellers and admins
    };

    // Save user data to Firestore
    await db.collection('users').doc(userRecord.uid).set(userData);

    // Success response
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      uid: userRecord.uid
    });
  } catch (error) {
    // Error response
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  try {
    // Authenticate user with Firebase REST API
    const firebaseResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCW__2ToKDVAJgIvZUWWrLnWGV-CGQx4mU`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const { idToken, localId } = firebaseResponse.data;

    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(localId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User data not found."
      });
    }

    const userData = userDoc.data();

    // Success response
    res.json({
      success: true,
      message: "User logged in successfully.",
      user: {
        uid: localId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        storeName: userData.storeName || null
      },
      idToken
    });
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    res.status(400).json({
      success: false,
      message: error.response?.data?.error?.message || "Invalid email or password."
    });
  }
};

// Middleware to verify Firebase ID token
const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

// Export the functions
module.exports = {
  registerUser,
  loginUser,
  authenticateToken,
};