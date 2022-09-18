const express = require("express"); //connect express
const router = express.Router({ mergeParams: true }); //create router object
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware'); //connect middleware
const reviews = require('../controllers/reviews'); //controllers to clean up file
//connect models
const Location = require("../models/location");
const Review = require("../models/review");
//utils for error handling
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

////ROUTING: "/locations/:id/reviews/"
//to post reviews 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
//to delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
