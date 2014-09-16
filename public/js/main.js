
//namespace board 
var board = {};

var grid   = [null,0,0,0,0,0,0,0,0,0];
var isTurn = false;

board.init = function init(){
		var canvas = document.querySelector('#board');
		var context = canvas.getContext('2d');
		
		this.dimensions = {
				"width": canvas.clientWidth,
				"height":canvas.clientHeight
		};
		
		this.draw(context,canvas);
		
		if(!("ontouchstart" in document)){
			this.pointer = utils.captureMouse(canvas);
		}else
			this.pointer = utils.captureTouch(canvas);
		
		this.detect(canvas,context);
};

board.detect = function detect(canvas,context){
	
	var that  = this;
	canvas.addEventListener('mousemove',function(e){
		if(isTurn)
		 that.findGrid(that.pointer,context);
	});
};

board.findGrid  = function findGrid(pointer,context){
	var row = parseInt(pointer.y/(this.dimensions['height']/3)),
	    column = parseInt(pointer.x/(this.dimensions['width']/3)),
	    ID = row*3+column+1;	
	 if(grid[ID]==0){
		 this.drawTicTac(context);
	 }
}

board.drawTicTac = function drawTicTac(canvas,context){
	context.save();
	
	context.restrore();
}

board.convertGridToImage = function convertGridToImage(ID){
	
}

board.draw = function draw(context,canvas){
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

window.onload = function(){
	board.init();
};