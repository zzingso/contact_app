// routes/board/posts.js

var express = require("express");
var router = express.Router();
var rootPath = require("rootpath")();
var Post = require("models/Post");
var util = require("../../util");

// Index
router.get("/", function(request, response){
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return response.json(err);
    response.render("board/posts/index", {posts:posts});
  });
});

// New
router.get("/new", util.isLoggerdin, function(request, response){
  var post = request.flash("post")[0] || {};
  var errors = request.flash("errors")[0] || {};
  response.render("board/posts/new", { post:post, errors:errors });
});

// create
router.post("/", util.isLoggerdin, function(request, response){
  request.body.author = request.user._id;
  Post.create(request.body, function(err, post){
    if(err) {
      request.flash("post", request.body);
      request.flash("errors", util.parseError(err));
      return response.redirect("/board-home/posts/new");
    }
    response.redirect("/board-home/posts");
  });
});

// show
router.get("/:id", function(request, response){
  Post.findOne({_id:request.params.id})
  .populate("author")
  .exec(function(err, post){
    if(err) return response.json(err);
    response.render("board/posts/show", {post:post});
  });
});

// edit
router.get("/:id/edit", util.isLoggerdin, checkPermission, function(request, response){
  var post = request.flash("post")[0];
  var errors = request.flash("errors")[0] || {};
  if(!post) {
    Post.findOne({_id:request.params.id}, function(err, post){
      if(err) return response.json(err);
      response.render("board/posts/edit", {post:post, errors:errors});
    });
  } else {
    post._id = request.params.id;
    response.render("board/posts/edit", {post:post, errors:errors});
  }
});

// update
router.put("/:id", util.isLoggerdin, checkPermission, function(request, response){
  request.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:request.params.id}, request.body, {runValidators:true}, function(err, post){
    if(err) {
      request.flash("post", request.body);
      request.flash("errors", util.parseError(err));
      return response.redirect("/board-home/posts/" + request.params.id + "/edit");
    }
    response.redirect("/board-home/posts/" + request.params.id);
  });
});

// destory
router.delete("/:id", util.isLoggerdin, checkPermission, function(request, response){
  Post.remove({_id:request.params.id}, function(err){
    if(err) return response.json(err);
    response.redirect("/board-home/posts");
  });
});

module.exports = router;

// private functions
function checkPermission(request, response, next) {
  Post.findOne({_id:request.params.id}, function(err, post){
    if(err) return response.json(err);
    if(post.author != request.user.id) return util.noPermission(request, response);

    next();
  });
}
