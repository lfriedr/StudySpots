const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema is used as js representation of database data
const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
