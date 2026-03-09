const db = require('../database/db');

const Conversation = {
    findOrCreate: (data, callback) => {
        // Normalize user IDs to ensure consistency (user1_id < user2_id)
        const u1 = Math.min(data.user1_id, data.user2_id);
        const u2 = Math.max(data.user1_id, data.user2_id);

        const checkQuery = `SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ? AND room_id = ?`;
        db.get(checkQuery, [u1, u2, data.room_id], (err, row) => {
            if (err) return callback(err);
            if (row) return callback(null, row.id);

            const insertQuery = `INSERT INTO conversations (user1_id, user2_id, room_id) VALUES (?, ?, ?)`;
            db.run(insertQuery, [u1, u2, data.room_id], function (err) {
                if (err) return callback(err);
                callback(null, this.lastID);
            });
        });
    },
    findById: (id, callback) => {
        const query = `
            SELECT c.*, r.location as room_title, u1.name as user1_name, u2.name as user2_name
            FROM conversations c
            JOIN rooms r ON c.room_id = r.room_id
            JOIN users u1 ON c.user1_id = u1.id
            JOIN users u2 ON c.user2_id = u2.id
            WHERE c.id = ?
        `;
        db.get(query, [id], callback);
    },
    findByUser: (userId, callback) => {
        const query = `
            SELECT 
                c.id, 
                c.room_id,
                r.location as room_title,
                u.name as other_user_name,
                (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND receiver_id = ? AND is_read = 0) as unread_count
            FROM conversations c
            JOIN rooms r ON c.room_id = r.room_id
            JOIN users u ON u.id = (CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END)
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY last_message_time DESC
        `;
        db.all(query, [userId, userId, userId, userId], callback);
    }
};

module.exports = Conversation;
