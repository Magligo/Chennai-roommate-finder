const db = require('../database/db');

exports.postRoom = (req, res) => {
    const { location, rent, roommates_needed, room_type, amenities, description, image_url } = req.body;
    const user_id = req.user.id;

    if (!location || !rent || !roommates_needed) {
        return res.status(400).json({ message: 'Please provide location, rent, and roommates needed' });
    }

    const query = `INSERT INTO rooms (user_id, location, rent, roommates_needed, room_type, amenities, description, image_url) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [user_id, location, rent, roommates_needed, room_type, amenities, description, image_url], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error posting room', error: err.message });
        }
        res.status(201).json({
            message: 'Room posted successfully',
            room_id: this.lastID
        });
    });
};

exports.getAllRooms = (req, res) => {
    const { location, maxRent, roommatesNeeded } = req.query;
    let query = `SELECT * FROM rooms WHERE 1=1`;
    const params = [];

    if (location) {
        query += ` AND location LIKE ?`;
        params.push(`%${location}%`);
    }
    if (maxRent) {
        query += ` AND rent <= ?`;
        params.push(maxRent);
    }
    if (roommatesNeeded) {
        query += ` AND roommates_needed >= ?`;
        params.push(roommatesNeeded);
    }

    query += ` ORDER BY created_at DESC`;

    db.all(query, params, (err, rooms) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching rooms', error: err.message });
        }
        res.json(rooms);
    });
};

exports.getRoomById = (req, res) => {
    const query = `SELECT r.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone 
                   FROM rooms r 
                   JOIN users u ON r.user_id = u.id 
                   WHERE r.room_id = ?`;
    db.get(query, [req.params.id], (err, room) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching room', error: err.message });
        }
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    });
};
