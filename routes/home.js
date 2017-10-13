//routes/home.js

var express = require("express");
var router = express.Router();

//Home
router.get("/", function(request, response){
  response.redirect("/contacts");
});

module.exports = router;
