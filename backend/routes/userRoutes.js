const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  addToMyList,
  removeFromMyList,
  getMyList
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

router.get('/mylist', getMyList);
router.post('/mylist/:productId', addToMyList);
router.delete('/mylist/:productId', removeFromMyList);

module.exports = router;