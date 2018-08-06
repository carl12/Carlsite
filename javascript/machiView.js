pr = print = console.log

var canvas = document.getElementById('myCanvas');
canvas.setAttribute('height','700px');
canvas.setAttribute('width','1400px');

canvas.style.outline="3px solid black";


var ctx = canvas.getContext('2d');

function clickInObj(objX, objY, width, height, clickX, clickY){
	return clickX >= objX && clickX <= objX + width && clickY >= objY && clickY <= objY + height;	
}

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

function printCards(p){

	var str = "";
	for(i in p.cards){
		str += p.cards[i].name + " ";
	}
	return str;
}

function printLandmarks(p){
	var str = "";
	// print(land)
	for(i in p.landmarks){
		if(p.landmarks[i]){
			str += indexedCards[firstLandmarkLoc +parseInt(i)].name + " ";
		}
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
	constructor(src, x, y, width, height){
		this.src = src;
		this.x = x;
		this.y = y;
		if(width === undefined || height === undefined){	
			this.width = 105;
			this.height = 168;
		} else {
			this.width = width;
			this.height = height; 
		}

		this.currStep = 0;
		this.totalStep = 0;
		this.moving = false;
		this.dx = 0;
		this.dy = 0;

		this.img = new Image();
		this.img.src = src;
		var img = this.img;
	}

	draw(ctx){
		if(this.moving){
			this.x += this.dx;
			this.y += this.dy;
			this.currStep++;
			this.moving = this.currStep < this.totalStep;
			this.totalStep
			print(this.currStep)	
		}

		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	startAnimation(x,y,steps){
		this.dx = (x-this.x)/steps;
		this.dy = (y-this.y)/steps;
		this.currStep = 0;
		this.totalStep = steps;
		this.moving = true;
	}

	contains(x,y){
		return clickInObj(this.x, this.y, this.width, this.height, x, y);
	}
}

class cardImageWrapper extends ImageWrapper{
	constructor(card, x, y){
		super(card.src, x, y);
		this.card = card;
	}

	getCardIndexIfContains(x,y){
		if(this.contains(x,y)){
			return this.card.position;
		}
	}
}

class CanvasManager{
	constructor(ctx){
		this.messageText = "Starting messageText";
		this.ctx = ctx
		this.images = []
		this.cardImages = [];
		this.lines = []

		this.top = 75;	
		this.bottom = 500;

		this.left = 200;
		this.right = 1200;
		
		this.numCols = 8;
		this.numRows = 2;
		this.boxWidth = (this.right - this.left) /this.numCols;
		this.boxHeight = (this.bottom - this.top) / this.numRows;

		this.diceListening = false;
		this.rerollListening = false;
		this.buyListening = false;
		this.playerListening = false;
		this.stealListening = false;
		for(var i = 0; i < indexedEstablishments.length; i++){
			if(i < this.numCols){
				var currLeft = this.left + (i) * this.boxWidth;
				this.addNewCardImage(indexedEstablishments[i], currLeft+10, this.top+21);
			} else {
				var currLeft = this.left + (i-this.numCols) * this.boxWidth;
				this.addNewCardImage(indexedEstablishments[i], currLeft+10, this.top+21 + this.boxHeight);
			}
			this.addNewLine(currLeft, this.top, currLeft, this.bottom);
		}
		for(var i = 1; i <= indexedCards.length - firstLandmarkLoc; i++){
			var currLeft = this.right - this.boxWidth * i; 
			this.addNewCardImage(indexedCards[indexedCards.length - i], currLeft+10, this.bottom + 10);
		}
		this.addNewImage("images/d1.png", 1050+10,10,50,50);
		this.addNewImage("images/d2.png", 1125+10,10,50,50);
		//1050, 0, 150, 75
		this.addNewLine(1050+150/2, 0, 1050+150/2, 75);
		// for(var i = 0; i < 7; i++){
		// 	var currLeft = this.left + i * this.boxWidth;

		// 	this.addNewLine(currLeft, this.top, currLeft, this.bottom);
		// 	this.addNewImage('images/AmusementPark.jpg', currLeft+10, this.top+20);
		// }

		for(var j = 0; j < 3; j++){
			this.addNewLine(this.left, this.top + j * this.boxHeight, this.right, this.top + j * this.boxHeight);
		}
		// this.draw();
	}

	draw(){
		// this.ctx.clearRect(0, 0, 500, 500);
			ctx.font = '16px monospace';
		this.ctx.clearRect(0,0,canvas.width,canvas.height);

		this.ctx.fillStyle = 'rgb(200, 0, 0)';
		this.ctx.fillRect(0,0, 200, 700);

		this.ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
		this.ctx.fillRect(1200, 0, 200, 700);

		this.ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
		this.ctx.fillRect(200, 500, 1000, 800);

		this.ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
		this.ctx.fillRect(1050, 0, 150, 75);


		if(this.buyListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(900, 0, 150, 75);

			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("No Purchase", 900+40, 40);
		}
		if(this.rerollListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(900, 0, 150, 75);

			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("Keep Roll", 900+40, 40);
		}


		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		
		for(var i = 0; i < Game.players.length; i++){
			var p = Game.players[i];
			 if(i==0){
				ctx.save();
				ctx.translate( 0, 0 );
				ctx.rotate( Math.PI / 2 );
				ctx.textAlign = "left";
				ctx.fillText(p.name +": $"+p.money, 0, -this.left+10);
				ctx.fillText(printCards(p), 0, -this.left+25);
				ctx.fillText(printLandmarks(p), 0, -this.left+40);
				ctx.restore();

			} else if(i==1){
				
			ctx.fillText(p.name +": $"+p.money, this.left+10, this.bottom+12);
			ctx.fillText(printCards(p), this.left+10, this.bottom+27);
			ctx.fillText(printLandmarks(p), this.left+10, this.bottom+42);
			}
			else if(i ==2){
				ctx.save();
				ctx.translate( 0, 0 );
				ctx.rotate( -Math.PI / 2 );
				ctx.textAlign = "right";
				ctx.fillText(p.name +": $"+p.money, 0, this.right+10);
				ctx.fillText(printCards(p), 0, this.right+25);
				ctx.fillText(printLandmarks(p), 0, this.right+40);


				// ctx.fillText( "Right side text", 0,this.right+10 );
				// ctx.fillText( "Right side text", 0,this.right+10 );
				// ctx.fillText( "Right side text", 0,this.right+10 );
				ctx.restore();
			}
		}

		for(var i = 0; i < indexedEstablishments.length; i++){
			var currCard = indexedEstablishments[i];
			if(i < this.numCols){
				var currLeft = this.left + currCard.position * this.boxWidth;
				ctx.fillText(currCard.name + ': ' + currCard.remain, currLeft+3, this.top+20, this.boxWidth-5);
			} else {
				var currLeft = this.left + (currCard.position-this.numCols) * this.boxWidth;
				var currUp = this.top + this.boxHeight;
				ctx.fillText(currCard.name + ': ' + currCard.remain, currLeft+3, currUp + 20, this.boxWidth-5);
			}

		}

		ctx.fillText(this.messageText, 400, 50);

		


		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		



		var animating = false
		for(var i in this.images){
			this.images[i].draw(this.ctx);
			if(this.images[i].moving){
				animating = true;
			}
		}
		for(var i in this.cardImages){
			this.cardImages[i].draw(this.ctx);
			if(this.cardImages[i].moving){
				animating = true;
			}
		}
		for(var i in this.lines){
			this.lines[i].draw(this.ctx);
		}
		if(animating){
			print('requested draw again')
			requestAnimationFrame(this.draw.bind(this))
		}
	}

	addNewImage(src,x,y,width,height){
		this.images.push(new ImageWrapper(src,x,y,width,height));
	}

	addNewCardImage(card, x, y){
		this.cardImages.push(new cardImageWrapper(card, x, y));

	}

	addNewLine(x1,y1,x2,y2){
		this.lines.push(new LineWrapper(x1,y1,x2,y2));
	}

	checkClick(x,y){
		if(this.diceListening){
			var roll1 = clickInObj(1050, 0, 75, 75, x, y);
			var roll2 = clickInObj(1050+75, 0, 75, 75, x, y);

			if(roll1){
				return false;
			} else if(roll2){
				return true;
			}
		}
		if (this.rerollListening){
			if(clickInObj(900,0,150,75,x,y)){
				print('it worked!');
				return [false, false];
			}
			var roll1 = clickInObj(1050, 0, 75, 75, x, y);
			var roll2 = clickInObj(1050+75, 0, 75, 75, x, y);
			
			if(roll1 || roll2){
				print('rerolling');
				return [true, roll2];
			} 

		}
		if(this.buyListening){
			if(clickInObj(900,0,150,75,x,y)){
				return -1;
			}
			for(var i in this.cardImages){
				if(this.cardImages[i].contains(x,y)){
					return this.cardImages[i].card.position;
				}
			}
		}

		if(this.playerListening){
			print('taking player input')
		} else if(this.stealListening){
			print('steal listening');
		}



	}
	disableListeners(){
		this.diceListening = false;
		this.rerollListening = false;
		this.buyListening = false;
		this.stealListening = false;
		this.draw();
	}

	takeHumanInput(inputType){
		// print(inputType);
		if(inputType.phase == 0){
			this.messageText = "Roll Dice";
			this.diceListening = true;
		} else if (inputType.phase == 1){
			this.messageText = "Roll Again?";
			this.rerollListening = true;
		} else if (inputType.phase == 3){
			if(inputType.card == 7){
				this.messageText = "Choose Target to Steal From";
			} else {
				this.messageText = "Choose Player to Trade With, Building and Your Building";
			}
		} else if (inputType.phase == 4){
			this.messageText = "Choose Purchase";
			this.buyListening = true;
		}
		this.draw();

	}
}


// manage.addNewImage('images/RadioTower.jpg', 0 + 10, top + 20);
// manage.addNewImage('images/d1.jpg', 101, 201);
// manage.addNewImage('images/d1.jpg', 0, 0);





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

