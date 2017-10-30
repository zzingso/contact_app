// util.js

var util = {};

util.parseError = function(errors) {
  var parsed = {};
  if(errors.name == "ValidationError") {
    for(var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == "11000" && errors.errmsg.indexOd("username") > 0) {
    parsed.username = { message : "This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

util.getDate = function(dateObj) {
  if(dateObj instanceof Date)
  return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
};

util.getTime = function(dateObj){
 if(dateObj instanceof Date)
  return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
};

util.isLoggerdin = function(request, response, next) {
  if(request.isAuthenticated()) {
    next();
  } else {
    request.flash("errors", {login:"Please login first"});
    response.redirect("/board-home/login");
  }
};

util.noPermission = function(request, response) {
  request.flash("errors", {login:"You don't have permission"});
  request.logout();
  response.redirect("/board-home/login");
};

module.exports = util;

// private functions
function get2digits (num){
 return ("0" + num).slice(-2);
}
