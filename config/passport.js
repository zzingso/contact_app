// config/passport.js

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var rootPath = require("rootpath")();
var User = require("models/User");

// serialize & deserialize User
passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findOne({_id:id}, function(err, user){
      done(err, user);
    });
});

// local Strategy
passport.use("local-login",
    new LocalStrategy({
      usernameField : "username",
      passwordField : "password",
      passReqToCallback : true
    },
    function(request, username, password, done) {
      User.findOne({username:username})
      .select({password:1})
      .exec(function(err, user){
        if(err) return done(err);

        if(user && user.authenticate(password)) {
          return done(null, user);
        } else {
          request.flash("username", username);
          request.flash("errors", {login:"Incorrect username or password"});
          return done(null, false);
        }
      });
    }
  )
);

module.exports =  passport;
