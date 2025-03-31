require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const { db } = require("./firebase"); // Assuming you have a firebase.js file exporting your db instance

// Import routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const cartRoutes = require("./routes/cartRoutes"); // Import cart routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to BuFood API 🚀");
});

// Mount routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // Mount auth routes
app.use("/api/cart", cartRoutes); // Mount cart routes

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
