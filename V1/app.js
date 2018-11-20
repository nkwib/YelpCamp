var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://gabrigmm:3Bk-TebKm9r-s!2@cluster0-qoxuz.mongodb.net/test?retryWrites=true";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

var campgrounds = [
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg"},
  {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg"},
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg"},
  {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg"},
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg"},
  {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg"},
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg"},
  {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg"}
]

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
  res.render("new")
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground= {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.listen(3000, function(){
  console.log("YelpCamp Server is running");
});
