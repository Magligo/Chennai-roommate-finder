const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/start', authMiddleware, conversationController.startConversation);
router.get('/', authMiddleware, conversationController.getUserConversations);
router.get('/:id', authMiddleware, conversationController.getConversationById);

module.exports = router;
