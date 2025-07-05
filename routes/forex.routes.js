const express = require('express');
const router = express.Router();
const { getForexData } = require('../controllers/forex.controller');

// هذا هو الـ endpoint الرئيسي
router.get('/', getForexData);

module.exports = router;
