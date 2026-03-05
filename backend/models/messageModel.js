const db = require('../database/db');

const Message = {
    create: (data, callback) => {
        const query = `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`;
        db.run(query, [data.sender_id, data.receiver_id, data.message_text], callback);
    },
    findByUser: (userId, callback) => {
        const query = `
            SELECT m.*, u1.name as sender_name, u2.name as receiver_name
            FROM messages m
            JOIN users u1 ON m.sender_id = u1.id
            JOIN users u2 ON m.receiver_id = u2.id
            WHERE m.sender_id = ? OR m.receiver_id = ?
            ORDER BY m.timestamp DESC
        `;
        db.all(query, [userId, userId], callback);
    }
};

module.exports = Message;
