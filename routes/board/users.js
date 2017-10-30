// routes/board/user.js

var express = require("express");
var router = express.Router();
var rootPath = require("rootpath")();
var User = require("models/User");
var util = require("../../util");

// Index
router.get("/", util.isLoggerdin, function(request, response){
  User.find({})
  .sort({username:1})
  .exec(function(err, users){
    if(err) return response.json(err);
    response.render("board/users/index", {users:users});
  });
});

// New
router.get("/new", function(request, response) {
  var user = request.flash("user")[0] || {};
  var errors = request.flash("errors")[0] || {};
  response.render("board/users/new", {user:user, errors:errors});
});

// create
router.post("/", function(request, response){
  User.create(request.body, function(err, user){
    if(err) {
      request.flash("user", request.body);
      request.flash("errors", util.parseError(err));
      return response.redirect("/users/new");
    }
    response.redirect("/users");
  });
});

// show
router.get("/:username", util.isLoggerdin, function(request, response) {
  User.findOne({username:request.params.username}, function(err, user) {
    if(err) return response.json(err);
    response.render("board/users/show", {user:user});
  });
});

// edit
router.get("/:username/edit", util.isLoggerdin, checkPermission, function(request, response) {
  var user = request.flash("user")[0];
  var errors = request.flash("errors")[0] || {};
  if(!user) {
    User.findOne({username:request.params.username}, function(err, user){
      if(err) return response.json(err);
      response.render("board/users/edit",  {username:request.params.username, user:user, errors:errors});
    });
  } else {
    response.render("board/users/edit", {username:request.params.username, user:user, errors:errors});
  }
});

// update
router.put("/:username", util.isLoggerdin, checkPermission, function(request, response) {
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
      if(err) {
        request.flash("user", request.body);
        request.flash("errors", util.parseError(err));
        return response.redirect("/users/" + request.params.username+"/edit");
    }
    response.redirect("/users/"+user.username);
    });
  });
});

module.exports = router;

// private functions // 2
function checkPermission(request, response, next){
 User.findOne({username:request.params.username}, function(err, user){
  if(err) return response.json(err);
  if(user.id != request.user.id) return util.noPermission(request, response);

  next();
 });
}
