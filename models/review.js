const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema is used as js representation of database data
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: { //associate author's user account with review
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Review", reviewSchema);
