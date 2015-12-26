var express = require('express');
var fs=require('fs');
var path    = require("path");
var kuromoji = require("kuromoji");

var app = express();
var port=process.env.PORT || 4000;

var f={};
var wordPoint = require(__dirname+'/data/word_point.json')

app.use(express.static(__dirname + '/public'));

function viewFile(fileName){
  return path.join(__dirname+'/views/'+fileName)
}

app.get('/', function (req, res) {
  console.log("request index.html");
  // var output = fs.readFileSync("./index.html", "utf-8");
  // res.end(output);
  res.sendFile(viewFile('index.html'))
});


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


// socket.io
var io = require("socket.io").listen(server);
var userHash = {};
var user_num=0;
// event
io.sockets.on("connection", function (socket) {

  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  socket.on("connected", function () {
    console.log("connected");
    userHash[socket.id] = true;
    user_num++;
  });

  socket.on("text",function(text){
    var retPoint = point(text);
    io.to(socket.id).emit('emotionResult',retPoint);
  });

  socket.on("disconnect", function () {
    console.log("disconnect");
    if (userHash[socket.id]) {
      delete userHash[socket.id];
      user_num--;
    }
  });

});


kuromoji.builder({ dicPath:__dirname+'/data/dict/' }).build(function (err, tokenizer) {
    // tokenizer is ready
    f.wakati = function(text){
      return tokenizer.tokenize(text);
    }
});


function point(text){
  var words = f.wakati(text);
  var retWords=[];
  words.forEach(function(e,idx){
    var ret = {};
    retWords[idx]=ret;
    ret.surface=e.surface_form;
    if(e.word_type !== 'KNOWN') return;
    if(!(e.pos.match(/形容詞|動詞|名詞|副詞/))) return;

    var p = wordPoint[e.basic_form]
    if(p){
      ret.point = p;
    }
  });
  return retWords;
}
