const db = require('../database/db');

const User = {
    create: (data, callback) => {
        const query = `INSERT INTO users (name, email, password, phone, age, occupation, preferred_location) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [data.name, data.email, data.password, data.phone, data.age, data.occupation, data.preferred_location], callback);
    },
    findByEmail: (email, callback) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], callback);
    },
    findById: (id, callback) => {
        const query = `SELECT id, name, email, phone, age, occupation, preferred_location, created_at FROM users WHERE id = ?`;
        db.get(query, [id], callback);
    }
};

module.exports = User;
