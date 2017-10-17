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

//Routes
app.use("/", require("./routes/home"));

//Routes - Contact
app.use("/contact-home", require("./routes/contacts/home"));
app.use("/contact-home/contacts", require("./routes/contacts/contacts"));

//Routes - Board
app.use("/board-home", require("./routes/board/home"));
app.use("/board-home/posts", require("./routes/board/posts"));
app.use("/users", require("./routes/board/users"));

//Port setting
app.listen(3000, function(){
  console.log("server on!");
});
