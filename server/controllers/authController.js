const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'chennai_roommate_secret';

exports.signup = async (req, res) => {
    const { name, email, password, phone, age, occupation, preferred_location } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (name, email, password, phone, age, occupation, preferred_location) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(query, [name, email, hashedPassword, phone, age, occupation, preferred_location], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'User already exists with this email' });
                }
                return res.status(500).json({ message: 'Error creating user', error: err.message });
            }

            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '1d' });
            res.status(201).json({
                token,
                user: { id: this.lastID, name, email }
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error finding user', error: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
};

exports.getProfile = (req, res) => {
    const query = `SELECT id, name, email, phone, age, occupation, preferred_location, created_at FROM users WHERE id = ?`;
    db.get(query, [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching profile', error: err.message });
        }
        res.json(user);
    });
};
