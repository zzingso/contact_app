//routes/board/home.js

var express = require("express");
var router = express.Router();

//Home
router.get("/", function(request, response){
  response.render("board/welcome");
});

router.get("/about", function(request, response){
  response.render("board/about");
});

module.exports = router;
