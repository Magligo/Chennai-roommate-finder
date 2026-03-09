const db = require('../database/db');

const Message = {
    create: (data, callback) => {
        const query = `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)`;
        db.run(query, [data.conversation_id, data.sender_id, data.receiver_id, data.message_text], callback);
    },
    findByConversation: (conversationId, callback) => {
        const query = `
            SELECT m.*, u.name as sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
        `;
        db.all(query, [conversationId], callback);
    },
    getUnreadCount: (userId, callback) => {
        const query = `SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0`;
        db.get(query, [userId], callback);
    },
    markAsRead: (conversationId, userId, callback) => {
        const query = `UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND receiver_id = ?`;
        db.run(query, [conversationId, userId], callback);
    }
};

module.exports = Message;
