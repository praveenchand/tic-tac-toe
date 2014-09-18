var content = new Array();
var winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];

var gameRooms = {};
var rooms  = new Array();
var userCount = 0;
var io;


exports.init = function(sio,socket){
	io = sio;
	var currentID = ++userCount,gameID = rooms[currentID/2-1];

	
	//console.log(userCount);
	//create a game room for every two users
	if(currentID%2  !=0 || gameID == undefined){
	 gameID = ( Math.random() * 100000 ) | 0;
	 socket.join(gameID.toString());
	 rooms.push(gameID);
	 assignID();
	}
	else{
		socket.join(gameID.toString());
		io.sockets.in(gameID.toString()).emit('start:game');
		assignID();
		assignSymbols({gameID:gameID.toString(),socketID:socket.id});
		console.log(gameRooms);
	}
	
	function assignID (){
		if(!gameRooms.hasOwnProperty(gameID)){
			gameRooms[gameID] = [];
		}
		
		gameRooms[gameID].push({
			socketID:socket.id,
			symbol:null,
			isTurn:false
		});
		
		socket.gameID = gameID.toString();
		
	}

	
	socket.emit('connected',{gameID:gameID.toString(),socketID:socket.id});
	
	socket.on('drawing',function(data){
		  io.sockets.in(data.gameID).emit('drawing', data);
	});
	
	socket.on('game:changeTurn',manageTurns);
	//socket.on('playerMove',);
	
	socket.on('disconnect',disconnectUser);
	
}

function assignSymbols(data){
	  for(var x in gameRooms[data.gameID]){
		   if(data.socketID != gameRooms[data.gameID][x].socketID){
			   io.to(gameRooms[data.gameID][x].socketID).emit('game:symbol','X');
			   gameRooms[data.gameID][x].symbol = "x";
			   io.to(gameRooms[data.gameID][x].socketID).emit('game:turnStart');
		   }else{
				  io.to(data.socketID).emit('game:symbol','O');
				  gameRooms[data.gameID][x].symbol = "O";
		   }
	  }
	  

}

function manageTurns(data){
	  for(var x in gameRooms[data.gameID]){
	   if(data.socketID != gameRooms[data.gameID][x].socketID){
		   io.to(gameRooms[data.gameID][x].socketID).emit('game:turnStart');
	   }
	  }
  io.to(data.socketID).emit('game:turnEnd');
  
}

function disconnectUser(){	
	  for(var x in gameRooms[this.gameID]){
			 if(this.id != gameRooms[this.gameID][x].socketID){
				   io.to(gameRooms[this.gameID][x].socketID).emit('game:restart');
					userCount--;
		  }
			  }
/*	 for(var x in gameRooms[this.gameID]){
		 if(this.id == gameRooms[this.gameID][x].socketID){
			   io.to(gameRooms[this.gameID][x].socketID).emit('game:restart');
				userCount--;
	  }
		  }*/
	/*var index  = */
	userCount--;
	delete gameRooms[this.gameID];
	console.log(gameRooms);
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