const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, getAllContacts); // admin only
router.delete('/:id', protect, deleteContact); // admin only

module.exports = router;