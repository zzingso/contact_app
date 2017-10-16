//routes/home.js

var express = require("express");
var router = express.Router();

//Home
router.get("/", function(request, response){
  response.redirect("/contact-home/contacts");
});

module.exports = router;
