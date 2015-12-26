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

var OreTextArea = React.createClass({
  onClick() {
    socketio.emit("text",this.refs.textArea.getDOMNode().value);
  },
  render() {
    return (
      <div classNma="jumbotron">
        <h1>Emotion Point System</h1>
        <span>これの感情ポイントは{this.props.point}です!</span>
        <div>
          <textarea ref="textArea" className="form-control" rows="3">Input text here!!</textarea>
          <button onClick={this.onClick}>Go</button>
        </div>
      </div>
    );
  }
});

var textarea = React.render(
    <OreTextArea point="0" />,
    document.getElementById('main')
);
