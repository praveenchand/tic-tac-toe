var express = require('express');

var app = express();

var path = require('path');

var http = require('http').Server(app);

var io = require('socket.io')(http);

var game = require('./game');

app.set('port',process.env.PORT || 4000);


app.use(express.static(__dirname + './../public'));



io.on('connection', function(socket){
	  	 game.init(io,socket);  
});



http.listen(app.get('port'), function(){
  console.log('listening on *:3000');
});

