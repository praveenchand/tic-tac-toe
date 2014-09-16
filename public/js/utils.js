var utils = 	{};

/**
 * capture the mouse events on an element
 */
utils.captureMouse = function(element){
	var mouse ={
			x:0,
			y:0
	}
	element.addEventListener('mousemove',function(event){
		var x,y;
		if(event.pageX || event.pageY){
			x = event.pageX;
			y = event.pageY;
		}else{
			x = event.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
			y = event.clientY+document.body.scrollTop+document.documentElement.scrollTop;
		}
		x -= element.offsetLeft; 
		y -= element.offsetTop;
		mouse.x = x;
		mouse.y = y;
	},false);
	return mouse;
}

utils.containsPoint = function (rect, x, y) {
	return !(x < rect.x || x > rect.x + rect.width ||
	y < rect.y || y > rect.y + rect.height);
	};

/**
 * capture the touch events on an element
 */
utils.captureTouch = function(element){
	var touch = {x:null,y:null,isPressed:false};
	
	element.addEventListener('touchstart',function(event){
		touch.isPressed = true;
	},false);
	
	element.addEventListener('touchend',function(event){
		touch.isPressed = false;
		touch.x = null;
		touhc.y = null;
	},false);
	
	element.addEventListener('touchmove',function(event){
		var x,y;
		var touch = event.touches[0];
		if(touch.pageX || touch.pageY){
			x = touch.pageX;
			y = touch.pageY;
		}else{
			x = touch.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
			y = touch.clientY+document.body.scrollTop+document.documentElement.scrollTop;
		}
		x -= element.offsetLeft; 
		y -= element.offsetTop;
		touch.x = x;
		touch.y = y;
	},false);
	
	return touch;
}
