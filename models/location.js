const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
//‘Models’ are higher-order constructors that take a schema and create an
//instance of a document equivalent to records in a relational database.

//schema is used as js representation of database data
const LocationSchema = new Schema({
  title: String,
  image: String,
  price: String,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //review model
    },
  ],
});

//middleware to delete all reviews after deleting a location
LocationSchema.post("findOneAndDelete", async function (doc) {
  //doc is document (location) that was deleted
  if (doc) {
    //delete all reviews whose id's are in the document's reviews array
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Location", LocationSchema);
