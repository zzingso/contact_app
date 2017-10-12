var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

//DB settings
//환경변수에 저장된 값을 사용하여 mongoDB에 접속
mongoose.connect(process.env.MONGO_DB, { useMongoClient : true});
//mongoose의 db object를 가져와서 db변수에 저장
var db = mongoose.connection;

// /db 연결이 성공한 경우
db.once("open", function(){
  console.log("DB connected");
});

//db 연결에 실패한 경우
db.on("error", function(err){
  console.log("DB error : ", err);
});

//Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//DB schema
var contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});

var Contact = mongoose.model("contact", contactSchema);

//Routes
//Home
app.get("/", function(request, response){
  response.redirect("/contacts");
});

//Contacts - Index
app.get("/contacts", function(request, response){
  Contact.find({}, function(err, contacts){
    if(err) return response.json(err);
    response.render("contacts/index", {contacts:contacts});
  });
});

//Contacts - New
app.get("/contacts/new", function(request, response){
  response.render("contacts/new");
});

//Contacts - Create
app.post("/contacts", function(request, response){
  Contact.create(request.body, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contacts");
  });
});

//Contacts - show
app.get("/contacts/:id", function(request, response){
  Contact.findOne({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.render("contacts/show", {contact:contact});
  });
});

//Contacts - edit
app.get("/contacts/:id/edit", function(request, response){
  Contact.findOne({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.render("contacts/edit", {contact:contact});
  });
});

//Contacts - update
app.put("/contacts/:id", function(request, response){
  Contact.findOneAndUpdate({_id:request.params.id}, request.body, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contacts/" + request.params.id);
  });
});

//Contacts - destroy
app.delete("/contacts/:id", function(request, response){
  Contact.remove({_id:request.params.id}, function(err, contact){
    if(err) return response.json(err);
    response.redirect("/contacts");
  });
});

//Port setting
app.listen(3000, function(){
  console.log("server on!");
});
