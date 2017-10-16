// routes/board/posts.js

var express = require("express");
var router = express.Router();
var Post = require("../../models/Post");

// Index
router.get("/", function(request, response){
  Post.find({})
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return response.json(err);
    response.render("board/posts/index", {posts:posts});
  });
});

// New
router.get("/new", function(request, response){
  response.render("board/posts/new");
});

// create
router.post("/", function(request, response){
  Post.create(request.body, function(err, post){
    if(err) return response.json(err);
    response.redirect("/board-home/posts");
  });
});

// show
router.get("/:id", function(request, response){
  Post.findOne({_id:request.params.id}, function(err, post){
    if(err) return response.json(err);
    response.render("board/posts/show", {post:post});
  });
});

// edit
router.get("/:id/edit", function(request, response){
  Post.findOne({_id:request.params.id}, function(err, post){
    if(err) return response.json(err);
    response.render("board/posts/edit", {post:post});
  });
});

// update
router.put("/:id", function(request, response){
  request.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:request.params.id}, request.body, function(err, post){
    if(err) return response.json(err);
    response.redirect("/board-home/posts/" + request.params.id);
  });
});

// destory
router.delete("/:id", function(request, response){
  Post.remove({_id:request.params.id}, function(err){
    if(err) return response.json(err);
    response.redirect("/board-home/posts");
  });
});

module.exports = router;
