var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Show new comment form
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", err.message);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

//Post new comment
router.post("/", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", "There Was An Error Whith The Database");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "There Was An Error While Creating The Comment");
        } else {
          //add username and ID
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "You Have Added A Comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

//Edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//Update comment logic
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Comment Updated");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "You Have Deleted Your Comment");
      res.redirect("/campgrounds/" + req.params.id);
    };
  });
});

//export module
module.exports = router;
