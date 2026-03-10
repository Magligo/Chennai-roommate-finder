const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'roommate_finder.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            age INTEGER,
            occupation TEXT,
            preferred_location TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Room Posts table
        db.run(`CREATE TABLE IF NOT EXISTS rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            location TEXT NOT NULL,
            rent REAL NOT NULL,
            roommates_needed INTEGER NOT NULL,
            room_type TEXT,
            amenities TEXT,
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Room Needed Requests table
        db.run(`CREATE TABLE IF NOT EXISTS room_requests (
            request_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            preferred_location TEXT,
            budget REAL,
            gender_preference TEXT,
            occupation TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Roommate requests (join room) table
        db.run(`CREATE TABLE IF NOT EXISTS roommate_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER,
            requester_id INTEGER,
            owner_id INTEGER,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms (room_id),
            FOREIGN KEY (requester_id) REFERENCES users (id),
            FOREIGN KEY (owner_id) REFERENCES users (id)
        )`);

        // Conversations table
        db.run(`CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1_id INTEGER,
            user2_id INTEGER,
            room_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user1_id) REFERENCES users (id),
            FOREIGN KEY (user2_id) REFERENCES users (id),
            FOREIGN KEY (room_id) REFERENCES rooms (room_id)
        )`);

        // Messages table
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER,
            sender_id INTEGER,
            receiver_id INTEGER,
            message_text TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id),
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (receiver_id) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                console.error('Error creating messages table:', err.message);
                return;
            }
            // Safe migrations for existing DBs that were created without these columns
            db.run(`ALTER TABLE messages ADD COLUMN receiver_id INTEGER`, () => { });
            db.run(`ALTER TABLE messages ADD COLUMN is_read INTEGER DEFAULT 0`, () => { });
        });
    });
}

module.exports = db;
