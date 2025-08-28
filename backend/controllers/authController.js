const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if(userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const userExists2 = await User.findOne({ phone });
    if(userExists2) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const user = new User({ name, email, password, phone, address});
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(user && await user.matchPassword(password)) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password) && user.isAdmin) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addAdmin = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    // Only allow if current user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new User({
      name,
      email,
      password,
      phone,
      address,
      isAdmin: true
    });
    await admin.save();
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      address: admin.address,
      isAdmin: admin.isAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 1: Find user by email and return masked phone
exports.forgotPasswordStep1 = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.phone) {
      return res.status(404).json({ message: 'Email not found' });
    }
    // Mask phone: show first 3 digits, rest as *
    const maskedPhone = user.phone.slice(0, 3) + '*****';
    res.json({ maskedPhone, phone: user.phone });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 2: Reset password
exports.resetPasswordStep2 = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};