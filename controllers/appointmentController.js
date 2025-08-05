const Staff = require("../models/staffModel");
const Service = require("../models/serviceModel");
const Appointment = require("../models/appointmentModel");
const StaffAvailability = require("../models/staffAvailability");
const ServiceAvailability = require("../models/serviceAvailabilty");
const User = require("../models/userModel");

const { Op } = require("sequelize");
const sendEmail = require("../utils/sendEmail.js");

const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    if (!serviceId || !date) {
      return res.status(400).send("serviceId and date are required");
    }
    const dayOfWeek = new Date(date)
      .toLocaleString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
    console.log(dayOfWeek, "dayOfWeek", "<<<<<<<<<<<<<");
    const service = await Service.findByPk(serviceId, {
      include: {
        model: ServiceAvailability,
        where: {
          dayOfWeek: {
            [Op.like]: `%${dayOfWeek}%`,
          },
        },
      },
    });
    if (!service || service.ServiceAvailabilities.length === 0) {
      return res.status(404).send("No service availability on this day");
    }
    const duration = service.duration; // in minutes
    const assignedStaff = await Staff.findAll({
      include: [
        {
          model: Service,
          where: { id: serviceId },
        },
        {
          model: StaffAvailability,
          as: "availability",
          where: {
            dayOfWeek: {
              [Op.like]: `%${dayOfWeek}%`,
            },
          },
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const results = [];

    for (const staff of assignedStaff) {
      const staffAvail = staff.availability.find((a) =>
        a.dayOfWeek.includes(dayOfWeek)
      );
      const serviceAvail = service.ServiceAvailabilities.find((a) =>
        a.dayOfWeek.includes(dayOfWeek)
      );
      console.log(staffAvail, "staffAvail", serviceAvail, "serviceAvail");
      if (!staffAvail || !serviceAvail) continue;

      const startTime =
        staffAvail.startTime > serviceAvail.startTime
          ? staffAvail.startTime
          : serviceAvail.startTime;
      const endTime =
        staffAvail.endTime < serviceAvail.endTime
          ? staffAvail.endTime
          : serviceAvail.endTime;

      const slots = [];
      let current = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      while (current.getTime() + duration * 60000 <= end.getTime()) {
        const formatted = current.toTimeString().substring(0, 5);
        console.log(formatted, "formatted", "<<<<<<<");
        const conflict = await Appointment.findOne({
          where: {
            staffId: staff.id,
            date,
            startTime: formatted,
          },
        });

        if (!conflict) {
          slots.push(formatted);
        }

        current = new Date(current.getTime() + duration * 60000);
      }
      console.log(slots, "slots", "<<<<<<<<<<<<<<<");
      results.push({
        staffId: staff.id,
        staffName: staff.User?.name || "Unknown",
        availableSlots: slots,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while fetching slots");
  }
};
const validateBeforePayment = async (req, res) => {
  try {
    const { serviceId, staffId, date, startTime } = req.body;

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).send("Service not found");

    const existing = await Appointment.findOne({
      where: { staffId, date, startTime },
    });
    if (existing) return res.status(400).send("Slot already booked");

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Validation failed");
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, date, startTime, userId } = req.body;
    //const userId = req.user.id;

    if (!serviceId || !staffId || !date || !startTime) {
      return res.status(400).send("All fields are required");
    }

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).send("Service not found");

    const existing = await Appointment.findOne({
      where: { staffId, date, startTime },
    });
    if (existing) return res.status(400).send("This slot is already booked");

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(
      startDateTime.getTime() + service.duration * 60000
    );
    const endTime = endDateTime.toTimeString().substring(0, 5);

    const appointment = await Appointment.create({
      userId,
      staffId,
      serviceId,
      date,
      startTime,
      endTime,
      status: "confirmed",
    });
    const user = await User.findByPk(userId);
    const subject = "Appointment Confirmed!";
    const htmlContent = `
        <h2>Hey ${user.name},</h2>
        <p>Your appointment for <strong>${service.name}</strong> has been confirmed!</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p>Thank you for choosing our salon</p>
      `;
    await sendEmail(user.email, subject, htmlContent);
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Error booking appointment");
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        Service,
        {
          model: Staff,
          include: { model: User, attributes: ["name"] },
        },
      ],
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching your appointments");
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Service },
        {
          model: Staff,
          include: { model: User, attributes: ["name"] },
        },
      ],
      order: [["date", "DESC"]],
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching all appointments");
  }
};
const rescheduleAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { date, startTime } = req.body;

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [User, Service],
    });
    if (!appointment) return res.status(404).send("Appointment not found");

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === appointment.userId;
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .send("You are not authorized to modify this appointment");
    }
    if (appointment.status !== "confirmed") {
      return res
        .status(400)
        .send("Only confirmed appointments can be rescheduled");
    }

    const service = appointment.Service;
    const user = await User.findByPk(appointment.userId);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(
      startDateTime.getTime() + service.duration * 60000
    );
    const endTime = endDateTime.toTimeString().substring(0, 5);

    const conflict = await Appointment.findOne({
      where: {
        staffId: appointment.staffId,
        date,
        startTime,
        id: { [Op.ne]: appointmentId }, // skip current appointment
      },
    });
    if (conflict)
      return res.status(400).send("This time slot is already booked");

    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = "rescheduled";
    await appointment.save();

    const subject = "Appointment Rescheduled";
    const htmlContent = `
      <h2>Hi ${user.name},</h2>
      <p>Your appointment for <strong>${service.name}</strong> has been <span style="color:orange;"><strong>rescheduled</strong></span>.</p>
      <p><strong>New Date:</strong> ${date}</p>
      <p><strong>New Time:</strong> ${startTime} - ${endTime}</p>
    `;

    await sendEmail(user.email, subject, htmlContent);
    res.status(200).json({ message: "Appointment rescheduled", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rescheduling appointment");
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [User, Service],
    });

    if (!appointment) return res.status(404).send("Appointment not found");

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === appointment.userId;
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .send("You are not authorized to modify this appointment");
    }
    await appointment.destroy();
    const service = appointment.Service;
    const user = await User.findByPk(appointment.userId);

    const subject = "Appointment cancelled";
    const htmlContent = `
  <h2>Hi ${user.name},</h2>
  <p>Your appointment for <strong>${service.name}</strong> has been <span style="color:red;"><strong>cancelled</strong></span>.</p>
  <p><strong>Original Date:</strong> ${appointment.date}</p>
  <p><strong>Original Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
  <p>If this was a mistake or you need to rebook, please visit our booking page.</p>
  <p>We hope to serve you soon!</p>
`;
    await sendEmail(user.email, subject, htmlContent);
    res
      .status(200)
      .json({ message: "Appointment cancelled (deleted) successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cancelling appointment");
  }
};

module.exports = {
  validateBeforePayment,
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  rescheduleAppointment,
  cancelAppointment,
};
