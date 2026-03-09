const Conversation = require('../models/conversationModel');

exports.startConversation = (req, res) => {
    const { receiver_id, room_id } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !room_id) {
        return res.status(400).json({ message: 'Missing receiver_id or room_id' });
    }

    Conversation.findOrCreate({ user1_id: sender_id, user2_id: receiver_id, room_id }, (err, conversationId) => {
        if (err) return res.status(500).json({ message: 'Error starting conversation', error: err.message });
        res.json({ conversationId });
    });
};

exports.getUserConversations = (req, res) => {
    Conversation.findByUser(req.user.id, (err, conversations) => {
        if (err) return res.status(500).json({ message: 'Error fetching conversations', error: err.message });
        res.json(conversations);
    });
};

exports.getConversationById = (req, res) => {
    Conversation.findById(req.params.id, (err, conversation) => {
        if (err) return res.status(500).json({ message: 'Error fetching conversation', error: err.message });
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        res.json(conversation);
    });
};
