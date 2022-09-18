const User = require('../models/user');

//for get request to render register page 
module.exports.renderRegister = (req, res) => {
  res.render('users/register');
}
//for post request for form to create new user
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body; //what we want from the req body
    const user = new User({ email, username }); //create the new user object
    const registeredUser = await User.register(user, password); //hash password & store on user object
    //login to newly created user account
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Study Spots!');
        res.redirect('/locations');
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}

//for get request to render login page (serve login form)
module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}
//for post request to login
module.exports.login = (req, res) => {
  //authentication was successful 
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/locations'; //access user requested URL
  delete req.session.returnTo; //clear returnTo var
  res.redirect(redirectUrl); //redirect to user requested URL
}

//for get request to logout and return to locations page
module.exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/locations');
  });
}