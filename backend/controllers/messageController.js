const Message = require('../models/messageModel');

exports.getMessages = (req, res) => {
    Message.findByUser(req.user.id, (err, messages) => {
        if (err) return res.status(500).json({ message: 'Error fetching messages', error: err.message });
        res.json(messages);
    });
};

exports.sendMessage = (req, res) => {
    const { receiver_id, message_text } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message_text) {
        return res.status(400).json({ message: 'Please provide receiver and message text' });
    }

    Message.create({ sender_id, receiver_id, message_text }, function (err) {
        if (err) return res.status(500).json({ message: 'Error sending message', error: err.message });
        res.status(201).json({ message: 'Message sent', message_id: this.lastID, timestamp: new Date() });
    });
};
