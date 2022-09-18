const express = require('express'); //connect express
const router = express.Router(); //create router object
const passport = require('passport'); //passport for auth
const catchAsync = require('../utils/catchAsync'); //util for error handling
const User = require('../models/user'); //connect model (compiled from schema)
const users = require('../controllers/users'); //controllers to clean up file

router.route('/register')
  //render register page 
  .get(users.renderRegister)
  //form to create new user
  .post(catchAsync(users.register));

router.route('/login')
  //get request to render login page (serve login form)
  .get(users.renderLogin)
  //post request to login - passport.authenticate: use local login strategy, flash, redirect if error
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//get request to logout and return to locations page
router.get('/logout', users.logout);

module.exports = router; 