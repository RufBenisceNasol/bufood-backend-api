const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

// Product routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", upload.single("image"), productController.addProduct); 
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);



module.exports = router;
