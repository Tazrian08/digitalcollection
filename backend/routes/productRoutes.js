const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts, toggleStock } = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Multer setup for temp storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/query/search', searchProducts);

// Use multer for image uploads
router.post('/', upload.array('images'), createProduct);
router.put('/:id', protect, updateProduct);
router.patch('/:id/toggle-stock', protect, requireAdmin, toggleStock);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;

