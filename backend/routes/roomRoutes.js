const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('image'), roomController.postRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.delete('/:id', authMiddleware, roomController.deleteRoom);

module.exports = router;
