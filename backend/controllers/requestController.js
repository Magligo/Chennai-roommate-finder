const Request = require('../models/requestModel');

exports.sendRequest = (req, res) => {
    const { room_id, owner_id } = req.body;
    const requester_id = req.user.id;

    if (!room_id || !owner_id) {
        return res.status(400).json({ message: 'Missing room or owner ID' });
    }

    Request.create({ room_id, requester_id, owner_id }, function (err) {
        if (err) return res.status(500).json({ message: 'Error sending request', error: err.message });
        res.status(201).json({ message: 'Request sent successfully', request_id: this.lastID });
    });
};

exports.updateRequestStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    Request.updateStatus(id, req.user.id, status, function (err) {
        if (err) return res.status(500).json({ message: 'Error updating request', error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Request not found or unauthorized' });
        res.json({ message: `Request ${status}` });
    });
};

exports.getRequestsForUser = (req, res) => {
    Request.findByUser(req.user.id, (err, requests) => {
        if (err) return res.status(500).json({ message: 'Error fetching requests', error: err.message });
        res.json(requests);
    });
};
