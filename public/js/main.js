/*global io,React*/

// socket io
var socketio = io();
var test;
socketio.on("connected",function(){console.log("connected");});
socketio.on("disconnect",function(){});
socketio.on("emotionResult",function(data){
  console.log(data);
  var point=0,
  count=0;
  data.forEach(function(e){
    if(e.point){
      point+=parseFloat(e.point);
      count++;
      console.log(e.surface,point,e.point,count)
    }
  })
  point = (count!==0) ? point/count : 0;
  textarea.setProps({point:point/count});
});


socketio.emit("connected");

var OreTextArea = React.createClass({displayName: "OreTextArea",
  onClick() {
    socketio.emit("text",this.refs.textArea.getDOMNode().value);
  },
  render() {
    return (
      React.createElement("div", {classNma: "jumbotron"}, 
        React.createElement("h1", null, "Emotion Point System"), 
        React.createElement("span", null, "これの感情ポイントは", this.props.point, "です!"), 
        React.createElement("div", null, 
          React.createElement("textarea", {ref: "textArea", className: "form-control", rows: "3"}, "Input text here!!"), 
          React.createElement("button", {onClick: this.onClick}, "Go")
        )
      )
    );
  }
});

var textarea = React.render(
    React.createElement(OreTextArea, {point: "0"}),
    document.getElementById('main')
);
