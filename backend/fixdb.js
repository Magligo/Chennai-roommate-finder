const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/roommate_finder.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Cannot open DB:', err.message);
        process.exit(1);
    }
    console.log('Opened DB:', dbPath);
});

db.all("PRAGMA table_info(messages)", (err, cols) => {
    if (err) { console.error(err.message); return; }
    console.log('\n=== messages table columns ===');
    cols.forEach(c => console.log(' -', c.name, c.type));

    const colNames = cols.map(c => c.name);
    const todo = [];

    if (!colNames.includes('receiver_id')) todo.push(`ALTER TABLE messages ADD COLUMN receiver_id INTEGER`);
    if (!colNames.includes('is_read')) todo.push(`ALTER TABLE messages ADD COLUMN is_read INTEGER DEFAULT 0`);
    if (!colNames.includes('conversation_id')) todo.push(`ALTER TABLE messages ADD COLUMN conversation_id INTEGER`);
    if (!colNames.includes('created_at')) todo.push(`ALTER TABLE messages ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`);

    if (todo.length === 0) {
        console.log('\n✅ Schema is correct. No fixes needed.');
        db.close();
        return;
    }

    console.log('\n⚠️  Missing columns. Applying fixes...');
    let done = 0;
    todo.forEach(sql => {
        db.run(sql, (err2) => {
            if (err2) console.error('Error:', err2.message);
            else console.log('✅ Applied:', sql);
            if (++done === todo.length) {
                console.log('\nDone! Restart your backend server now.');
                db.close();
            }
        });
    });
});
