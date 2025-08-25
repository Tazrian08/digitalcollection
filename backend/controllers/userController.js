const User = require('../models/User');
const Product = require('../models/Product');

// Get logged in user info
exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};

// Update logged in user profile (name, email, password optional)
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phone, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Add product to My List (favorites)
exports.addToMyList = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    if(!user.myList.includes(productId)){
      user.myList.push(productId);
      await user.save();
    }

    // Return updated myList with populated products
    const updatedUser = await User.findById(req.user._id).populate('myList');
    res.json(updatedUser.myList);

  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to My List' });
  }
};

// Remove from My List
exports.removeFromMyList = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    user.myList = user.myList.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('myList');
    res.json(updatedUser.myList);
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from My List' });
  }
};

// Get My List products
exports.getMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('myList');
    res.json(user.myList);
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching My List' });
  }
};