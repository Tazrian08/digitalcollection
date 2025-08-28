const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin, addAdmin, forgotPasswordStep1, resetPasswordStep2 } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.post('/admin/add', protect, addAdmin);
router.post('/forgot-password', forgotPasswordStep1);
router.post('/reset-password', resetPasswordStep2);

module.exports = router;