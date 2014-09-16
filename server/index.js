var express = require('express');

var app = express();

var path = require('path');

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.set('port',process.env.PORT || 3000);


app.use(express.static(__dirname + './../public'));

console.log(path.join(__dirname,'../public'));

/*app.get('/', function(req, res){
  res.sendFile('public/index.html', { root: 'C:/xampp/htdocs/tic-tac-toe' });
});*/




io.on('connection', function(socket){
	  socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	  });
});


http.listen(app.get('port'), function(){
  console.log('listening on *:3000');
});