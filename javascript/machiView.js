

var canvas = document.getElementById('myCanvas');

var outputBox = document.getElementById('outputText');

function printStrat(strat){
	var output = "";
	if(strat[1]){
		output += "Roll Doubles \n";
	} else {
		output+= "Don't Roll Doubles \n";
	}
	for(var i =0; i < strat[0].length; i++){
		output+= `${i+1}. ${indexedCards[strat[0][i][0]].name} x${strat[0][i][1]} \n`;
	}
	return output
}

print = function(...outputText){
	console.log(...outputText)
	for(var i = 0; i < outputText.length; i++){
		outputBox.innerHTML += outputText[i];
	}
	outputBox.innerHTML += "\n";
	outputBox.scrollTop = outputBox.scrollHeight;
}
// canvas.style.outline="3px solid black";

var ctx = canvas.getContext('2d');

function clickInObj(objX, objY, width, height, clickX, clickY){
	return clickX >= objX && clickX <= objX + width && clickY >= objY && clickY <= objY + height;
}

function drawLine(x1,y1,x2,y2){
	ctx.save();
	ctx.strokeStyle = 'navy'; // set the strokeStyle color to 'navy' (for the stroke() call below)
	ctx.lineWidth = 3.0;      // set the line width to 3 pixels
	ctx.beginPath();
	ctx.moveTo (x1,y1);
	ctx.lineTo (x2,y2);
	ctx.stroke();             // actually draw the line
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
	constructor(img, x, y, width, height){

		this.img = img;
		this.src = img.src;
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
	constructor(img, card, x, y, width, height){
		super(img, x, y, width, height);
		this.card = card;
	}

	getCardIndexIfContains(x,y){
		if(this.contains(x,y)){
			return this.card.position;
		}
	}
}

class GameViewManager{
	constructor(window, canvas, outputBox){
		this.mySpanId = 'gameSpan';
		this.mySpan = document.getElementById(this.mySpanId);

		this.canvas = canvas
		this.outputBox = outputBox;
		this.window = window;
		this.windowWidth = this.window.innerWidth;
		this.windowHeight = this.window.innerHeight;
		this.canvasHeightFraction = 0.9;
		this.canvasWidthFraction = 0.8;
		this.boxWidthHeightRatio = 0.6;
		this.ctx = this.canvas.getContext('2d');

		this.imageWrappers = [];
		this.cardWrappers = [];
		this.landmarkLocs = [];
		this.animatingLocs = [];
		this.animating = false;
		this.numPlayers = 0;
		this.cardImageHolder = [];
		for(var i = 0; i < indexedCards.length; i++){
			this.cardImageHolder[i] = new Image();
			this.cardImageHolder[i].src = indexedCards[i].src;
		}
		this.otherImageHolder = [];
		var d1Img = new Image();
		d1Img.src = "images/d1.png";

		var d2Img = new Image();
		d2Img.src = "images/d2.png";
		this.otherImageHolder.push(d1Img);
		this.otherImageHolder.push(d2Img);

		// this.mainMenuPic = new Image();
		// this.mainMenuPic.src = 'images/machi-koro.jpg';
		// this.mainMenuPic.onload = this.draw.bind(this);

		this.messageText = "Starting messageText";
		this.numCols = 8;
		this.numRows = 2;


		this.top = 0;

		this.game = undefined;
		this.diceListening = false;
		this.rerollListening = false;
		this.buyListening = false;
		this.playerListening = false;
		this.stealListening = false;

		this.draw();
		// this.statusBarHeight = this.canvas.height * 0.1;
		// this.estTop = this.top + this.statusBarHeight;
		// this.pWidth = Math.min(this.canvas.width*0.2, this.canvas.height*0.25);
		// this.bottom = canvas.height - this.pWidth;
		// this.left = this.pWidth;
		// this.right = canvas.width - this.pWidth;
		// this.buttonWidth = this.canvas.width * 0.05;
		//
		//
		//
		// this.initInnerImagesAndLines();
	}

	enableGameSpan(){
		this.mySpan.style.display = "block";
	}
	disableGameSpan(){
		this.mySpan.style.display = "none";
	}


	initInnerImagesAndLines(){
		this.imageWrappers = []
		this.cardWrappers = []
		this.lines = []
		for(var i = 0; i < indexedEstablishments.length; i++){
			if(i < this.numCols){
				var currLeft = this.left + (i) * this.boxWidth;
				this.addNewCardImage(this.cardImageHolder[i], indexedEstablishments[i], currLeft+10, this.estTop+21, this.boxWidth - 20, this.boxHeight - 25);
			} else {
				var currLeft = this.left + (i-this.numCols) * this.boxWidth;
				this.addNewCardImage(this.cardImageHolder[i], indexedEstablishments[i], currLeft+10, this.estTop+21 + this.boxHeight, this.boxWidth - 20, this.boxHeight - 25);
			}
			// this.addNewLine(currLeft, this.estTop, currLeft, this.bottom);
		}

		// this.addNewImage("images/d1.png", this.right - 150 + 10, 10,50,50);

		var diceDim = [this.buttonWidth*0.8, this.statusBarHeight*0.6];
		this.addNewImage(this.otherImageHolder[0],
			this.right - this.buttonWidth*2 ,
			this.top + this.statusBarHeight*0.2,
			...diceDim);

		this.addNewImage(this.otherImageHolder[1],
			this.right - this.buttonWidth,
			this.top +  this.statusBarHeight*0.2,
			...diceDim);
		//1050, 0, 150, 75
		// this.addNewLine(this.right - 150/2 , this.top, this.right - 150/2, this.estTop);

		// for(var j = 0; j < 3; j++){
			// this.addNewLine(this.left, this.estTop + j * this.boxHeight, this.right, this.estTop + j * this.boxHeight);
		// }
	}

	setDimensions(){

		this.windowWidth = this.window.innerWidth;
		this.windowHeight = this.window.innerHeight;
		this.buttonWidth = this.canvas.width * 0.05;
		this.canvas.setAttribute('height',this.windowHeight*this.canvasHeightFraction+"px");
		this.canvas.setAttribute('width', this.windowWidth*this.canvasWidthFraction+"px");

		this.outputBox.style.height = this.windowHeight*this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth*(1-this.canvasWidthFraction)-30)+"px";

		if(this.game !== undefined)
		{
			this.setPlayerPalates();
		}
		this.setInnerArea();
	}

	setPlayerPalates(){

		this.pWidth = Math.min(this.canvas.width*0.2, this.canvas.height*0.25);
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

	}

	setInnerArea(){

			this.statusBarHeight = this.canvas.height * 0.1;
			this.buttonWidth = this.canvas.width * 0.05;
			this.estTop = this.top + this.statusBarHeight;
			var initialBoxWidth = (this.right - this.left) /this.numCols;
			var initialBoxHeight = (this.bottom - this.estTop) / this.numRows;


			this.boxWidth = Math.min(initialBoxWidth, initialBoxHeight * this.boxWidthHeightRatio);
			this.boxHeight = Math.min(initialBoxHeight, initialBoxWidth / this.boxWidthHeightRatio)

			this.initInnerImagesAndLines();
	}

	animateBuy(player, card){
		print(card.position , ' is bought');
		if(card.position >= FIRST_LANDMARK_LOC){
			return;
		}
		var x = this.cardWrappers[card.position].x;
		var y = this.cardWrappers[card.position].y;
		this.addNewImage(this.cardImageHolder[card.position], x,y, 100, 150)
		var x,y;
		var left = 0; var midHoriz = (this.left+this.right)/2; var right = canvas.width;
		var up = 0; var midVert = canvas.height/2; var down = canvas.height;
		var loc = [[left-100, midVert], [midHoriz, down], [right, midVert], [midHoriz, up-160]][player]

		this.imageWrappers[this.imageWrappers.length - 1].startAnimation(...loc,100)
	}

	draw(){
		this.ctx.clearRect(0,0,canvas.width,canvas.height);
		this.outputBox.style.display = "block";
		this.canvas.style.float= "left";
		if(this.windowHeight !== window.innerHeight || this.windowWidth !== window.innerWidth){
			this.setDimensions();
		}
		if (this.game === undefined){
			// this.drawMenu();
			return;
		} else {
			this.drawPlayerPalates();
			this.drawStatusBar();
			this.drawCardsLinesImages();
		}
		// this.setDimensions(this.game.players.length);
		// this.initInnerImagesAndLines();

		if(this.animating){
			requestAnimationFrame(this.draw.bind(this))
		} else {
			while(this.animatingLocs.length > 0){
				this.imageWrappers.splice(this.animatingLocs.pop(),1)
			}
		}
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
				ctx.font = '1em monospace';
				ctx.fillText(p.name +": $"+p.money, this.pWidth*0.01, this.pWidth*0.1);
				// ctx.fillText(printCards(p), 2, 33);
				ctx.fillText(printLandmarks(p),  this.pWidth*0.01, this.pWidth*0.2);

				ctx.font = '1em monospace';
				for(var j = 0; j < bc.length; j++){
					if(bc[j]> 0){
						tmpImg = this.cardImageHolder[j];
						ctx.fillText(""+bc[j], (this.pWidth* 0.35) * (numEstTypes) + this.pWidth*0.1, this.pWidth*0.9);
						ctx.drawImage(tmpImg, (this.pWidth* 0.35) * numEstTypes + this.pWidth*0.1,  this.pWidth*0.3, this.pWidth*0.3, this.pWidth*0.5);
						numEstTypes ++;

					}
				}

				currLandmark -= (this.pWidth*0.3 + this.pWidth * 0.1);
				for(var j = p.landmarks.length-1; j >= 0; j--){
					tmpImg = this.cardImageHolder[j + FIRST_LANDMARK_LOC];

					ctx.drawImage(tmpImg, currLandmark, this.pWidth*0.3, this.pWidth*0.3, this.pWidth*0.5);
					this.landmarkLocs[j] = [j+FIRST_LANDMARK_LOC, [this.left + currLandmark, this.bottom + this.pWidth*0.3, this.pWidth*0.3, this.pWidth*0.5]];
					ctx.fillText(p.landmarks[j]?"Bought":"X", currLandmark, this.pWidth*0.9);
					currLandmark -= this.pWidth* 0.35;
				}
				ctx.restore();

			}
		}
	}

	drawStatusBar(){
		this.ctx.save();

		//Draw dice box
		this.ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
		this.ctx.fillRect(this.right - this.buttonWidth*2.1, this.top+this.statusBarHeight*0.1, this.buttonWidth*2, this.statusBarHeight*0.8);

		//Draw pass option button
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.textBaseline="middle";
		var buttonDim = [this.right - this.buttonWidth*4.2 - this.buttonWidth * 0.1, this.top+this.statusBarHeight*0.1,
			this.buttonWidth*2, this.statusBarHeight*0.8];

		let textLoc = [this.right - this.buttonWidth*4.2 + this.buttonWidth*0.1,
			this.top+this.statusBarHeight*0.5];

		if(this.game === undefined){
			this.ctx.fillStyle = 'rgba(0, 200, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("Start game", ...textLoc);
		} else if(this.buyListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("No Purchase", ...textLoc);
		} else if(this.rerollListening){
			this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
			this.ctx.fillRect(...buttonDim);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText("Keep Roll", ...textLoc);
		}

		//Draw quit button
		this.ctx.fillStyle = 'rgba(200, 0, 0, 1)';
		ctx.fillRect(this.left+this.buttonWidth*0.2, this.top+this.statusBarHeight*0.1, this.buttonWidth, this.statusBarHeight*0.8);
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.textBaseline="middle";
		ctx.textAlign= "center";
		this.ctx.fillText("Quit!", this.left + this.buttonWidth*0.7, this.top+this.statusBarHeight*0.5, this.buttonWidth*0.8);

		//Draw status message
		ctx.font = '2em monospace';
		ctx.textAlign = "left";
		ctx.fillText(this.messageText, this.left + this.buttonWidth*1.3, this.top + this.statusBarHeight*0.5);

		//Draw dice roll message
		if(this.game.roll !== undefined){
			ctx.textAlign = "right";
			ctx.fillText("Roll: " + this.game.roll, this.right - this.buttonWidth * 4.6, this.top + this.statusBarHeight*0.5);
		}
		this.ctx.restore();
	}

	drawCardsLinesImages(){
		ctx.font = '1em monospace';
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


		for(var i in this.cardWrappers){
			this.cardWrappers[i].draw(this.ctx);
			// if(this.cardWrappers[i].moving){
			// 	animating = true;
			// }
		}
		for(var i in this.lines){
			this.lines[i].draw(this.ctx);
		}
		this.animating = false

		for(var i in this.imageWrappers){
			this.imageWrappers[i].draw(this.ctx);
			if(this.imageWrappers[i].moving){
				this.animating = true;
				if(!this.animatingLocs.includes(i)){
					this.animatingLocs.push(i);
				}
			}
		}
	}

	addNewImage(img,x,y,width,height){
		this.imageWrappers.push(new ImageWrapper(img,x,y,width,height));
	}

	addNewCardImage(img, card, x, y, width, height){
		this.cardWrappers.push(new cardImageWrapper(img, card, x, y, width, height));
	}

	addNewLine(x1,y1,x2,y2){
		this.lines.push(new LineWrapper(x1,y1,x2,y2));
	}

	checkClick(x,y){
		print(x,y);
		if(this.game === undefined){
			return;
		}
		if(clickInObj(this.left + 10, this.top, this.buttonWidth, this.estTop - this.top, x, y)){
			hum.quitHumanGame();
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
			for(var i in this.cardWrappers){
				if(this.cardWrappers[i].contains(x,y)){
					return this.cardWrappers[i].card.position;
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

class MenuViewManager{
	constructor(window, canvas, outputBox){
		this.canvas = canvas;
		this.window = window;
		this.outputBox = outputBox;
		this.windowWidth = this.window.innerWidth;
		this.windowHeight = this.window.innerHeight;
		this.canvasHeightFraction = 0.9;
		this.canvasWidthFraction = 1;
		this.maxImageHeightFraction = 0.8;
		this.maxImageWidthFraction = 0.9;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.setAttribute('height', this.windowHeight * this.canvasHeightFraction+"px");
		this.canvas.setAttribute('width', this.windowWidth * this.canvasWidthFraction+"px");
		this.outputBox.style.height = this.windowHeight * this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth * (1-this.canvasWidthFraction)-10)+"px";



		this.ctx = this.canvas.getContext('2d');

		this.mainMenuPic = new Image();
		this.mainMenuPic.src = 'images/machi-koro.jpg';
		this.mainMenuPic.onload = this.draw.bind(this);

		this.gameModeNames = ["Two Players","Three Players", "Four Players", "AI Test", "Genetic"];
		this.gameModeFuncs = [returnHumanGameMaker(2), returnHumanGameMaker(3), returnHumanGameMaker(4),
								g.testStrats.bind(g), g.startGeneticParam.bind(g)];
	}

	draw(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		if(this.windowHeight !== this.window.innerHeight || this.windowWidth !== this.window.innerWidth){
			this.windowWidth = this.window.innerWidth;
			this.windowHeight = this.window.innerHeight;
			this.canvas.setAttribute('height', this.windowHeight * this.canvasHeightFraction+"px");
			this.canvas.setAttribute('width', this.windowWidth * this.canvasWidthFraction+"px");
			this.outputBox.style.height = this.windowHeight * this.canvasHeightFraction+"px";
			this.outputBox.style.width = (this.windowWidth * (1-this.canvasWidthFraction)-10)+"px";
		}
		this.outputBox.style.display = "none";

		this.canvas.style.float = "none"
		this.ctx.save();
		// ctx.font = '32px monospace';
		// ctx.fillText("Click anywhere to start!", canvas.width/2, 150)


		ctx.fillText("Image loading...", this.canvas.width/2, this.canvas.height/2);

		if(this.mainMenuPic.height !== 0){
			let heightToWidth = this.mainMenuPic.height/this.mainMenuPic.width;
			let maxPicWidth = this.canvas.width * this.maxImageWidthFraction;
			let maxPicHeight = this.canvas.height * this.maxImageHeightFraction;

			this.mainMenuPic.width = Math.min(maxPicWidth, maxPicHeight/heightToWidth);
			this.mainMenuPic.height = Math.min(maxPicHeight, maxPicWidth*heightToWidth);
		}

		this.menuPicMiddleX = this.canvas.width/2 - this.mainMenuPic.width/2;
		var middleY = this.canvas.height/2 - this.mainMenuPic.height/2;

		ctx.drawImage(this.mainMenuPic, this.menuPicMiddleX, middleY, this.mainMenuPic.width, this.mainMenuPic.height);

		this.ctx.font = '4em monospace';
		this.ctx.textAlign = 'center';
		this.ctx.fillText("Welcome To MachiKoro!", canvas.width/2, middleY-10);

		ctx.textAlign = 'left';

		this.menuButtonHeightFraction = 0.1;
		this.menuButtonSpacingFraction = 0.02;

		this.menuButtonHeight = this.menuButtonHeightFraction * this.canvas.height;
		this.menuButtonBorder = this.menuButtonSpacingFraction * this.canvas.width;
		this.menuButtonWidth = this.mainMenuPic.width/5 - (this.menuButtonBorder)*4/5;
		this.menuButtonY = middleY + this.mainMenuPic.height + this.menuButtonBorder;


		ctx.font = '1.5em monospace';
		this.ctx.textBaseline="middle";
		this.ctx.textAlign = 'center';

		for(var i = 0; i < this.gameModeNames.length; i++){
			var offset = i*(this.menuButtonWidth + this.menuButtonBorder);
			this.ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
			this.ctx.fillRect(this.menuPicMiddleX + offset, this.menuButtonY, this.menuButtonWidth, this.menuButtonHeight);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText(this.gameModeNames[i], this.menuPicMiddleX + this.menuButtonWidth/2 + offset, this.menuButtonY+ this.menuButtonHeight/2);

		}
		ctx.restore();
	}

	checkClick(x,y){
		for(var i =0; i < this.gameModeNames.length; i++){
			if(clickInObj(this.menuPicMiddleX + i*(this.menuButtonWidth + this.menuButtonBorder),
				this.menuButtonY, this.menuButtonWidth, this.menuButtonHeight, x,y)){

				this.gameModeFuncs[i]();
			}
		}
		// setTimeout(initHumanGame());
		return;
	}
}

class GeneticViewManager{
	constructor(){
		this.mySpanId = 'geneticSpan'
		this.menuSpanId = 'inputGeneticSpan';
		this.runSpanId = 'runningGeneticSpan';
		this.paramInfoId = 'paramInfo';
		this.bestStratId = 'bestStrat';

		this.winsOverTimeId = 'chart1';
		this.currWinsId = 'chart2';

		this.mySpan = document.getElementById(this.mySpanId);
		this.menuSpan = document.getElementById(this.menuSpanId);
		this.runSpan = document.getElementById(this.runSpanId);
		this.paramDiv = document.getElementById(this.paramInfoId);
		this.bestStrat = document.getElementById(this.bestStratId);

		this.winsOverTimeCanvas = document.getElementById('chart1');
		this.currWinsCanvas = document.getElementById('chart2');

		this.stratLoc = [];
		this.numStratWins = [];
		this.lastNumStrats = 0;

		this.genBest = [];
		this.genBreakpoint = [];
		this.genAvg = [];
		this.genRecord =[];

		this.titleID;
		/*
		popSize
		breakpointRatio
		mutationRate
		metaGenTransfer
		singleBothOrDoubles

		iterations
		maxGen
		maxMetaGen

		numBest
		*/

	}
	submitNewScore(score, loc){
		this.stratLoc.push(loc);
		this.numStratWins.push(score);
		this.numStratWins.sort((a,b)=>b-a);
		// if(this.numStratWins.length - this.lastNumStrats > 40){
		// 	this.draw();
		// 	this.lastNumStrats = this.numStratWins.length;
		// }

	}
	endTesting(breakpoint, currGen){
		var maxLoc = 0;
		var sum = 0;
		for(var i = 0; i < this.numStratWins.length; i++){
			sum += this.numStratWins[i];
			if(this.numStratWins[i] > this.numStratWins[maxLoc]){
				maxLoc = i;
			}
		}
		this.genBest.push(this.numStratWins[maxLoc]);
		this.genBreakpoint.push(breakpoint);
		this.genAvg.push(sum/this.numStratWins.length);
		this.genRecord.push(currGen);
		this.draw();
		this.clearScores();
	}
	clearScores(){
		this.stratLoc = [];
		this.numStratWins = [];
		this.lastNumStrats = 0;
	}
	startGeneticView(){
		this.mySpan.style.display = "block";
		this.menuSpan.style.display = "block";
		this.runSpan.style.display = "none";
	}
	disableGeneticSpan(){
		this.mySpan.style.display = "none";
	}

	toggleMenu(){
		if(this.menuSpan.style.display == "none"){
			this.menuSpan.style.display = "block";
			this.runSpan.style.display = "none";
		} else {
			this.menuSpan.style.display = "none";
			this.runSpan.style.display = "block";
			// this.draw();
		}
	}
	setParamInfo(g, currStrat = 0){
		var currMetaGen = g.currMetaGen;
		var currGen = g.currGen;
		var numMetaGen = g.maxMetaGen;
		var numGen = g.maxGen;
		var iterations = g.iterations;
		var popSize = g.popSize;
		var output = `Meta Generations: ${currMetaGen}/${numMetaGen} | Generation: ${currGen}/${numGen} |  Pop Size: ${currStrat}/${popSize} | iterations: ${iterations}`
		this.paramDiv.innerText = output;
	}

	draw(){
		this.setParamInfo(g, g.popSize);
		print(g.bestScore);
		var maxLoc = g.scores.indexOf(g.sortedScores[0]);
		var output = `Winning Strat with ${g.bestScore[0]} wins out of ${g.iterations}:\n` + printStrat(g.bestScoreGene[0]) + "\n";
		output += `Second Strat with ${g.bestScore[1]} wins out of ${g.iterations}:\n` + printStrat(g.bestScoreGene[1]) + "\n\n";
		output += `Most recent run best with ${g.sortedScores[0]} wins: \n ` + printStrat(g.pop[maxLoc]);
		this.bestStrat.innerText = output;
		this.winsOverTimeCanvas.height = 500;
		this.winsOverTimeCanvas.width = 500;
		this.currWinsCanvas.height = 500;
		this.currWinsCanvas.width = 500;

		this.myChart !== undefined? this.myChart.destroy():{};
		this.myChart2 !== undefined? this.myChart2.destroy():{};

		this.myChart = new Chart(this.winsOverTimeCanvas, {
		    type: 'line',
		    data: {
		        labels: JSON.parse(JSON.stringify(this.stratLoc)),
		        datasets: [{
		            label: '# of Wins',
		            data: JSON.parse(JSON.stringify(g.sortedScores)),
		            borderWidth: 1,
		            fill: false,
		            borderColor: window.chartColors.green,
					backgroundColor: window.chartColors.green,
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});

		this.myChart2 = new Chart(this.currWinsCanvas, {
			type:'line',
			data: {
				labels: JSON.parse(JSON.stringify(this.genRecord)),
				datasets: [{
					label: 'Best Score!',
					data: JSON.parse(JSON.stringify(this.genBest)),
					fill: false,
					borderColor: window.chartColors.red,
					backgroundColor: window.chartColors.red,
					lineTension: 0,
				},
				{
					label: 'Breakpoint',
					data: JSON.parse(JSON.stringify(this.genBreakpoint)),
					fill: false,
					borderColor: window.chartColors.blue,
					backgroundColor: window.chartColors.blue,
					lineTension: 0,
				},
				{
					label: 'Average',
					data: JSON.parse(JSON.stringify(this.genAvg)),
					fill: false,
					borderColor: window.chartColors.purple,
					backgroundColor: window.chartColors.purple,
					lineTension: 0,
				},]
			}
		})


	}

}
