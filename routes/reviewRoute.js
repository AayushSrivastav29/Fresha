const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const isStaff = require("../middlewares/isStaff");

// Staff replies to a review
router.put("/update/:id", isStaff, reviewController.updateReview);
router.put("/reply/:id", isStaff, reviewController.replyToReview);
router.post("/add", isStaff, reviewController.addReview);
router.delete("/delete/:id", isStaff, reviewController.deleteReview);
router.get("/", isStaff, reviewController.getAllReviews);
router.get("/appointment/:id", isStaff, reviewController.getReviewByAppointment);
module.exports = router;
