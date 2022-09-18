const { locationSchema, reviewSchema } = require("./schemas.js"); //for validation (JOI)
const ExpressError = require('./utils/ExpressError');
//connect models for validating reviews and locations
const Location = require('./models/location');
const Review = require('./models/review');

//check that schema has all requirements (JOI)
module.exports.isLoggedIn = (req, res, next) => {
  //isAuthenticated: from passport (uses session) and is on request object
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;  //store initial user requested URL
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
} 
//for post and put to make sure schema has all requirements
module.exports.validateLocation = (req, res, next) => {
  const { error } = locationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//find author and see if author is current user
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const location = await Location.findById(id);
  if (!location.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/locations/${id}`);
  }
  next();
}
//find review author and see if author is current user
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/locations/${id}`);
  }
  next();
}
//check that schema has all requirements (JOI)
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};