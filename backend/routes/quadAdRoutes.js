const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const QuadAd = require('../models/QuadAd');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/quad');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Ensure upload directory exists
const uploadDir = 'images/quad';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Get all quad ads (grouped by position)
router.get('/', async (req, res) => {
  const ads = await QuadAd.find({ active: true }).sort({ createdAt: -1 });
  // Group by position
  const grouped = { topLeft: [], topRight: [], bottomLeft: [], bottomRight: [] };
  ads.forEach(ad => grouped[ad.position].push(ad));
  res.json({ ads: grouped });
});

// Admin: Add new quad ad
router.post('/add', protect, upload.single('image'), async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const { position } = req.body;
  const image = req.file ? '/images/quad/' + req.file.filename : '';
  if (!position || !image) return res.status(400).json({ message: 'Position and image required' });
  const ad = new QuadAd({ position, image });
  await ad.save();
  res.status(201).json(ad);
});

// Admin: Delete quad ad
router.delete('/:id', protect, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const ad = await QuadAd.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    // Remove image file
    if (ad.image) {
      const imagePath = path.join(__dirname, '..', ad.image);
      fs.unlink(imagePath, err => {});
    }

    await ad.deleteOne();
    res.json({ message: 'Quad ad deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting quad ad' });
  }
});

module.exports = router;