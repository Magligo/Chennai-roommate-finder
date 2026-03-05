const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, socialController.sendRequest);
router.get('/', authMiddleware, socialController.getRequestsForUser);
router.put('/:id', authMiddleware, socialController.updateRequestStatus);

module.exports = router;
