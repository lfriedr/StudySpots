const Joi = require("joi");
const { number } = require("joi");

//define required Joi Object and its properties
module.exports.locationSchema = Joi.object({
  location: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
//each review needs rating (1-5) & body
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
