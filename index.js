var express = require("express");
var mongoose = require("mongoose");
var app = express();

//DB setting
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

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.listen(3000, function(){
  console.log("server on!");
});
