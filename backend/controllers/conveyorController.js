const fs = require('fs');
const path = require('path');
const ConveyorImage = require('../models/ConveyorImage');

// multer setup
const multer = require('multer');
const uploadDir = path.join(__dirname, '..', 'public', 'images', 'conveyor');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.originalname.replace(ext, '').replace(/\s+/g, '_').slice(0, 40);
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('image');

exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // store path as public-relative URL
    const relPath = `/images/conveyor/${req.file.filename}`;
    const doc = await ConveyorImage.create({
      filename: req.file.filename,
      path: relPath,
      caption: req.body.caption || ''
    });
    res.status(201).json({ image: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating conveyor image' });
  }
};

exports.list = async (req, res) => {
  try {
    const imgs = await ConveyorImage.find({}).sort({ createdAt: 1 }).lean();
    res.json({ images: imgs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching conveyor images' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await ConveyorImage.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // resolve disk path robustly
    const fileRel = doc.path.replace(/^\//, ''); // "images/conveyor/xxx.jpg"
    const filePath = path.resolve(__dirname, '..', 'public', fileRel);

    // attempt to unlink (non-blocking if missing)
    try {
      await fs.promises.unlink(filePath);
    } catch (unlinkErr) {
      // warn but continue to delete DB record
      console.warn('Failed to remove file from disk (may not exist):', unlinkErr.message || unlinkErr);
    }

    await doc.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error deleting conveyor image' });
  }
};