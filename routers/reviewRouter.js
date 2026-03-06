const express = require("express");
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asynWrap.js");

const reviewController= require("../controllers/reviewcontroller.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");


// ================= CREATE REVIEW =================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewController.createReview)
);


// ================= DELETE REVIEW =================
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewController.deleteReview)
);


module.exports = router;