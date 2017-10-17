// routes/board/user.js

var express = require("express");
var router = express.Router();
var rootPath = require("rootpath")();
var User = require("models/User");

// Index
router.get("/", function(request, response){
  User.find({})
  .sort({username:1})
  .exec(function(err, users){
    if(err) return response.json(err);
    response.render("board/users/index", {users:users});
  });
});

// New
router.get("/new", function(request, response) {
  response.render("board/users/new", {user:{}});
});

// create
router.post("/", function(request, response){
  User.create(request.body, function(err, user){
    if(err) return res.json(err);
    response.redirect("/users");
  });
});

// show
router.get("/:username", function(request, response) {
  User.findOne({username:request.params.username}, function(err, user) {
    if(err) return response.json(err);
    response.render("board/users/show", {user:user});
  });
});

// edit
router.get("/:username/edit", function(request, response) {
  User.findOne({username:request.params.username}, function(err, user){
    if(err) return response.json(err);
    response.render("board/users/edit",  {user:user});
  });
});

// update
router.put("/:username", function(request, response) {
  User.findOne({username:request.params.username})
  .select("password")
  .exec(function(err, user) {
    if(err) return response.json(err);

    //update user obj
    user.originalPassword = user.password;
    user.password = request.body.newPassword ? request.body.newPassword : user.password;
    for(var p in request.body) {
      user[p] = request.body[p];
    }

    //save updated user
    user.save(function(err, user) {
      if(err) response.json(err);
      response.redirect("/users/" + request.params.username);
    });
  });
});

module.exports = router;
