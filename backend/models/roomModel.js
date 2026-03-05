const db = require('../database/db');

const Room = {
    create: (data, callback) => {
        const query = `INSERT INTO rooms (user_id, location, rent, roommates_needed, room_type, amenities, description, image_url) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [data.user_id, data.location, data.rent, data.roommates_needed, data.room_type, data.amenities, data.description, data.image_url], callback);
    },
    findAll: (filters, callback) => {
        let query = `SELECT * FROM rooms WHERE 1=1`;
        const params = [];
        if (filters.location) {
            query += ` AND location LIKE ?`;
            params.push(`%${filters.location}%`);
        }
        if (filters.maxRent) {
            query += ` AND rent <= ?`;
            params.push(filters.maxRent);
        }
        if (filters.roommatesNeeded) {
            query += ` AND roommates_needed >= ?`;
            params.push(filters.roommatesNeeded);
        }
        query += ` ORDER BY created_at DESC`;
        db.all(query, params, callback);
    },
    findById: (id, callback) => {
        const query = `SELECT r.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone 
                       FROM rooms r 
                       JOIN users u ON r.user_id = u.id 
                       WHERE r.room_id = ?`;
        db.get(query, [id], callback);
    },
    delete: (id, callback) => {
        const query = `DELETE FROM rooms WHERE room_id = ?`;
        db.run(query, [id], callback);
    }
};

module.exports = Room;
