const db = require('../database/db');

const Request = {
    create: (data, callback) => {
        const query = `INSERT INTO roommate_requests (room_id, requester_id, owner_id, status) VALUES (?, ?, ?, 'pending')`;
        db.run(query, [data.room_id, data.requester_id, data.owner_id], callback);
    },
    updateStatus: (id, ownerId, status, callback) => {
        const query = `UPDATE roommate_requests SET status = ? WHERE id = ? AND owner_id = ?`;
        db.run(query, [status, id, ownerId], callback);
    },
    findByUser: (userId, callback) => {
        const query = `
            SELECT rr.*, r.location, u.name as requester_name
            FROM roommate_requests rr
            JOIN rooms r ON rr.room_id = r.room_id
            JOIN users u ON rr.requester_id = u.id
            WHERE rr.owner_id = ? OR rr.requester_id = ?
        `;
        db.all(query, [userId, userId], callback);
    }
};

module.exports = Request;
