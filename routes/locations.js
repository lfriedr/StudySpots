//connect express
const express = require("express");
//create router object
const router = express.Router();
//connect schema for validating location
const { locationSchema } = require("../schemas.js");
//utils for error handling
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
//connect models (compiled from schemas)
const Location = require("../models/location");

//for post and put to make sure schema has all requirements
const validateLocation = (req, res, next) => {
  const { error } = locationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

////ROUTING: "/locations"

//renders page with all Locations 
router.get(
  "/",
  catchAsync(async (req, res) => {
    const locations = await Location.find({}); //async callback to get all Locations
    res.render("locations/index", { locations });
  })
);
//renders page to create new Location
router.get("/new", (req, res) => {
  res.render("locations/new");
});
//for new form to create new Location, validate, then redirect to it's page
router.post(
  "/",
  validateLocation,
  catchAsync(async (req, res, next) => {
    //if (!req.body.location) throw new ExpressError('Invalid Location Data', 400);
    const location = new Location(req.body.location);
    await location.save();
    req.flash('success', 'Successfully made a new location!');
    res.redirect(`/locations/${location._id}`);
  })
);
//renders page for single Location (with given id)
router.get(  //below "/new" so "new" isn't treated as "id"
  "/:id",
  catchAsync(async (req, res) => {
    //find location to edit in DB using id
    const location = await Location.findById(req.params.id).populate("reviews");
    if (!location) {
      req.flash('error', 'Cannot find that location!');
      return res.redirect('/locations');
    }
    res.render("locations/show", { location });
  })
);
//renders edit page for single Location (with given id)
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id); //find Location to edit
    if (!location) {
      req.flash('error', 'Cannot find that location!');
      return res.redirect('/locations');
    }
    res.render("locations/edit", { location });
  })
);
//for edit form to update Location info then redirect to it's page
router.put(
  "/:id",
  validateLocation,
  catchAsync(async (req, res) => {
    const { id } = req.params; //get id from url
    const location = await Location.findByIdAndUpdate(id, {
      ...req.body.location,
    });
    req.flash('success', 'Successfully updated location!');
    res.redirect(`/locations/${location._id}`);
  })
);
//delete Location with given id
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location')
    res.redirect("/locations");
  })
);

module.exports = router;
