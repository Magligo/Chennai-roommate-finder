const db = require('../database/db');

// Messaging Controllers
exports.getMessages = (req, res) => {
    const userId = req.user.id;
    // Get all conversations for this user
    const query = `
        SELECT m.*, 
               u1.name as sender_name, 
               u2.name as receiver_name
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.timestamp DESC
    `;

    db.all(query, [userId, userId], (err, messages) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching messages', error: err.message });
        }
        res.json(messages);
    });
};

exports.sendMessage = (req, res) => {
    const { receiver_id, message_text } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message_text) {
        return res.status(400).json({ message: 'Please provide receiver and message text' });
    }

    const query = `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`;
    db.run(query, [sender_id, receiver_id, message_text], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error sending message', error: err.message });
        }
        res.status(201).json({
            message: 'Message sent',
            message_id: this.lastID,
            timestamp: new Date()
        });
    });
};

// Roommate Request Controllers
exports.sendRequest = (req, res) => {
    const { room_id, owner_id } = req.body;
    const requester_id = req.user.id;

    if (!room_id || !owner_id) {
        return res.status(400).json({ message: 'Missing room or owner ID' });
    }

    const query = `INSERT INTO roommate_requests (room_id, requester_id, owner_id, status) VALUES (?, ?, ?, 'pending')`;
    db.run(query, [room_id, requester_id, owner_id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error sending request', error: err.message });
        }
        res.status(201).json({ message: 'Request sent successfully', request_id: this.lastID });
    });
};

exports.updateRequestStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const query = `UPDATE roommate_requests SET status = ? WHERE id = ? AND owner_id = ?`;
    db.run(query, [status, id, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating request', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Request not found or unauthorized' });
        }
        res.json({ message: `Request ${status}` });
    });
};

exports.getRequestsForUser = (req, res) => {
    const userId = req.user.id;
    // Get requests received by the user (as owner) and sent by the user (as requester)
    const query = `
        SELECT rr.*, r.location, u.name as requester_name
        FROM roommate_requests rr
        JOIN rooms r ON rr.room_id = r.room_id
        JOIN users u ON rr.requester_id = u.id
        WHERE rr.owner_id = ? OR rr.requester_id = ?
    `;

    db.all(query, [userId, userId], (err, requests) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching requests', error: err.message });
        }
        res.json(requests);
    });
};
