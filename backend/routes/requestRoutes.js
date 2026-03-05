const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, requestController.sendRequest);
router.get('/', authMiddleware, requestController.getRequestsForUser);
router.put('/:id', authMiddleware, requestController.updateRequestStatus);

module.exports = router;
