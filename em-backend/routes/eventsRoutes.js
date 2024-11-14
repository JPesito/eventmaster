const express = require('express');
const eventsController = require('../controllers/eventsController');
const { authenticateJWT, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/eventsroom', authenticateJWT, eventsController.getEventsByRoom);

module.exports = router;
