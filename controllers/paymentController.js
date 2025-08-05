const {
  createOrder,
  getPaymentStatusFromCashfree,
} = require("../services/cashfreeService");
const Order = require("../models/orderModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const sendEmail = require("../utils/sendEmail");
const path = require('path');

const getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname,"..", "public", "view", "paymentPage.html"));
};

const processPayment = async (req, res) => {
  try {
    const user = req.user;
    const { serviceId, staffId, date, startTime } = req.body;

    if (!serviceId || !staffId || !date || !startTime) {
      throw new AppError("Missing booking details", 400);
    }

    const service = await Service.findByPk(serviceId);
    const orderAmount = service.price;
    if (!service) return res.status(404).json({ message: "Service not found" });

    const orderId = Math.random().toString(36).substring(2, 15);
    await Order.create({
      orderId,
      userId: user.id,
      email: user.email,
      status: "pending",
      serviceId,
      staffId,
      date,
      startTime,
    });

    const paymentSessionId = await createOrder(orderId, user, orderAmount);

    res.status(200).json({ paymentSessionId, orderId });
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ where: { orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const orderStatus = await getPaymentStatusFromCashfree(orderId);

  console.log(orderStatus, "orderStatus", "<<<<<<<<<<<<<");
    if (orderStatus == "success") {
      const existing = await Appointment.findOne({
        where: {
          userId: order.userId,
          serviceId: order.serviceId,
          staffId: order.staffId,
          date: order.date,
          startTime: order.startTime,
        },
      });
      if (!existing) {
        const user = await User.findOne({ where: { email: order.email } });
        await finalizeBooking({
          serviceId: order.serviceId,
          staffId: order.staffId,
          date: order.date,
          startTime: order.startTime,
          user,
        });
      }
    }
    await Order.update({ status: orderStatus }, { where: { orderId } });
    res.sendFile("/home/aayush-srivastav/Desktop/Sharpener Prac/Project/Fresha/public/view/home.html");
  } catch (err) {
    console.error("Payment Status Error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const finalizeBooking = async ({
  serviceId,
  staffId,
  date,
  startTime,
  user,
}) => {
  try {
    if (!serviceId || !staffId || !date || !startTime) {
      return console.error("All fields are required");
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      console.error("Service not found");
      return;
    }
    const existing = await Appointment.findOne({
      where: { staffId, date, startTime },
    });
    if (existing) {
      console.error("This slot is already booked");
      return;
    }
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(
      startDateTime.getTime() + service.duration * 60000
    );
    const endTime = endDateTime.toTimeString().substring(0, 5);

    const appointment = await Appointment.create({
      userId: user.id,
      staffId,
      serviceId,
      date,
      startTime,
      endTime,
      status: "confirmed",
    });

    const subject = "Appointment Confirmed!";
    const htmlContent = `
    <h2>Hey ${user.name},</h2>
    <p>Your appointment for <strong>${service.name}</strong> has been confirmed!</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
    <p>Thank you for choosing our salon.</p>
  `;

    await sendEmail(user.email, subject, htmlContent);

    return appointment;
  } catch (error) {
    console.error("Error booking appointment:", error);
    return;
  }
};

module.exports = {
  processPayment,
  getPaymentStatus,
  getPaymentPage
};
