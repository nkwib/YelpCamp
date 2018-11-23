var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index page
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/Index", {campgrounds: allCampgrounds, page: 'campgrounds'});
  }
  });
});

//Add a new Campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new")
});

//Post a new Campground
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground= {name: name, price:price, image: image, description: desc, author:author};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      req.flash("error", err.message);
    } else {
      req.flash("success", "You Have Created A Campground");
      res.redirect("/campgrounds");
    }
  });
});

//Show a Campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  // Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      req.flash("error", err.message);
    } else {
      console.log(foundCampground)
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
  });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      req.flash("error", err.message);
      res.redirect("/");
    } else {
      req.flash("success", "Campground Updated");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY A Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "You Have Deleted Your Campground");
      res.redirect("/campgrounds");
    }
  });
});

//export the module
module.exports = router;
