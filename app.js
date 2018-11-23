var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require('mongoose'),
    flash      = require('connect-flash'),
    passport   = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require('./models/user'),
    geo        = require('mapbox-geocoding');
    seedDB     = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelp_campV8', { useNewUrlParser: true });
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the DB
geo.setAccessToken('pk.eyJ1Ijoibmt3aWIiLCJhIjoiY2pudXE3ZXc0MDV4ZDN4cW5kNWlmZnJvZiJ9.-XjbAixne592je76oHC1SA');
//setup passport
app.use(require("express-session")({
  secret: "secret word",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, function(){
  console.log("YelpCamp Server is running");
});
