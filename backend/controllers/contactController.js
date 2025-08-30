const ContactMessage = require('../models/ContactMessage');

// Submit a new contact message
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

// Get all contact messages (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

// Delete a contact message (admin only)
exports.deleteContact = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await contact.deleteOne();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting contact' });
  }
};