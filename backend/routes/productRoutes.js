const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/query/search', searchProducts);

// Let's assume product management is restricted - protect middleware
// router.post('/', protect, createProduct);
router.post('/',  createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

