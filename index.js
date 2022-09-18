//// Basic logic to start server
//if not in production mode, use .env file to set environment variables
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require('passport'); //for authentication strategies
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet'); //security
const mongoSanitize = require('express-mongo-sanitize'); //security
//connect routers
const locationRoutes = require("./routes/locations");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require('./routes/users');

//use mongo to store session
const MongoDBStore = require("connect-mongo")(session);
//connect to Mongo Atlas or local db using mongoose
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/study-spots';
mongoose.connect(dbUrl, {
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
//mongo injection security - replace if query begins with $ sign or contain a . 
app.use(mongoSanitize({
  replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
//session store using Mongo
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 //update if change or every 24 hrs
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

////MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//serve static assets to add images, stylesheets, js scripts
app.use(express.static(path.join(__dirname, 'public')))

//instantiate session (for flash and authentication)
const sessionConfig = {
    store, //uses Mongo for store
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //can't access cookie client side (xss security)
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//flash to set success and error on every request
app.use(flash());
//helmet to prevent xss
app.use(helmet({crossOriginEmbedderPolicy: false}));
//allowed sources
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/",
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

//for persistent login session
app.use(passport.initialize());
app.use(passport.session()); //must be after session
//have passport use local strategy with authicate method from user model (passport-local)
//LocalStrategy fetches the user record from the app's database and verify the hashed password against the password submitted by the user. 
passport.use(new LocalStrategy(User.authenticate()));
//have passport use function to serialize and deserialize user from user model
passport.serializeUser(User.serializeUser()); //store in session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user; //set currentUser as passport user
  res.locals.success = req.flash('success'); //can access both in templates
  res.locals.error = req.flash('error'); 
  next();
})

//route handlers
app.use('/', userRoutes);
app.use("/locations", locationRoutes);
app.use("/locations/:id/reviews", reviewRoutes);

//render homepage
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/eecs", (req, res) => {
  res.render("eecs");
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
//PORT is defined on Heroku
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})