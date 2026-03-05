const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, socialController.getMessages);
router.post('/send', authMiddleware, socialController.sendMessage);

module.exports = router;
