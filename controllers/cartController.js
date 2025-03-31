const { db } = require('../firebase');

// Add a product to the user's cart using only productId
const addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.uid; // Get user ID from authentication middleware
  
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }
  
    try {
      // Fetch product details from Firestore
      const productRef = db.collection('products').doc(productId);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
  
      const { name, price } = productDoc.data();
  
      const cartRef = db.collection('users').doc(userId).collection('cart').doc(productId);
      const cartItem = await cartRef.get();
  
      if (cartItem.exists) {
        // If product exists, increase quantity
        const data = cartItem.data();
        await cartRef.update({
          quantity: data.quantity + 1,
          total: (data.quantity + 1) * price,
        });
      } else {
        // Add new product with default quantity 1
        await cartRef.set({
          name,
          price,
          quantity: 1,
          total: price,
        });
      }
  
      res.status(200).json({ success: true, message: "Product added to cart." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Update cart quantity (increase or decrease)
const updateCartQuantity = async (req, res) => {
  const { productId, action } = req.body;
  const userId = req.user.uid;

  if (!productId || !action) {
    return res.status(400).json({ success: false, message: "Product ID and action (increase/decrease) are required." });
  }

  try {
    const cartRef = db.collection('users').doc(userId).collection('cart').doc(productId);
    const cartItem = await cartRef.get();

    if (!cartItem.exists) {
      return res.status(404).json({ success: false, message: "Product not found in cart." });
    }

    const data = cartItem.data();
    let newQuantity = action === 'increase' ? data.quantity + 1 : data.quantity - 1;

    if (newQuantity <= 0) {
      await cartRef.delete(); // Remove from cart if quantity is 0
      return res.status(200).json({ success: true, message: "Product removed from cart." });
    }

    await cartRef.update({
      quantity: newQuantity,
      total: newQuantity * data.price,
    });

    res.status(200).json({ success: true, message: "Cart updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the cart of the logged-in user
const getUserCart = async (req, res) => {
  const userId = req.user.uid;

  try {
    const cartSnapshot = await db.collection('users').doc(userId).collection('cart').get();
    const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, updateCartQuantity, getUserCart };
