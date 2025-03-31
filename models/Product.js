class Product {
    constructor(name, description, price, image, category) {
      this.name = name;
      this.description = description || "";
      this.price = Number(price); // Ensure price is a number
      this.image = image || "";
      this.category = category;
      this.createdAt = new Date();
    }
  }
  
  module.exports = Product;
  