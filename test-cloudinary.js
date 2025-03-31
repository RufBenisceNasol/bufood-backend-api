const cloudinary = require("./config/cloudinary");

cloudinary.uploader.upload("C:/Users/USER/Desktop/test-image.jpg", function (error, result) {
  if (error) {
    console.error("Cloudinary upload error:", error);
  } else {
    console.log("Cloudinary upload success:", result);
  }
});
