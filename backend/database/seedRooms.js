const db = require('./db');

// Sample room data
const rooms = [
    {
        user_id: 1,
        location: 'T Nagar, Chennai',
        rent: 12000,
        roommates_needed: 1,
        room_type: '2BHK',
        amenities: 'WiFi, AC, Parking',
        description: 'Spacious room in a well-maintained 2BHK flat. Close to bus stand and metro.',
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    },
    {
        user_id: 1,
        location: 'Velachery, Chennai',
        rent: 8500,
        roommates_needed: 2,
        room_type: '3BHK',
        amenities: 'WiFi, Gym, Backup Power',
        description: 'Need two roommates for a 3BHK high-rise apartment. Professionals preferred.',
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    },
    {
        user_id: 1,
        location: 'OMR, Chennai',
        rent: 15000,
        roommates_needed: 1,
        room_type: '1BHK',
        amenities: 'AC, Power Backup, Laundry',
        description: 'Independent 1BHK in a gated community. Perfect for IT professionals working in OMR.',
        image_url: 'https://images.unsplash.com/photo-1554995207-c18c20360a59?auto=format&fit=crop&w=800&q=80'
    },
    {
        user_id: 1,
        location: 'Adyar, Chennai',
        rent: 10000,
        roommates_needed: 1,
        room_type: '2BHK',
        amenities: 'WiFi, Parking, Near Beach',
        description: 'Lovely room in Adyar. Very close to the beach and nice cafes.',
        image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'
    }
];

function seed() {
    db.serialize(() => {
        // Check if user with ID 1 exists, if not, find the first user
        db.get('SELECT id FROM users LIMIT 1', (err, user) => {
            if (err) {
                console.error('Error finding user:', err);
                return;
            }

            const userId = user ? user.id : 1; // Fallback to 1 if no user found (though creation might fail)

            if (!user) {
                console.warn('No users found in database. Seeding might fail due to foreign key constraint.');
            }

            const stmt = db.prepare(`INSERT INTO rooms (user_id, location, rent, roommates_needed, room_type, amenities, description, image_url) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

            rooms.forEach(room => {
                stmt.run([userId, room.location, room.rent, room.roommates_needed, room.room_type, room.amenities, room.description, room.image_url]);
            });

            stmt.finalize((err) => {
                if (err) {
                    console.error('Error seeding rooms:', err);
                } else {
                    console.log('Successfully seeded sample rooms!');
                }
            });
        });
    });
}

seed();
