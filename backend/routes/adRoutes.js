const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Ad = require('../models/Ad');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/home');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const ads = await Ad.find({ active: true }).sort({ createdAt: -1 });
  res.json({ ads });
});

// Admin: Add new ad
router.post('/add', protect, upload.single('image'), async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const { title, subtitle, link } = req.body;
  const image = req.file ? '/images/home/' + req.file.filename : '';
  if (!title || !image) return res.status(400).json({ message: 'Title and image required' });
  const ad = new Ad({ title, subtitle, image, link });
  await ad.save();
  res.status(201).json(ad);
});

// Admin: Delete ad
router.delete('/:id', protect, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    // Remove image file
    if (ad.image) {
      const imagePath = path.join(__dirname, '..', ad.image);
      fs.unlink(imagePath, err => {
        // Ignore error if file doesn't exist
      });
    }

    await ad.deleteOne();
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting ad' });
  }
});

module.exports = router;