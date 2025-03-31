const { db } = require("../firebase");
const Product = require("../models/Product"); // Import the Product model
const collection = db.collection("products");

// 📌 Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const snapshot = await collection.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No products found" });
    }

    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

// 📌 Add a new product
exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
  
      // Validate required fields
      if (!name || !price || !category) {
        return res.status(400).json({ error: "Missing required fields: name, price, and category are mandatory." });
      }
  
      // Validate price (must be a number)
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Price must be a positive number." });
      }
  
      // Get image URL from Cloudinary upload
      const image = req.file ? req.file.path : null;
  
      const newProduct = new Product(name, description, price, image, category);
      const docRef = await collection.add({ ...newProduct });
  
      res.status(201).json({ id: docRef.id, ...newProduct, message: "Product added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add product", details: error.message });
    }
  };

// 📌 Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product", details: error.message });
  }
};

// 📌 Update a product
exports.updateProduct = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    await collection.doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

// 📌 Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    await collection.doc(req.params.id).delete();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
