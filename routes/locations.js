const express = require("express"); //connect express
const router = express.Router(); //create router object
const locations = require('../controllers/locations'); //controllers to clean up file
const catchAsync = require("../utils/catchAsync"); //utils for error handling
const { isLoggedIn, isAuthor, validateLocation } = require('../middleware'); //connect middleware
const multer = require('multer'); //needed to parse multipart form (for image upload)
const { storage } = require('../cloudinary'); //storage location made in cloudinary file
const upload = multer({ storage }); 
//connect model (compiled from schema)
const Location = require("../models/location");

////ROUTING: "/locations"

router.route('/')
  //renders page with all Locations 
  .get(catchAsync(locations.index)) 
  //for new form to create new Location, validate, then redirect to it's page
  .post(isLoggedIn, upload.array('image'), validateLocation, catchAsync(locations.createLocation))
    //multipart form so need upload.array to parse and save uploads from form

//renders page to create new Location (must be signed in)
router.get('/new', isLoggedIn, locations.renderNewForm);

//below "/new" so "new" isn't treated as "id"
router.route('/:id') 
  //renders page for single Location (with given id)
  .get(catchAsync(locations.showLocation))
  //for edit form to update Location info then redirect to it's page
  .put(isLoggedIn, isAuthor, upload.array('image'), validateLocation, catchAsync(locations.updateLocation))
  //delete Location with given id
  .delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation));

//renders edit page for single Location (with given id)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm))

module.exports = router;
