const express = require('express');
const router = express.Router();
const { checkCompatibility } = require('../controllers/compatibilityController');

router.get('/', checkCompatibility);

module.exports = router;