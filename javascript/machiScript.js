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
	ctx.stroke();             // actually draw the triangle shape in 'navy' color and 3 pixel wide lines
	ctx.restore();
}

function printCards(cards){
	var str = "";
	for(i in cards){
		str += cards[i].name + " ";
	}
	return str;
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

class CanvasManager{
	constructor(ctx){
		this.ctx = ctx
		this.images = []
		this.lines = []

		this.top = 75;	
		this.bottom = 500;

		this.left = 200;
		this.right = 1200;
		
		this.boxWidth = (this.right - this.left) /7;
		this.boxHeight = (this.bottom - this.top) /2;

		for(var i = 0; i < 7; i++){
			var currLeft = this.left + i * this.boxWidth;

			this.addNewLine(currLeft, this.top, currLeft, this.bottom);
			this.addNewImage('images/RadioTower.jpg', currLeft+10, this.top+20);
		}

		for(var j = 0; j < 3; j++){
			this.addNewLine(this.left, this.top + j * this.boxHeight, this.right, this.top + j * this.boxHeight);
		}
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

		var cardList = Object.values(Cards);
		for(var i = 0; i < 7; i++){
			var currCard = cardList[i];
			var currLeft = this.left + currCard.position * this.boxWidth;

			ctx.fillText(currCard.name + ': ' + currCard.remain, currLeft+20, this.top+20);

		}

		
		ctx.fillText(Game.players[0].money, 10, 20);
		ctx.fillText(printCards(Game.players[0].cards), 10, 30);
		
		ctx.fillText(Game.players[1].money, this.left+10, this.bottom+20);
		ctx.fillText(printCards(Game.players[1].cards), this.left+10, this.bottom+30);
		
		ctx.fillText(Game.players[2].money, this.right+10,20);
		ctx.fillText(printCards(Game.players[2].cards), this.right+10,30);
		// Game.players[1].money
		// Game.players[2].money


		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		for(var i = 0; i < 7; i++){
			ctx.font = '14px monospace';
			var currLeft = this.left + i * this.boxWidth;

			// ctx.fillText('Card ' + i, currLeft+20, this.top+20);


			ctx.fillText('Card ' + (i+7), this.left + i*this.boxWidth+20, this.top + this.boxHeight+20);
			
			ctx.fillRect(this.left+i*this.boxWidth+10,this.top + this.boxHeight + 40, 100, 100);
		}



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

Game.init();
manage = new CanvasManager(ctx);


function canvasPaintCaller(){
	manage.draw();	
}



// manage.addNewImage('images/RadioTower.jpg', 0 + 10, top + 20);
// manage.addNewImage('images/d1.jpg', 101, 201);
// manage.addNewImage('images/d1.jpg', 0, 0);


manage.draw();

canvas.addEventListener('mouseover', function(e) {
	manage.draw();

});

// var counter = 0;
// var gameLoop = setInterval(function(){
// 	counter++;
//     Game.playTurn();
// 	manage.draw();
// 	if(Game.checkWinner() >= 0){
// 		clearInterval(gameLoop);
// 		print(counter);
// 		print('all done');

// 	}
// }, 500);

var a = readline('asdf');
print(a);