const Review = require("../models/reviewModel");
const Appointment = require("../models/appointmentModel");
const Service = require("../models/serviceModel");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");

const addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.userId !== userId) {
      return res.status(400).send("Invalid appointment");
    }

    const existing = await Review.findOne({ where: { appointmentId } });
    if (existing) {
      return res.status(400).send("Review already submitted for this appointment");
    }

    const review = await Review.create({
      appointmentId,
      userId,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.log("Error in leaving reviews! ", error);
    res.status(500).send("Error in leaving reviews!");
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review || review.userId !== userId) {
      return res.status(404).send("Review not found or unauthorized");
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({ message: "Review updated", review });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).send("Failed to update review");
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review || review.userId !== userId) {
      return res.status(404).send("Review not found or unauthorized");
    }

    await review.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).send("Failed to delete review");
  }
};

const replyToReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reply = req.body.reply;

    if (req.user.role !== "staff" && req.user.role !== "admin") {
      return res.status(403).send("Unauthorized to reply to reviews");
    }

    if (!reply) {
      return res.status(400).send("Reply cannot be empty");
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).send("Review not found");
    }

    review.staffReply = reply;
    await review.save();

    res.status(200).json({ message: "Reply added to review", review });
  } catch (error) {
    console.error("Error in replyToReview:", error);
    res.status(500).send("Error replying to review");
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Service },
        { model: Staff },
        { model: User, attributes: ["name", "email"] },
      ],
    });

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error fetching reviews ", err);
    res.status(500).send("Failed to fetch reviews");
  }
};

const getReviewByAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({
      where: { appointmentId: id },
      include: [
        { model: Service },
        { model: Staff },
        { model: User, attributes: ["name", "email"] },
      ],
    });

    if (!review) {
      return res.status(404).send("Review not found for this appointment");
    }
    res.status(200).json({ review });
  } catch (err) {
    console.error("Error fetching review by appointmentId:", err);
    res.status(500).send("Failed to fetch review");
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  replyToReview,
  getAllReviews,
  getReviewByAppointment,
};
