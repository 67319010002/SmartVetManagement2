const prisma = require('../models/prisma');

class AppointmentService {
  /**
   * Book an appointment with No Double Booking logic using a transaction.
   */
  static async bookAppointment({ petId, vetId, date, startTime, endTime }) {
    // Start a transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // 1. Check if the vet has any overlapping appointments
      // We lock the rows or use serializable isolation if necessary, 
      // but Prisma handles concurrent queries well with transaction and time checks.
      const overlappingAppointments = await tx.appointment.findMany({
        where: {
          vetId: vetId,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          // An overlap occurs if the new appointment starts before an existing one ends
          // AND the new appointment ends after the existing one starts.
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ]
        }
      });

      if (overlappingAppointments.length > 0) {
        throw new Error('Double booking detected: The veterinarian is already booked for this time slot.');
      }

      // 2. If no overlap, create the appointment
      const appointment = await tx.appointment.create({
        data: {
          petId,
          vetId,
          date,
          startTime,
          endTime,
          status: 'CONFIRMED'
        }
      });

      return appointment;
    });
  }
}

module.exports = AppointmentService;
