const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
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

module.exports = router;