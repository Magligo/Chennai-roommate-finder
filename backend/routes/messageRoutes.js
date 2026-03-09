const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/conversations', authMiddleware, conversationController.getUserConversations);
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);
router.put('/mark-read/:conversationId', authMiddleware, messageController.markMessagesRead);
router.get('/:conversationId', authMiddleware, messageController.getMessagesByConversation);
router.post('/send', authMiddleware, messageController.sendMessage);

module.exports = router;
