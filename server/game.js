var content = new Array();
var winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];

var users = [];
var rooms  = new Array();
var userCount = 0;
var io;


exports.init = function(sio,socket){
	io = sio;
	var currentID = ++userCount,gameID = rooms[currentID/2-1];
	
	users.push(socket.id);
	console.log(userCount);
	//create a game room for every two users
	if(currentID%2  !=0){
	 gameID = ( Math.random() * 100000 ) | 0;
	 socket.join(gameID.toString());

	 rooms.push(gameID);
	}
	else{
		socket.join(gameID.toString());
		io.sockets.in(gameID.toString()).emit('start:game');
	}
	
	socket.emit('connected',{gameID:gameID.toString(),socketID:socket.id});
	
	socket.on('drawing',function(data){
		  io.sockets.in(data.gameID).emit('drawing', data);
	});
	//socket.on('playerMove',);
	
	socket.on('disconnect',disconnectUser);
	
}

function disconnectUser(){
	var index = users.indexOf(this.id);
	users.splice(index,1);
	userCount--;
}

function connectUser(sio,socket){
	
}

function showDrawing(data){
	  io.to(data.gameID).emit('drawing', data);
}



function checkForWinners(symbol){
	    for(var a = 0; a < winningCombinations.length; a++){
	        if(content[winningCombinations[a][0]] == symbol && content[winningCombinations[a][1]] == symbol && content[winningCombinations[a][2]] == symbol){
	        	io.emit('win','praveenchand');
	        }
	    }
}