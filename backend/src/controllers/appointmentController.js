const AppointmentService = require('../services/appointmentService');

exports.bookAppointment = async (req, res) => {
  try {
    const { petId, vetId, date, startTime, endTime } = req.body;

    const appointment = await AppointmentService.bookAppointment({
      petId: parseInt(petId),
      vetId: parseInt(vetId),
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    if (error.message.includes('Double booking')) {
      return res.status(409).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
