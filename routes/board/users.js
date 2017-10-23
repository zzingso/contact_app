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
  var user = request.flash("user")[0] || {};
  var errors = request.flash("errors")[0] || {};
  response.render("board/users/new", {user:user, errors:errors});
});

// create
router.post("/", function(request, response){
  User.create(request.body, function(err, user){
    if(err) {
      request.flash("user", request.body);
      request.flash("errors", parseError(err));
      return response.redirect("/users/new");
    }
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
      if(err) {
        request.flash("user", request.body);
        request.flash("errors", parseError(err));
        return response.redirect("/users/" + request.params.username+"/edit");
    }
    response.redirect("/users/"+user.username);
    });
  });
});

module.exports = router;

// Functions
function parseError(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message:"This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}
