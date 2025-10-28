const express = require('express');
const router = express.Router();
const conveyor = require('../controllers/conveyorController');

// Try to use existing auth middleware if present
let protect = (req, res, next) => next();
let admin = (req, res, next) => next();
try {
  const auth = require('../middleware/authMiddleware'); // adjust name if your project uses different file
  protect = auth.protect || protect;
  admin = auth.admin || admin;
} catch (err) {
  // no-op - if your project has different middleware, update the require path above
}

// public read
router.get('/', conveyor.list);

// admin upload
router.post('/upload', protect, admin, conveyor.uploadMiddleware, conveyor.create);

// admin delete
router.delete('/:id', protect, admin, conveyor.remove);

module.exports = router;