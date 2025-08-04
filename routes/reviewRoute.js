const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const isStaff = require("../middleware/isStaff");
const auth = require("../middleware/auth");


// Staff replies to a review
router.put("/update/:id", auth, reviewController.updateReview);
router.put("/reply/:id", isStaff, reviewController.replyToReview);
router.post("/add",auth, reviewController.addReview);
router.delete("/delete/:id",auth, reviewController.deleteReview);
router.get("/", isStaff, reviewController.getAllReviews);
router.get("/appointment/:id", isStaff, reviewController.getReviewByAppointment);
module.exports = router;
