/*global io*/

var socketio = io();
var test;
socketio.on("connected",function(){console.log("connected");});
socketio.on("disconnect",function(){});
socketio.on("emotionResult",function(data){
  console.log(data);
});


socketio.emit("connected");
socketio.emit("text","今日はいい天気ですね");
