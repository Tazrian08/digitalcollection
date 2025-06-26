const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;