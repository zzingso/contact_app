//routes/contact/contacts.js

var express = require("express");
var router = express.Router();
var rootPath = require("rootpath")();
var Contact = require("models/Contact");

//Contacts - Index
router.get("/", function(request, response){
  Contact.find({}, function(err, contacts){
    if(err) return response.json(err);
    response.render("contacts/index", {contacts:contacts});
  });
});

//Contacts - New
router.get("/new", function(request, response){
  response.render("contacts/new");
});

//Contacts - Create
router.post("/", function(request, response){
  Contact.create(request.body, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contact-home/contacts");
  });
});

//Contacts - show
router.get("/:id", function(request, response){
  Contact.findOne({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.render("contacts/show", {contact:contact});
  });
});

//Contacts - edit
router.get("/:id/edit", function(request, response){
  Contact.findOne({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.render("contacts/edit", {contact:contact});
  });
});

//Contacts - update
router.put("/:id", function(request, response){
  Contact.findOneAndUpdate({_id:request.params.id}, request.body, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contact-home/contacts/" + request.params.id);
  });
});

//Contacts - destroy
router.delete("/:id", function(request, response){
  Contact.remove({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contact-home/contacts");
  });
});

module.exports = router;
