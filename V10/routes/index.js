var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//Show Landing Page
router.get("/", function(req, res){
  res.render("landing");
});

//Show Sign Up Page
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

//Post request to Sign Up
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === 'zitaficca'){
      newUser.isAdmin = true;}
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp "+ user.username);
           res.redirect("/campgrounds");
        });
    });
});

//Show Login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});

//Login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
});

//Logout logic
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
