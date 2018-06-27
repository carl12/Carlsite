pr = print = console.log

var canvas = document.getElementById('tutorial');
canvas.setAttribute('height','700px');
canvas.setAttribute('width','1400px');

canvas.style.outline="3px solid black";


var ctx = canvas.getContext('2d');


function drawLine(x1,y1,x2,y2){
	ctx.save();
	ctx.strokeStyle = 'navy'; // set the strokeStyle color to 'navy' (for the stroke() call below)
	ctx.lineWidth = 3.0;      // set the line width to 3 pixels
	ctx.beginPath();          // start a new path
	ctx.moveTo (x1,y1);      // set (150,20) to be the starting point
	ctx.lineTo (x2,y2);     // line from (150,30) to (270,120)
	// ctx.lineTo (30,120);      // horizontal line from (270,120) to (30,120)
	// ctx.lineTo (150,30);      // line back to the starting point (we could have called closePath() instead)
	ctx.stroke();             // actually draw the triangle shape in 'navy' color and 3 pixel wide lines
	ctx.restore();
}

class LineWrapper{
	constructor(x1,y1,x2,y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	draw(){
		drawLine(this.x1,this.y1,this.x2,this.y2);
	}

}

class ImageWrapper{
	constructor(src, x,y){
		this.src = src
		this.x = x
		this.y = y

		this.currStep = 0
		this.totalStep = 0
		this.moving = false
		this.dx = 0
		this.dy = 0

		this.img = new Image();
		this.img.src = src;
		var img = this.img
	}

	draw(ctx){
		if(this.moving){
			this.x += this.dx;
			this.y += this.dy;
			this.currStep++;
			this.moving = this.currStep < this.totalStep;
			print(this.totalStep)
			print(this.currStep)	
		}

		ctx.drawImage(this.img, this.x, this.y, 100, 100)
	}

	startAnimation(x,y,steps){
		this.dx = (x-this.x)/steps;
		this.dy = (y-this.y)/steps;
		this.currStep = 0;
		this.totalStep = steps;
		this.moving = true;
	} 


}

class CanvasManager {
	constructor(ctx) {
		this.ctx = ctx
		this.images = []
		this.lines = []

	}

	draw(){
		// this.ctx.clearRect(0, 0, 500, 500);
		this.ctx.clearRect(0,0,canvas.width,canvas.height);

		this.ctx.fillStyle = 'rgb(200, 0, 0)';
		this.ctx.fillRect(0,0, 200, 700);

		this.ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
		this.ctx.fillRect(1200, 0, 200, 700);

		this.ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
		this.ctx.fillRect(200, 500, 1000, 800);

		this.ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
		this.ctx.fillRect(1050, 0, 150, 75);

		var animating = false
		for(var i in this.images){
			this.images[i].draw(this.ctx);
			if(this.images[i].moving){
				animating = true;
			}
		}
		for(var i in this.lines){
			this.lines[i].draw(this.ctx);
		}
		if(animating){
			print('requested draw again')
			requestAnimationFrame(canvasPaintCaller)
		}
	}

	addNewImage(src,x,y){
		this.images.push(new ImageWrapper(src,x,y));
	}

	addNewLine(x1,y1,x2,y2){
		this.lines.push(new LineWrapper(x1,y1,x2,y2));
	}
}

manage = new CanvasManager(ctx);

function drawBox(){

	var top = 75;
	var bottom = 500;

	var left = 200;
	var right = 1200;
	
	var width = (right-left)/7;
	var height = (bottom - top)/2;

	for(var i = 0; i < 7; i++){
		ctx.font = '14px monospace';
		var currLeft = left+i*width;

		ctx.fillText('Card '+i,currLeft+20,top+20);
		manage.addNewLine(currLeft,top,currLeft,bottom)
		// ctx.fillRect(left+i*width+10,top+40,100,100);
		manage.addNewImage('images/RadioTower.jpg',currLeft+10,top+20);

		ctx.fillText('Card ' + (i+7),left+i*width+20,top+height+20);
		
		ctx.fillRect(left+i*width+10,top+height+40,100,100);
	}

	for(var j = 0; j < 3; j++){
		manage.addNewLine(left,top+j*height,right,top+j*height);
	}
	
}

drawBox();

function canvasPaintCaller(){
	manage.draw();	
}



manage.addNewImage('images/RadioTower.jpg', 0 + 10, top + 20);
manage.addNewImage('images/d1.jpg', 101, 201);
manage.addNewImage('images/d1.jpg', 0, 0);




canvas.addEventListener('mouseover', function(e) {
	// print('mouseovered');
	// Game.init();
	// Game.playGame();
	manage.draw();

});

