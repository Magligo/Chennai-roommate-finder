const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/database/roommate_finder.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE messages ADD COLUMN receiver_id INTEGER", (err) => {
        if (err) console.log("receiver_id column might already exist");
        else console.log("Added receiver_id column");
    });
    db.run("ALTER TABLE messages ADD COLUMN is_read INTEGER DEFAULT 0", (err) => {
        if (err) console.log("is_read column might already exist");
        else console.log("Added is_read column");
    });
});
db.close();
