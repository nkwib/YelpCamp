var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// var Campground = mongoose.model("Campground", campgroundSchema);
//
// Campground.create({
//   name: "Granite Hill",
//   image: "https://d38om4ir5igmin.cloudfront.net/production/clients/3511/pictures/1648/content/overview.jpg",
//   description: "Beautiful place with lakes and bla bla bla"
// }, function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("NEW CAMP CREATED");
//     console.log(campground);
//   }
// });

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("Index", {campgrounds: allCampgrounds});
  }
  });
});

app.get("/campgrounds/new", function(req, res){
  res.render("new")
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground= {name: name, image: image, description: desc};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, function(){
  console.log("YelpCamp Server is running");
});
