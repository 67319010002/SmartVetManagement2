const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
