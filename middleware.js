const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");


// ================= CHECK LOGIN =================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};


// ================= SAVE REDIRECT =================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


// ================= CHECK LISTING OWNER =================
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing || !req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to edit this listing");
    return res.redirect(`/listing/${id}`);
  }

  next();
};


// ================= VALIDATE LISTING =================
module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
    req.flash("error", "Invalid listing data");
    return res.redirect("back");
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }

  next();
};


// ================= VALIDATE REVIEW =================
module.exports.validateReview = (req, res, next) => {
  if (!req.body.review) {
    req.flash("error", "Invalid review data");
    return res.redirect("back");
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }

  next();
};


// ================= CHECK REVIEW AUTHOR =================
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review || !req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to edit this review");
    return res.redirect(`/listing/${id}`);
  }

  next();
};