//routes/board/home.js

var express = require("express");
var router = express.Router();
var passport = require("../../config/passport");

//Home
router.get("/", function(request, response){
  response.render("board/welcome");
});

router.get("/about", function(request, response){
  response.render("board/about");
});

//Login
router.get("/login", function(request, response) {
  var username = request.flash("username")[0];
  var errors = request.flash("errors")[0] || {};
  response.render("board/login", {username:username, errors:errors});
});

// Post login
router.post("/login", function(request, response, next){
  var errors = {};
  var isValid = true;
  if(!request.body.username){
    errors.username = "Username is required!";
  }
  if(!request.body.password) {
    errors.password = "Password is required!";
  }

  if(isValid) {
    next();
  } else {
    request.flash("errors", errors);
    response.redirect("/board-home/login");
  }
},passport.authenticate("local-login", {
  successRedirect : "/board-home",
  failureRedirect : "/board-home/login"
}
));

// Logout
router.get("/logout", function(request, response){
  request.logout();
  response.redirect("/board-home");
});

module.exports = router;
