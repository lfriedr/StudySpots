//connect models
const Location = require("../models/location");
const Review = require("../models/review");

////ROUTING: "/locations/:id/reviews/"
//POST REVIEWS 
module.exports.createReview = async (req, res) => {
    const location = await Location.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/locations/${location._id}`);
}
//DELETE REVIEWS
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //pull reference to review with reviewId out of "reviews" array
    await Location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); 
    //delete entire review "reviewId"
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/locations/${id}`);
}