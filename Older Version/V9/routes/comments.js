var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Show new comment form
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err)
    } else {
      console.log(campground)
      res.render("comments/new", {campground: campground});
    }
  })
});

//Post new comment
router.post("/", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //add username and ID
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
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
      res.redirect("back");
    } else {
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
      res.redirect("/campgrounds/" + req.params.id);
    };
  });
});

// //middleware for log in
// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect("/login");
// }
//
// //middleware for checking if the user match the owner of the comment
// function checkCommentOwnership(req, res, next) {
//     if(req.isAuthenticated()){
//       Comment.findById(req.params.comment_id, function(err, foundComment){
//         if(err){
//           res.redirect("back");
//         } else {
//           if(foundComment.author.id.equals(req.user._id)) {
//             next();
//           } else {
//             res.redirect("back");
//           };
//         };
//       });
//     } else {
//       res.redirect("back")
//     }
//   };

//export module
module.exports = router;
