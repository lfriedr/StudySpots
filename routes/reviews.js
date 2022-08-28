//connect express
const express = require("express");
//create router object
const router = express.Router({ mergeParams: true });
//connect models (compiled from schemas)
const Location = require("../models/location");
const Review = require("../models/review");
//connect schema for validating reviews
const { reviewSchema } = require("../schemas.js");
//utils for error handling
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

////ROUTING: "/locations/:id/reviews/"

//POST REVIEWS 
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id);
    const review = new Review(req.body.review);
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/locations/${location._id}`);
  })
);
//DELETE REVIEWS
router.delete(
  ":reviewId", 
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //pull reference to review with reviewId out of "reviews" array
    await Location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); 
    //delete entire review "reviewId"
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/locations/${id}`);
  })
);

module.exports = router;
