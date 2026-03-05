const Room = require('../models/roomModel');

exports.postRoom = (req, res) => {
    const { location, rent, roommates_needed, room_type, amenities, description } = req.body;
    let { image_url } = req.body;
    const user_id = req.user.id;

    if (req.file) {
        image_url = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (!location || !rent || !roommates_needed) {
        return res.status(400).json({ message: 'Please provide location, rent, and roommates needed' });
    }

    Room.create({ user_id, location, rent, roommates_needed, room_type, amenities, description, image_url }, function (err) {
        if (err) return res.status(500).json({ message: 'Error posting room', error: err.message });
        res.status(201).json({ message: 'Room posted successfully', room_id: this.lastID });
    });
};

exports.getAllRooms = (req, res) => {
    const { location, maxRent, roommatesNeeded } = req.query;
    Room.findAll({ location, maxRent, roommatesNeeded }, (err, rooms) => {
        if (err) return res.status(500).json({ message: 'Error fetching rooms', error: err.message });
        res.json(rooms);
    });
};

exports.getRoomById = (req, res) => {
    Room.findById(req.params.id, (err, room) => {
        if (err) return res.status(500).json({ message: 'Error fetching room', error: err.message });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    });
};

exports.deleteRoom = (req, res) => {
    const roomId = req.params.id;
    const userId = req.user.id;

    Room.findById(roomId, (err, room) => {
        if (err) return res.status(500).json({ message: 'Error fetching room', error: err.message });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own rooms' });
        }

        Room.delete(roomId, (err) => {
            if (err) return res.status(500).json({ message: 'Error deleting room', error: err.message });
            res.json({ message: 'Room deleted successfully' });
        });
    });
};
