const Location = require("../models/location"); //connect model
const { cloudinary } = require("../cloudinary"); // for images
////ROUTING: "/locations"

//renders page with all Locations 
module.exports.index = async (req, res) => {
  const locations = await Location.find({}); //async callback to get all Locations
  res.render("locations/index", { locations });
}
//renders page to create new Location 
module.exports.renderNewForm = (req, res) => {
  res.render('locations/new');
}
//for new form to create new Location, validate, then redirect to it's page
module.exports.createLocation = async (req, res, next) => {
    const location = new Location(req.body.location);
    location.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    location.author = req.user._id;
    await location.save();
    req.flash('success', 'Successfully made a new location!');
    res.redirect(`/locations/${location._id}`);
}
//renders page for single Location (with given id)
module.exports.showLocation = async (req, res,) => {
  //find location in DB using id
  const location = await Location.findById(req.params.id).populate({
    path: 'reviews', // populate each review 
    populate: { //populate REVIEW author for each review
        path: 'author'
    }
}).populate('author'); //populate LOCATION author 
  if (!location) {
    req.flash('error', 'Cannot find that location!');
    return res.redirect('/locations');
  }
  res.render("locations/show", { location });
}
//renders edit page for single Location (with given id)
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
    const location = await Location.findById(id); //find Location to edit
    if (!location) {
      req.flash('error', 'Cannot find that location!');
      return res.redirect('/locations');
    }
    res.render("locations/edit", { location });
}
//for edit form to update Location info then redirect to it's page
module.exports.updateLocation = async (req, res) => {
  const { id } = req.params; //get id from url
  const location = await Location.findByIdAndUpdate(id, {
    ...req.body.location,
  });
  //map data into array
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  location.images.push(...imgs); //spread array to fit location format for push
  await location.save();
  //deleteImages is array from delete form
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename); //delete images from cloudinary
    }
    //delete image urls from mongo
    await location.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success', 'Successfully updated location!');
  res.redirect(`/locations/${location._id}`);
}
//delete Location with given id
module.exports.deleteLocation = async (req, res) => {
  const { id } = req.params;
  await Location.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted location')
  res.redirect("/locations");
} 