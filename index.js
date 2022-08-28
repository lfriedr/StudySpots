//// Basic logic to start server
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

//connect routers
const locations = require("./routes/locations");
const reviews = require("./routes/reviews");

//connect mongoDB using mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//start new Express app (creates new instance of Express)
const app = express();

//ejsmate for partials + connect to ejs + access views folder from absolute path
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

////MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//serve static assets to add images, stylesheets, js scripts
app.use(express.static(path.join(__dirname, 'public')))

//instantiate session (for flash and authentication)
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //can't access cookie client side (xss security)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//flash to set success and error on every request
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); //can access both in templates
    res.locals.error = req.flash('error'); 
    next();
})

//route handlers
app.use("/locations", locations);
app.use("/locations/:id/reviews", reviews);

//render homepage
app.get("/", (req, res) => {
  res.render("home");
});

//if an unknown URL is requested
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); //err will be passed to below func
});

//catch-all for all errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

//listen on port 3000 for connections
app.listen(3000, () => {
  console.log("listening on port 3000");
});
