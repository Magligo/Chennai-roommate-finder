const Message = require('../models/messageModel');

exports.getMessagesByConversation = (req, res) => {
    const { conversationId } = req.params;
    Message.findByConversation(conversationId, (err, messages) => {
        if (err) return res.status(500).json({ message: 'Error fetching messages', error: err.message });
        res.json(messages);
    });
};

exports.sendMessage = (req, res) => {
    const { conversation_id, message_text } = req.body;
    const sender_id = req.user.id;

    if (!conversation_id || !message_text) {
        return res.status(400).json({ message: 'Please provide conversation_id and message text' });
    }

    // Find the receiver_id from the conversation
    const Conversation = require('../models/conversationModel');
    Conversation.findById(conversation_id, (err, conv) => {
        if (err || !conv) return res.status(500).json({ message: 'Conversation not found' });

        const receiver_id = (conv.user1_id === sender_id) ? conv.user2_id : conv.user1_id;

        Message.create({ conversation_id, sender_id, receiver_id, message_text }, function (err) {
            if (err) return res.status(500).json({ message: 'Error sending message', error: err.message });
            res.status(201).json({
                id: this.lastID,
                conversation_id,
                sender_id,
                receiver_id,
                message_text,
                created_at: new Date()
            });
        });
    });
};

exports.getUnreadCount = (req, res) => {
    Message.getUnreadCount(req.user.id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching unread count', error: err.message });
        res.json({ unreadCount: result.count });
    });
};

exports.markMessagesRead = (req, res) => {
    const { conversationId } = req.params;
    Message.markAsRead(conversationId, req.user.id, (err) => {
        if (err) return res.status(500).json({ message: 'Error marking messages as read', error: err.message });
        res.json({ message: 'Messages marked as read' });
    });
};
