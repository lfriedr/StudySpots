//For Sanitizing HTML  
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension)

//define required Joi Object and its properties
module.exports.locationSchema = Joi.object({
  location: Joi.object({
    //escapeHTML prevents HTML code in inputs 
    title: Joi.string().required().escapeHTML(), 
    location: Joi.string().required().escapeHTML(), 
    description: Joi.string().required().escapeHTML() 
  }).required(),
  deleteImages: Joi.array() //to allow deleteImages
});
//each review needs rating (1-5) & body
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()heroku --version
  }).required(),
});
