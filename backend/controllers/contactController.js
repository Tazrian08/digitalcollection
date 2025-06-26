const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if(!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const contactMsg = new ContactMessage({ name, email, message });
    await contactMsg.save();
    res.status(201).json({ message: 'Message received, we will contact you soon' });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting contact message' });
  }
};