const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// TODO: Add authentication middleware here
router.post('/book', appointmentController.bookAppointment);

module.exports = router;
