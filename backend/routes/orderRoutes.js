const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, getOrderByOrderId, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/by-orderid/:orderId', getOrderByOrderId); // For both user and admin
router.put('/status/:orderId', updateOrderStatus); // Admin only

module.exports = router;