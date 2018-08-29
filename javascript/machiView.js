pr = print = console.log

var canvas = document.getElementById('myCanvas');
var outputBox = document.getElementById('outputText');


print = function(...outputText){
	console.log(...outputText)
	for(var i = 0; i < outputText.length; i++){
		outputBox.innerHTML += outputText[i];
	}
	outputBox.innerHTML += "\n";
}
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
	for(i in p.landmarks){
		if(p.landmarks[i]){
			str += indexedCards[FIRST_LANDMARK_LOC +parseInt(i)].name + " ";
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
	constructor(card, x, y, width, height){
		super(card.src, x, y, width, height);
		this.card = card;
	}

	getCardIndexIfContains(x,y){
		if(this.contains(x,y)){
			return this.card.position;
		}
	}
}

class CanvasManager{
	constructor(canvas, outputBox){
		this.canvas = canvas
		this.outputBox = outputBox;
		this.canvasHeightFraction = 0.98;
		this.canvasWidthFraction = 0.8;
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.setAttribute('height',this.windowHeight*this.canvasHeightFraction+"px");
		this.canvas.setAttribute('width', this.windowWidth*this.canvasWidthFraction+"px");
		this.outputBox.style.height = this.windowHeight*this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth*(1-this.canvasWidthFraction)-10)+"px";

		this.imageHolder = [];
		this.images = [];
		this.landmarkLocs = [];
		this.animatingLocs = [];
		this.animating = false;
		this.numPlayers = 0;
		for(var i = 0; i < indexedCards.length; i++){
			this.imageHolder[i] = new Image();
			this.imageHolder[i].src = indexedCards[i].src;
		}

		this.messageText = "Starting messageText";

		this.top = 0;
		this.statusBarHeight = 75;
		this.estTop = this.top + this.statusBarHeight;	
		this.pWidth = 160;

		this.bottom = canvas.height - this.pWidth;
		this.left = this.pWidth;
		this.right = canvas.width - this.pWidth;
		
		this.numCols = 8;
		this.numRows = 2;

		this.game = undefined;
		this.diceListening = false;
		this.rerollListening = false;
		this.buyListening = false;
		this.playerListening = false;
		this.stealListening = false;

		this.initImagesAndLines();
	}

	initImagesAndLines(){
		this.images = []
		this.cardImages = []
		this.lines = []
		for(var i = 0; i < indexedEstablishments.length; i++){
			if(i < this.numCols){
				var currLeft = this.left + (i) * this.boxWidth;
				this.addNewCardImage(indexedEstablishments[i], currLeft+10, this.estTop+21, this.boxWidth - 20, this.boxHeight - 25);
			} else {
				var currLeft = this.left + (i-this.numCols) * this.boxWidth;
				this.addNewCardImage(indexedEstablishments[i], currLeft+10, this.estTop+21 + this.boxHeight, this.boxWidth - 20, this.boxHeight - 25);
			}
			this.addNewLine(currLeft, this.estTop, currLeft, this.bottom);
		}

		// this.addNewImage("images/d1.png", this.right - 150 + 10, 10,50,50);
		
		this.addNewImage("images/d1.png", this.right - 150 + 10, this.top + 10, 50, 50);
		this.addNewImage("images/d2.png", this.right - 150/2 + 10, this.top + 10, 50, 50);
		//1050, 0, 150, 75
		this.addNewLine(this.right - 150/2 , this.top, this.right - 150/2, this.estTop);

		for(var j = 0; j < 3; j++){
			this.addNewLine(this.left, this.estTop + j * this.boxHeight, this.right, this.estTop + j * this.boxHeight);
		}		
	}

	setDimensions(){

		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.canvas.setAttribute('height',this.windowHeight*this.canvasHeightFraction+"px");
		this.canvas.setAttribute('width', this.windowWidth*this.canvasWidthFraction+"px");

		this.outputBox.style.height = this.windowHeight*this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth*(1-this.canvasWidthFraction)-13)+"px";

		this.numPlayers = this.game.players.length;
		this.left = 0;
		this.top = 0;
		this.right = canvas.width;
		this.bottom = canvas.height;

		if (this.numPlayers >= 1){
			this.left = this.pWidth;
		} if (this.numPlayers >= 2){
			this.bottom = canvas.height - this.pWidth;
		} if (this.numPlayers >= 3){
			this.right = canvas.width - this.pWidth;
		} if (this.numPlayers >= 4){
			this.top = this.pWidth;
		} else {
		}

		this.estTop = this.top + this.statusBarHeight;
		this.boxWidth = (this.right - this.left) /this.numCols;
		this.boxHeight = (this.bottom - this.estTop) / this.numRows;
		this.initImagesAndLines();
	}
	animateBuy(player, card){
		if(card.position >= FIRST_LANDMARK_LOC){
			return;
		}
		var x = this.cardImages[card.position].x;
		var y = this.cardImages[card.position].y;
		this.addNewImage(card.src, x,y, 100, 150)
		var x,y;
		var left = 0; var midHoriz = (this.left+this.right)/2; var right = canvas.width;
		var up = 0; var midVert = canvas.height/2; var down = canvas.height;
		var loc = [[left-100, midVert], [midHoriz, down], [right, midVert], [midHoriz, up-160]][player]

		this.images[this.images.length - 1].startAnimation(...loc,100)
	}

	draw(){
		if(this.windowHeight !== window.innerHeight || this.windowWidth !== window.innerWidth){
			this.setDimensions();
		} else if(this.numPlayers == 0 && this.game !== undefined){
			this.setDimensions()
		} else if (this.game === undefined && this.numPlayers === 0){
			this.drawMenu();
			return;
		}
		// this.setDimensions(this.game.players.length);
		// this.initImagesAndLines();
		
		this.ctx.clearRect(0,0,canvas.width,canvas.height);


		this.drawPlayerPalates();
		this.drawStatusBar();
		this.drawCardsLinesImages();

		if(this.animating){
			requestAnimationFrame(this.draw.bind(this))
		} else {
			while(this.animatingLocs.length > 0){
				this.images.splice(this.animatingLocs.pop(),1)
			}
		}
	}
	drawMenu(){
		ctx.font = '64px monospace';
		ctx.textAlign = 'center';
		ctx.fillText("Welcome To MachiKoro!", canvas.width/2, 100);
		ctx.font = '32px monospace';
		ctx.fillText("Click anywhere to start!", canvas.width/2, 150)
		
		var a = new Image();
		a.src = 'images/machi-koro.jpg';
		a.onLoad = this.draw;
		ctx.fillText("Image loading...", canvas.width/2, 400);
		ctx.drawImage(a, 1, 200, 2400/2, 800/2);
		ctx.textAlign = 'left';
	}

	drawPlayerPalates(){
		this.ctx.fillStyle = 'rgb(200, 0, 0)';
		this.ctx.fillRect(0,0, this.left, canvas.height);

		this.ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
		this.ctx.fillRect(this.right, 0, this.pWidth, canvas.height);

		this.ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
		this.ctx.fillRect(this.left, this.bottom, this.right - this.left, this.pWidth);

		this.ctx.fillStyle = 'rgba(100, 0, 100, 0.5)';
		this.ctx.fillRect(this.right, 0, this.left - this.right, this.top);
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		this.landmarkLocs = [];
		if(this.game !== undefined){
			for(var i = 0; i < this.game.players.length; i++){
				var p = this.game.players[i];
				var bc = this.game.players[i].buildingCount;
				var tmpImg;
				var numEstTypes = 0;
				ctx.save();
				var currLandmark;

				if(i==0){
					ctx.translate( this.left, 0 );
					ctx.rotate( Math.PI / 2 );
					currLandmark = canvas.height;
				} else if(i==1){
					ctx.translate(this.left, this.bottom);
					currLandmark = this.right - this.left;
				}
				else if(i ==2){
					ctx.translate( this.right, canvas.height);
					ctx.rotate( -Math.PI / 2 );
					currLandmark = canvas.height;
				}
				else if(i == 3){
					ctx.translate(this.right, this.top);
					ctx.rotate(Math.PI);
					currLandmark = this.right - this.left;
				}
				ctx.font = '20px monospace';
				ctx.fillText(p.name +": $"+p.money, 2, 16);
				// ctx.fillText(printCards(p), 2, 33);
				ctx.fillText(printLandmarks(p), 0, 40);

				ctx.font = '16px monospace';
				for(var j = 0; j < bc.length; j++){
					if(bc[j]> 0){
						tmpImg = this.imageHolder[j];
						ctx.fillText(""+bc[j], (this.boxWidth/2) * (numEstTypes) + 30, 150);
						ctx.drawImage(tmpImg, (this.boxWidth/2) * numEstTypes + 10,  50, 105/2, 168/2);
						numEstTypes ++;
							
					}
				}

				currLandmark -= (105/2 + 10);
				for(var j = p.landmarks.length-1; j >= 0; j--){
					tmpImg = this.imageHolder[j + FIRST_LANDMARK_LOC];
					
					ctx.drawImage(tmpImg, currLandmark, 50, 105/2, 168/2); 
					this.landmarkLocs[j] = [j+FIRST_LANDMARK_LOC, [this.left + currLandmark, this.bottom + 50, 105/2, 168/2]];
					ctx.fillText(p.landmarks[j]?"Bought":"X", currLandmark, 150);
					currLandmark -= this.boxWidth/2;
				}
				ctx.restore();
				
			}
		}
	}

	drawStatusBar(){
		this.ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
		this.ctx.fillRect(this.right - 150, this.top, 150, this.statusBarHeight);

		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		var buttonDim = [this.right - 300, this.top, 150, this.statusBarHeight]
		if(this.game === undefined){
			this.ctx.fillStyle = 'rgba(0, 200, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("Start game", this.right - 300 + 40, this.top+40);
		} else if(this.buyListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("No Purchase", this.right - 300 + 40, this.top+40);
		} else if(this.rerollListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("Keep Roll", this.right - 300 + 40, this.top+40);
		}

		ctx.font = '32px monospace';
		ctx.fillText(this.messageText, 300, this.top + 50);
		if(this.game.roll !== undefined){
			ctx.fillText("Roll: " + this.game.roll, 600, this.top + 50);
		}
	}

	drawCardsLinesImages(){
		ctx.font = '16px monospace';
		for(var i = 0; i < indexedEstablishments.length; i++){
			var currCard = indexedEstablishments[i];
			if(i < this.numCols){
				var currLeft = this.left + currCard.position * this.boxWidth;
				ctx.fillText(currCard.name + ': ' + currCard.remain, currLeft+3, this.estTop+20, this.boxWidth-5);
			} else {
				var currLeft = this.left + (currCard.position-this.numCols) * this.boxWidth;
				var currUp = this.estTop + this.boxHeight;
				ctx.fillText(currCard.name + ': ' + currCard.remain, currLeft+3, currUp + 20, this.boxWidth-5);
			}

		}



		
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		

		for(var i in this.cardImages){
			this.cardImages[i].draw(this.ctx);
			// if(this.cardImages[i].moving){
			// 	animating = true;
			// }
		}
		for(var i in this.lines){
			this.lines[i].draw(this.ctx);
		}
		this.animating = false

		for(var i in this.images){
			this.images[i].draw(this.ctx);
			if(this.images[i].moving){
				this.animating = true;
				if(!this.animatingLocs.includes(i)){
					this.animatingLocs.push(i);
				}
			}
		}
	}
	addNewImage(src,x,y,width,height){
		this.images.push(new ImageWrapper(src,x,y,width,height));
	}

	addNewCardImage(card, x, y, width, height){
		this.cardImages.push(new cardImageWrapper(card, x, y, width, height));
	}

	addNewLine(x1,y1,x2,y2){
		this.lines.push(new LineWrapper(x1,y1,x2,y2));
	}

	checkClick(x,y){
		if(this.game === undefined){
			setTimeout(initHumanGame());
			return;
		}
		if(this.diceListening){
			var roll1 = clickInObj(this.right - 150, this.top, 75, 75, x, y);
			var roll2 = clickInObj(this.right - 150/2, this.top, 75, 75, x, y);

			if(roll1){
				return false;
			} else if(roll2){
				return true;
			}
		}
		if (this.rerollListening){
			if(clickInObj(this.right - 300,this.top,150,75,x,y)){
				return [false, false];
			}
			var roll1 = clickInObj(this.right - 150, this.top, 75, 75, x, y);
			var roll2 = clickInObj(this.right - 150/2, this.top, 75, 75, x, y);
			
			if(roll1 || roll2){
				print('rerolling');
				return [true, roll2];
			} 

		}
		if(this.buyListening){
			if(clickInObj(this.right - 300,this.top,150,75,x,y)){
				return -1;
			}
			for(var i in this.cardImages){
				if(this.cardImages[i].contains(x,y)){
					return this.cardImages[i].card.position;
				}
			}
			for(var i in this.landmarkLocs){
				if(clickInObj(...this.landmarkLocs[i][1],x,y)){
					return this.landmarkLocs[i][0];
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
		// this.gameWaiting = false;
		this.diceListening = false;
		this.rerollListening = false;
		this.buyListening = false;
		this.stealListening = false;
		this.messageText = "Processing";
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

