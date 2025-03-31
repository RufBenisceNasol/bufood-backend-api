const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Ensure Cloudinary is properly initialized
if (!cloudinary || !cloudinary.uploader) {
  console.error("Cloudinary configuration failed. Check your .env file.");
  process.exit(1);
}

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bufood_products", // Change this to your folder name
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
  },
});

const upload = multer({ storage });

module.exports = upload;
