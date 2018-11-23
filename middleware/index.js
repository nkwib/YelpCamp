var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middlewareObj = {};

//middleware for checking if the user match the owner of the campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground Not Found");
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You Don't Have The Permission To Do That");
          res.redirect("back");
        };
      };
    });
  } else {
    req.flash("error", "You Need To Be Logged In");
    res.redirect("back")
  }
};

//middleware for checking if the user match the owner of the comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          res.redirect("back");
        };
      };
    });
  } else {
    res.redirect("back")
  }
};

//middleware for log in
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You Need To Be Logged In");
  return res.redirect("/login");
};

module.exports = middlewareObj
