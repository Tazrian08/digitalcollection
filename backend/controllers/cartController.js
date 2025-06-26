const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get Cart for logged in user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if(!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// Add or Update an item in Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if(!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if(itemIndex > -1){
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);

  } catch(error){
    console.error(error);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    
    if(cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.json(updatedCart);
    }
    res.status(404).json({ message: 'Cart or item not found' });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server error removing from cart" });
  }
};