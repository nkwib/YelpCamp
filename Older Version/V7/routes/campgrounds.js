var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Index page
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/Index", {campgrounds: allCampgrounds});
  }
  });
});

//Add a new Campground
router.get("/new", function(req, res){
  res.render("campgrounds/new")
});

//Post a new Campground
router.post("/", function(req, res){
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

//Show a Campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  // Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground)
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//export the module
module.exports = router;
