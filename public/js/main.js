
//namespace board 
var board = {};
var user ={};
var canvas,context,down;
var grid   = [null,0,0,0,0,0,0,0,0,0];
var isTurn = false;
var prevX=0,prevY=0,currX=0,currY=0;

var symbol;

var events = [['mousedown','mousemove','mouseup'],['touchstart','touchmove','touchend']];
var index;
var count=0;
var moved;

var socket = io();

board.init = function init(){
	 canvas = document.querySelector('#board');
	 context = canvas.getContext('2d');
		
		this.dimensions = {
				"width": canvas.clientWidth,
				"height":canvas.clientHeight
		};
		
		this.draw(context,canvas);
		
		if(!("ontouchstart" in document)){
			this.pointer = utils.captureMouse(canvas);
			index = 0;
			
		}else{
			index = 1;
			this.pointer = utils.captureTouch(canvas);
		}

		
		this.detect(canvas,context);
};

board.detect = function detect(){
	var that  = this;		
	canvas.addEventListener(events[index][1],function(e){
		if(isTurn && down){
			moved = true;
		    prevX = currX;
		    prevY = currY;
		    currX = that.pointer.x;
		    currY = that.pointer.y;
			that.findGrid(that.pointer,context);
		}
	});
	
	canvas.addEventListener(events[index][0],function(e){
		down = true;
		console.log('down');
		count++;
		if(event.touches)
	 	e = event.touches[0];
		_updatePointer(e);
	});
	
	canvas.addEventListener(events[index][2],function(e){
		down = false;
		if(symbol == "O" && count == 1 && moved){
			   count--;
			   moved = false;
			   socket.emit('game:changeTurn',user);
		}else if(symbol == "X" && count == 2 && moved){
			count =0;
			moved = false;
			socket.emit('game:changeTurn',user);
		}else if(!moved){
			count --;
			moved = false;
		}
	});
	
};

function _updatePointer(e){
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
}

board.findGrid  = function findGrid(pointer){
	var row = parseInt(pointer.y/(this.dimensions['height']/3)),
	    column = parseInt(pointer.x/(this.dimensions['width']/3)),
	    ID = row*3+column+1;
	user.ID = ID;
	 if(grid[ID]==0){
		 this.drawTicTac(ID);
	 }
}

board.drawTicTac = function drawTicTac(ID){
	
		var data  = {
				gameID:user.gameID,
				prevX:prevX,
				prevY:prevY,
				currX:currX,
				currY:currY
		}
     	context.save();
     	context.beginPath();
     	context.moveTo(prevX, prevY);
     	context.lineTo(currX, currY);
     	context.strokeStyle = 'rgb(0,255,0)';
     	context.lineWidth = 2;
     	context.stroke();
     	context.closePath();
	    context.restore();
	    socket.emit('drawing',data);
}

board.convertGridToImage = function convertGridToImage(ID){
	
}

board.draw = function draw(){
	var width = canvas.clientWidth;
	context.strokeStyle="rgb(255,100,0)";
	context.beginPath();
	context.moveTo(0,width/3);
	context.lineTo(width,width/3);
	context.moveTo(0,2*width/3);
	context.lineTo(width,2*width/3);
	context.moveTo(width/3,0);
	context.lineTo(width/3,width);
	context.moveTo(2*width/3,0);
	context.lineTo(2*width/3,width);
	context.stroke();
};

socket.on('drawing',function(data){
	    context.save();
     	context.beginPath();
     	context.moveTo(data.prevX, data.prevY);
     	context.lineTo(data.currX, data.currY);
     	context.strokeStyle = 'rgb(0,255,0)';
     	context.lineWidth = 2;
     	context.stroke();
     	context.closePath();
	    context.restore();
});

socket.on('game:turnStart',function(){
	isTurn = true;
});


socket.on('game:turnEnd',function(){
	isTurn = false;
});

socket.on('game:restart',function(){
	location.reload();
})


socket.on('game:symbol',function(msg){
	symbol = msg;
	console.log(symbol);
});


document.ontouchmove = function(e) {
    e.preventDefault();
}


window.onload = function(){
	
	socket.on('connected',function(msg){
		for(var x in msg){
			user[x] = msg[x];
		}
		console.log(user);
	});
	
	socket.on('start:game',function(){
		board.init();
	})
	
};