pr = print = console.log

var canvas = document.getElementById('tutorial');
canvas.setAttribute('height','700px');
canvas.setAttribute('width','1400px');

canvas.style.outline="3px solid black";


var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(0,0, 200, 700);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(1200, 0, 200, 700);

ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
ctx.fillRect(200, 500, 1000, 800);

ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
ctx.fillRect(1000, 400, 200, 100);

ctx.fillStyle = 'black';         // explicitly sets the text color to (default) 'black'
ctx.font = '50px monospace';
ctx.fillText ("Hello world!", 0, 50);  
ctx.fillText ("This is a longer string that is limited to 750 pixel.", 0, 100, 750);  
ctx.fillText ("This is a longer string that is limited to 300 pixel.", 0, 150, 300);  

// ctx.strokeStyle = 'navy'; // set the strokeStyle color to 'navy' (for the stroke() call below)
// ctx.lineWidth = 3.0;      // set the line width to 3 pixels
// ctx.beginPath();          // start a new path
// ctx.moveTo (150,30);      // set (150,20) to be the starting point
// ctx.lineTo (270,120);     // line from (150,30) to (270,120)
// // ctx.lineTo (30,120);      // horizontal line from (270,120) to (30,120)
// // ctx.lineTo (150,30);      // line back to the starting point (we could have called closePath() instead)
// ctx.stroke();             // actually draw the triangle shape in 'navy' color and 3 pixel wide lines
for(var i = 1; i < 7; i++){
	drawLine(200+i*150,50,200+i*150,500);
}

for(var j = 0; j < 6; j++){
	drawLine(200,50+j*150,1200,50+j*150);
}

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

ctx.beginPath();
ctx.moveTo(75, 50);
ctx.lineTo(100, 75);
ctx.lineTo(100, 25);
ctx.fill();

class ImageWrapper{
	constructor(src,ctx, x,y){
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
		this.ctx = ctx
	}

	draw(){
		if(this.moving){
			this.x += this.dx;
			this.y += this.dy;
			this.currStep++;
			this.moving = this.currStep < this.totalStep;
			print(this.totalStep)
			print(this.currStep)	
		}
		this.ctx.drawImage(this.img, this.x, this.y)
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

	}

	draw(){
		this.ctx.clearRect(0, 0, 500, 500);
		var animating = false
		for(var i in this.images){
			this.images[i].draw();
			if(this.images[i].moving){
				animating = true;
			}
		}
		if(animating){
			print('requested draw again')
			requestAnimationFrame(canvasPaintCaller)
		}
	}

	addNewImage(src,x,y){
		this.images.push(new ImageWrapper(src,this.ctx,x,y));
	}
}

manage = new CanvasManager(ctx);

function canvasPaintCaller(){
	manage.draw();	
}



manage.addNewImage('images/d1.jpg', 101,201);
manage.addNewImage('images/d1.jpg', 0,0);
manage.images[1].startAnimation(50,50,50);
manage.images[0].startAnimation(150,0,10);




canvas.addEventListener('mouseover', function(e) {
	// print('mouseovered');
	// Game.init();
	// Game.playGame();
	// manage.draw();

});

