

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

// var ctx = canvas.getContext('2d');

function clickInObj(objX, objY, width, height, clickX, clickY){
	return clickX >= objX && clickX <= objX + width
		&& clickY >= objY && clickY <= objY + height;
}

function drawLine(x1,y1,x2,y2, ctx){
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
	constructor(x1,y1,x2,y2,ctx){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.ctx = ctx;
	}
	draw(){
		drawLine(this.x1, this.y1, this.x2, this.y2, this.ctx);
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
		this.fontPxFraction = 0.01;
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

	enableView(){
		// this.mySpan.classList.add("hidden");
		this.mySpan.classList.remove("hidden");
		this.outputBox.classList.remove("hidden");
		// this.mySpan.style.display = "block";
	}

	disableView(){
		this.mySpan.classList.add("hidden");
		this.outputBox.classList.add("hidden");
		// this.mySpan.style.display = "none";
	}

	initInnerImagesAndLines(){
		this.imageWrappers = []
		this.cardWrappers = []
		this.lines = []
		this.innerCardDims = [this.boxWidth*0.8, this.boxHeight*0.8]
		for(var i = 0; i < indexedEstablishments.length; i++){
			if(i < this.numCols){
				var currLeft = this.left + (i+0.1) * this.boxWidth;
				this.addNewCardImage(this.cardImageHolder[i],
					indexedEstablishments[i], currLeft,
					this.estTop+21, ...this.innerCardDims);

			} else {
				var currLeft = this.left + (i - this.numCols + 0.1) * this.boxWidth;
				this.addNewCardImage(this.cardImageHolder[i],
					indexedEstablishments[i], currLeft,
					this.estTop+21 + this.boxHeight,
					...this.innerCardDims);
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

	}

	setDimensions(){

		this.windowWidth = this.window.innerWidth;
		this.windowHeight = this.window.innerHeight;
		this.buttonWidth = this.canvas.width * 0.05;
		this.canvas.setAttribute('height',
			this.windowHeight*this.canvasHeightFraction+"px");

		this.canvas.style.fontSize = this.windowWidth*this.fontPxFraction+"px";

		this.canvas.setAttribute('width',
			this.windowWidth*this.canvasWidthFraction+"px");

		this.outputBox.style.height = this.windowHeight
			* this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth
			* (1 - this.canvasWidthFraction) - 30) + "px";

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
		this.drawLandmarks(true);

	}

	setInnerArea(){

			this.statusBarHeight = this.canvas.height * 0.1;
			this.buttonWidth = this.canvas.width * 0.05;
			this.estTop = this.top + this.statusBarHeight;
			var initialBoxWidth = (this.right - this.left) /this.numCols;
			var initialBoxHeight = (this.bottom - this.estTop) / this.numRows;


			this.boxWidth = Math.min(initialBoxWidth,
				initialBoxHeight * this.boxWidthHeightRatio);

			this.boxHeight = Math.min(initialBoxHeight,
				initialBoxWidth / this.boxWidthHeightRatio)

			this.initInnerImagesAndLines();
	}

	animateBuy(player, card){
		if(card.position >= FIRST_LANDMARK_LOC){
			return;
		}
		var x = this.cardWrappers[card.position].x;
		var y = this.cardWrappers[card.position].y;
		this.addNewImage(this.cardImageHolder[card.position], x,y, ...this.innerCardDims);
		var x,y;
		var left = 0; var midHoriz = (this.left + this.right) / 2;
		var right = canvas.width;
		var up = 0; var midVert = canvas.height/2;
		var down = canvas.height;
		var locs = [[left-100, midVert], [midHoriz, down],
			[right, midVert], [midHoriz, up-160]];

		var playerLoc = locs[player];
		this.imageWrappers[this.imageWrappers.length - 1]
			.startAnimation(...playerLoc,100);
	}

	draw(){
		this.ctx.clearRect(0,0,canvas.width,canvas.height);
		// this.outputBox.style.display = "block";
		this.outputBox.classList.remove("hidden")
		// this.canvas.style.float= "left";
		this.canvas.classList.add("float-left");
		this.canvas.classList.remove("float-none");
		if(this.windowHeight !== window.innerHeight
				|| this.windowWidth !== window.innerWidth){
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

		this.ctx.fillStyle = window.chartColors.darkBlue;
		this.ctx.fillRect(0,0, this.left, canvas.height);

		this.ctx.fillStyle = window.chartColors.darkBlue;
		this.ctx.fillRect(this.right, 0, this.pWidth, canvas.height);

		this.ctx.fillStyle = window.chartColors.darkBlue;
		this.ctx.fillRect(this.left, this.bottom,
			this.right - this.left, this.pWidth);

		this.ctx.fillStyle = window.chartColors.darkBlue;
		this.ctx.fillRect(this.right, 0, this.left - this.right, this.top);
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		if(this.game !== undefined){
			this.landmarkLocs = [];
			this.drawLandmarks(true);
			for(var i = 0; i < this.game.players.length; i++){
				var p = this.game.players[i];
				var bc = this.game.players[i].buildingCount;
				var tmpImg;
				var numEstTypes = 0;
				this.ctx.save();
				var currLndmkLoc;

				if(i==0){
					this.ctx.translate( this.left, 0 );
					this.ctx.rotate( Math.PI / 2 );
					currLndmkLoc = canvas.height;
				} else if(i==1){
					this.ctx.translate(this.left, this.bottom);
					currLndmkLoc = this.right - this.left;
				}
				else if(i ==2){
					this.ctx.translate( this.right, canvas.height);
					this.ctx.rotate( -Math.PI / 2 );
					currLndmkLoc = canvas.height;
				}
				else if(i == 3){
					this.ctx.translate(this.right, this.top);
					this.ctx.rotate(Math.PI);
					currLndmkLoc = this.right - this.left;
				}
				this.ctx.font = '1.2em monospace';
				this.ctx.fillText(p.name +": $"+p.money, this.pWidth*0.01, this.pWidth*0.1);
				// ctx.fillText(printCards(p), 2, 33);
				this.ctx.fillText(printLandmarks(p),  this.pWidth*0.01, this.pWidth*0.2);

				this.ctx.font = '1.2em monospace';
				for(var j = 0; j < bc.length; j++){
					if(bc[j]> 0){
						tmpImg = this.cardImageHolder[j];
						this.ctx.fillText(""+bc[j],
							(this.pWidth* 0.35) * (numEstTypes) + this.pWidth*0.1,
							this.pWidth*0.9);

						this.ctx.drawImage(tmpImg,
							(this.pWidth* 0.35) * numEstTypes + this.pWidth*0.1,
							this.pWidth*0.3, this.pWidth*0.3,
							this.pWidth*0.5);

						numEstTypes ++;

					}
				}

				currLndmkLoc -= (this.pWidth*0.3 + this.pWidth * 0.1);
				for(var j = p.landmarks.length-1; j >= 0; j--){
					tmpImg = this.cardImageHolder[j + FIRST_LANDMARK_LOC];

					// this.ctx.drawImage(tmpImg, currLndmkLoc,
					// 	this.pWidth*0.3, this.pWidth*0.3, this.pWidth*0.5);

					// this.setLandmarkListenArea(j, currLndmkLoc);

					this.ctx.fillText(p.landmarks[j]?"Bought":"X", currLndmkLoc, this.pWidth*0.9);
					currLndmkLoc -= this.pWidth* 0.35;
				}
				this.ctx.restore();

			}
		}
	}

	drawLandmarks(reset = false){

		this.landmarkLocs = []
		for(var i = 0; i < this.game.players.length; i++){
			var currLndmkLoc;
			var dir;
			var rot;
			var cardStart;
			if(i==0){
				currLndmkLoc = canvas.height;
				dir = 1;
			} else if(i==1){
				currLndmkLoc = this.right;
				dir = 1;
				rot = 0;
			}
			else if(i ==2){
				currLndmkLoc = 0;
				dir = -1;
			}
			else if(i == 3){
				currLndmkLoc = this.left;
				dir = -1;
			}
			currLndmkLoc -= dir * this.pWidth * (0.1 + 0.3);
			var p = this.game.players[i];
			for(var j = p.landmarks.length-1; j >= 0; j--){
				this.addPlayerCard(i, j+FIRST_LANDMARK_LOC, currLndmkLoc, reset);
				currLndmkLoc -= dir * this.pWidth* (0.05 + 0.3);
			}
		}
	}

	addPlayerCard(side, j, currLndmkLoc, reset = False){
		var isLandmark = j >= FIRST_LANDMARK_LOC;
		if(side==1){
				if (reset && isLandmark)
					this.landmarkLocs.push(
						[j,	[currLndmkLoc, this.bottom + this.pWidth*0.3,
								this.pWidth*0.3, this.pWidth*0.5]]);

			this.drawRotatedImage(currLndmkLoc, this.bottom + this.pWidth*0.3,
				0, this.cardImageHolder[j], this.pWidth*0.3, this.pWidth*0.5);

		} else if (side== 0){
			if(reset && isLandmark)
				this.landmarkLocs.push(
					[j, [this.left - this.pWidth*0.8,	currLndmkLoc,
							 this.pWidth*0.5, this.pWidth*0.3]]);

			this.drawRotatedImage(this.left - this.pWidth*0.3, currLndmkLoc,
				Math.PI/2, this.cardImageHolder[j], this.pWidth*0.3, this.pWidth*0.5);

		} else if (side == 2){
			if (reset && isLandmark)
				this.landmarkLocs.push(
					[j, [this.right + this.pWidth*0.3, currLndmkLoc - this.pWidth * 0.3,
					 	this.pWidth*0.5, this.pWidth*0.3]]);

			this.drawRotatedImage(this.right + this.pWidth*0.3, currLndmkLoc,
				-Math.PI/2, this.cardImageHolder[j], this.pWidth*0.3, this.pWidth*0.5);

		} else if (side == 3){
			if(reset && isLandmark)
				this.landmarkLocs.push(
					[j, [currLndmkLoc,	this.pWidth*(0.2),
							this.pWidth*0.3, this.pWidth*0.5]]);

			this.drawRotatedImage(currLndmkLoc, this.top - this.pWidth*0.3,
				-Math.PI, this.cardImageHolder[j], this.pWidth*0.3, this.pWidth*0.5);
		}
	}

	drawStatusBar(){
		this.ctx.save();

		//Draw dice box
		this.ctx.fillStyle = 'rgba(100, 100, 0, 0.5)';
		this.ctx.fillRect(this.right - this.buttonWidth*2.1,
			this.top+this.statusBarHeight*0.1,
			this.buttonWidth*2,
			this.statusBarHeight*0.8);

		//Draw pass option button
		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		this.ctx.textBaseline="middle";
		this.ctx.textAlign= "center";
		let buttonDim = [this.right - this.buttonWidth*4.2 - this.buttonWidth * 0.1,
			this.top+this.statusBarHeight*0.1,
			this.buttonWidth*2, this.statusBarHeight*0.8];

		let textLoc = [this.right - this.buttonWidth*3.4 + this.buttonWidth*0.1,
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
		this.ctx.fillRect(this.left+this.buttonWidth*0.1,
			this.top+this.statusBarHeight*0.1,
			this.buttonWidth,
			this.statusBarHeight*0.8);

		this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		this.ctx.textBaseline="middle";
		this.ctx.textAlign= "center";
		this.ctx.fillText("Quit!",
			this.left + this.buttonWidth*0.6,
			this.top+this.statusBarHeight*0.5,
			this.buttonWidth*0.8);

		//Draw status message
		this.ctx.font = '2em monospace';
		this.ctx.textAlign = "left";
		this.ctx.fillText(this.messageText,
			this.left + this.buttonWidth*1.3,
			this.top + this.statusBarHeight*0.5);

		//Draw dice roll message
		if(this.game.roll !== undefined){
			this.ctx.textAlign = "right";
			this.ctx.fillText("Roll: " + this.game.roll,
				this.right - this.buttonWidth * 4.6,
				this.top + this.statusBarHeight*0.5);
		}
		this.ctx.restore();
	}

	drawCardsLinesImages(){
		this.ctx.font = '1em monospace';
		for(var i = 0; i < indexedEstablishments.length; i++){
			var currCard = indexedEstablishments[i];
			if(i < this.numCols){
				var currLeft = this.left + currCard.position * this.boxWidth;
				this.ctx.fillText(currCard.name + ': ' + currCard.remain,
					currLeft+3, this.estTop+20, this.boxWidth-5);

			} else {
				var currLeft = this.left
					+ (currCard.position-this.numCols) * this.boxWidth;
				var currUp = this.estTop + this.boxHeight;
				this.ctx.fillText(currCard.name + ': ' + currCard.remain,
					currLeft+3, currUp + 20, this.boxWidth-5);

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
		this.cardWrappers.push(new cardImageWrapper(
			img, card, x, y, width, height));
	}

	addNewLine(x1,y1,x2,y2){
		this.lines.push(new LineWrapper(x1,y1,x2,y2,this.ctx));
	}

	drawRotatedImage(x, y, angle, image, width, height){
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle);
		this.ctx.drawImage(image, 0,0, width, height);
		this.ctx.restore();

	}

	checkClick(x,y){
		if(this.game === undefined){
			return;
		}
		if(clickInObj(this.left + 10, this.top,
				this.buttonWidth, this.estTop - this.top,
				x, y)){

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
		this.mySpanId = "gameSpan";
		this.mySpan = document.getElementById(this.mySpanId);
		this.canvas = canvas;
		this.window = window;
		this.outputBox = outputBox;
		this.windowWidth = this.window.innerWidth;
		this.windowHeight = this.window.innerHeight;
		this.canvasHeightFraction = 0.9;
		this.canvasWidthFraction = 1;
		this.maxImageHeightFraction = 0.8;
		this.maxImageWidthFraction = 0.9;
		this.fontPxFraction = 0.01;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.setAttribute('height', this.windowHeight
			* this.canvasHeightFraction+"px");
		this.canvas.setAttribute('width', this.windowWidth
			* this.canvasWidthFraction+"px");
		this.canvas.style.fontSize = this.windowWidth*this.fontPxFraction+"px";
		this.outputBox.style.height = this.windowHeight
			* this.canvasHeightFraction+"px";
		this.outputBox.style.width = (this.windowWidth
			* (1-this.canvasWidthFraction)-10)+"px";



		this.ctx = this.canvas.getContext('2d');

		this.mainMenuPic = new Image();
		this.mainMenuPic.src = 'images/machi-koro.jpg';
		this.mainMenuPic.onload = this.draw.bind(this);

		this.gameModeNames = ["Two Players","Three Players",
			"Four Players", "Two AI", "AI Test", "Genetic"];
		this.gameModeFuncs = [returnHumanGameMaker(2),
			returnHumanGameMaker(3), returnHumanGameMaker(4),returnHumanGameMaker(-2),
			g.testStrats.bind(g, 10000, true), g.startGeneticParam.bind(g)];
	}

	draw(){
		this.ctx.save();
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		if(this.windowHeight !== this.window.innerHeight
				|| this.windowWidth !== this.window.innerWidth){

			this.windowWidth = this.window.innerWidth;
			this.windowHeight = this.window.innerHeight;
			this.canvas.setAttribute('height', this.windowHeight
			 	* this.canvasHeightFraction+"px");
			this.canvas.setAttribute('width', this.windowWidth
				* this.canvasWidthFraction+"px");
			this.canvas.style.fontSize = this.windowWidth*this.fontPxFraction+"px";
			this.outputBox.style.height = this.windowHeight
				* this.canvasHeightFraction+"px";
			this.outputBox.style.width = (this.windowWidth
				* (1-this.canvasWidthFraction)-10)+"px";
		}
		this.outputBox.classList.add("hidden");
		// this.outputBox.style.display = "none";

		// this.canvas.style.float = "none"
		this.canvas.classList.add("float-none");
		this.canvas.classList.remove("float-left");


		// ctx.fillText("Click anywhere to start!", canvas.width/2, 150)

		this.ctx.font = "5em monospace";
		this.ctx.textAlign = 'center';
		this.ctx.fillText("Image loading...", this.canvas.width/2, this.canvas.height/2);

		this.menuButtonHeightFraction = 0.1;
		this.menuButtonSpacingFraction = 0.02;
		this.menuButtonHeight = this.menuButtonHeightFraction * this.canvas.height;
		this.menuButtonBorder = this.menuButtonSpacingFraction * this.canvas.width;

		if(this.mainMenuPic.height !== 0){
			let heightToWidth = this.mainMenuPic.height/this.mainMenuPic.width;
			let maxPicWidth = this.canvas.width * this.maxImageWidthFraction;
			let maxPicHeight = this.canvas.height * this.maxImageHeightFraction;

			this.mainMenuPic.width = Math.min(maxPicWidth, maxPicHeight/heightToWidth);
			this.mainMenuPic.height = Math.min(maxPicHeight, maxPicWidth*heightToWidth);

			this.buttonsTotalWidth = this.mainMenuPic.width;
			this.menuPicLeftX = this.canvas.width/2 - this.mainMenuPic.width/2;
			var menuPicTopY = this.canvas.height/2 - this.mainMenuPic.height/2;
			this.menuButtonY = menuPicTopY + this.mainMenuPic.height + this.menuButtonBorder;
		} else {
			this.buttonsTotalWidth = this.canvas.width * this.maxImageWidthFraction;
			this.menuPicLeftX = this.canvas.width * (1-this.maxImageWidthFraction)/2;
			var menuPicTopY = this.canvas.height * (1 - this.maxImageHeightFraction)/2;
			this.menuButtonY = this.canvas.height * (this.maxImageHeightFraction);
		}


		this.ctx.drawImage(this.mainMenuPic,
			this.menuPicLeftX, menuPicTopY,
			this.mainMenuPic.width, this.mainMenuPic.height);

		this.ctx.font = '4em monospace';
		this.ctx.textAlign = 'center';
		this.ctx.fillText("Welcome To MachiKoro!", canvas.width/2, menuPicTopY-10);

		this.ctx.textAlign = 'left';

		var numModes = this.gameModeNames.length;

		this.menuButtonWidth = this.buttonsTotalWidth/numModes
			- (this.menuButtonBorder)*(numModes-1)/numModes;

		this.ctx.font = '1.5em monospace';
		this.ctx.textBaseline="middle";
		this.ctx.textAlign = 'center';
		for(var i = 0; i < this.gameModeNames.length; i++){

			var offset = i*(this.menuButtonWidth + this.menuButtonBorder);
			this.ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
			this.ctx.fillRect(this.menuPicLeftX + offset, this.menuButtonY,
				this.menuButtonWidth, this.menuButtonHeight);
			this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			this.ctx.fillText(this.gameModeNames[i],
				this.menuPicLeftX + this.menuButtonWidth/2 + offset,
				this.menuButtonY + this.menuButtonHeight/2,
				this.menuButtonWidth);

		}
		this.ctx.restore();
	}

	checkClick(x,y){
		for(var i =0; i < this.gameModeNames.length; i++){
			if(clickInObj(
				this.menuPicLeftX + i * (this.menuButtonWidth + this.menuButtonBorder),
				this.menuButtonY,
				this.menuButtonWidth,
				this.menuButtonHeight,
				x,y)){

				this.gameModeFuncs[i]();
			}
		}
		// setTimeout(initHumanGame());
		return;
	}

	enableView(){
		this.mySpan.classList.remove("hidden");
	}

	disableView(){
		this.mySpan.classList.add("hidden");
	}
}

class GeneticViewManager{
	constructor(g){
		this.g = g;
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
		this.draw();
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
		this.drawCharts();
		this.clearScores();
	}

	clearScores(){
		this.stratLoc = [];
		this.numStratWins = [];
		this.lastNumStrats = 0;
	}

	disableView(){
		// this.mySpan.style.display = "none";
		this.mySpan.classList.add("hidden");
	}

	enableView(){
		// this.menuSpan.style.display = "none";
		// this.mySpan.style.display = "block";
		// this.runSpan.style.display = "block";
		this.menuSpan.classList.add("hidden");
		this.mySpan.classList.remove("hidden");
		this.runSpan.classList.remove("hidden");
	}

	disableGeneticView(){
		// this.menuSpan.style.display = "block";

		// this.runSpan.style.display = "none";
		this.runSpan.classList.add("hidden");
	}

	draw(g, currStrat = 0){
		var g = this.g;

		var output = `Meta Generations: ${g.currMetaGen}/${g.maxMetaGen}`
			+` | Generation: ${g.currGen}/${g.maxGen}`
			+` |  Pop Size: ${currStrat}/${g.popSize}`
			+` | iterations: ${g.iterations}`;
		this.paramDiv.innerText = output;

	}

	drawCharts(){
		var g = this.g;
		var maxLoc = g.scores.indexOf(g.sortedScores[0]);
		var output = `Winning Strat with ${g.bestScore[0]} wins out of
		${g.iterations} (${(g.bestScore[0]/g.iterations).toFixed(3)}):\n`
			+ printStrat(g.bestScoreGene[0]) + "\n";

		output += `Second Strat with ${g.bestScore[1]} wins out of
			${g.iterations} (${(g.bestScore[1]/g.iterations).toFixed(3)}):\n`
			+ printStrat(g.bestScoreGene[1]) + "\n\n";

		output += `Most recent run best with ${g.sortedScores[0]} wins: \n `
			+ printStrat(g.pop[maxLoc]);
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

class StratTestManager{
	constructor(){
		this.mySpanId = 'stratTestSpan';
		this.dataDumpSpanId = 'dataDump';
		this.chartCanvasId = 'chart3';
		this.stratListId = 'stratList';
		this.lastUpdate = 0;
		this.mySpan = document.getElementById(this.mySpanId);
		this.dataDump = document.getElementById(this.dataDumpSpanId);
		this.winrateCanvas = document.getElementById(this.chartCanvasId);
		this.stratList = document.getElementById(this.stratListId);
		this.data = {}

	}

	inputData(g, num){

		this.data = {
			singleWins:g.singleWins,
			singleGames:g.singleGames,
			multiWins:g.multiWins,
			multiGames:g.multiGames,
			strats:aiStratList,
			numGames: num,
		}
		this.numStrats = this.data.strats.length;
		this.draw();
	}

	draw(){
		var text = this.data.numGames+ " games played! \n";
		var winrates1 = []
		var winrates2 = []
		for(let i = 0; i < this.numStrats; i++){
			var winrate1 = parseFloat((this.data.singleWins[i]/this.data.singleGames[i]).toFixed(3));
			var winrate2 = parseFloat((this.data.multiWins[i]/this.data.multiGames[i]).toFixed(3));
			winrates1[i] = [i, winrate1];
			winrates2[i] = [i, winrate2];
			text += `Single: ${this.data.singleWins[i]}/${this.data.singleGames[i]} = ${winrate1}   ||  ${winrate2}`;
			text+= "\n";
		}
		winrates1 = winrates1.sort((a,b)=>{return b[1]-a[1]});
		winrates2 = winrates2.sort((a,b)=>{return b[1]-a[1]});

		text += "\n"+ JSON.stringify(winrates1) + "\n\n";
		text += JSON.stringify(winrates2);
		this.dataDump.innerText = text;

		var text2 = "";
		for(let i = 0; i < aiStratList.length; i++){
			text2 += "Strat:"+i+" \n "+printStrat(aiStratList[i]) + "\n";

		}
		this.stratList.innerText = text2;

		if (this.data.numGames - this.lastUpdate > 400){
			this.drawCharts(winrates1);
			this.lastUpdate = this.data.numGames;
		}

	}

	drawCharts(winrates1){
		var cleanedWinrates = [];
		var winrateLocs = [];
		for (let i = 0; i < winrates1.length; i++){
			cleanedWinrates[i] = winrates1[i][1];
			winrateLocs[i] = winrates1[i][0];
		}
		this.myChart !== undefined? this.myChart.destroy():{};
		// Array.from({length: N}, (v, k) => k+1);
		var myChart = new Chart(this.winrateCanvas, {
		    type: 'bar',
		    data: {
		        labels: winrateLocs,
		        datasets: [{
		            label: 'Winrate of Strategies',
		            data: cleanedWinrates,
		            backgroundColor: this.makeScaledGradient(cleanedWinrates),
		            borderColor: this.makeScaledGradient(cleanedWinrates),
		            borderWidth: 1
		        }]
		    },
				options:{
					scales: {
			        yAxes: [{
			            display: true,
			            ticks: {
											suggestedMax: 0.4,
											stepSize: 0.05,
			                suggestedMin: 0.1,    // minimum will be 0, unless there is a lower value
			            }
			        }]
			    }
				},
		});



	}

	makeColorGradient(n){
		var colors = []

		var increment = 255/(n-1);
		for(var i = 0; i < n; i++){
			colors[i] = `rgb(${i*increment}, ${255-i*increment}, 0, 0.4)`;
		}
		return colors;
	}

	makeScaledGradient(data){
		var max = Math.max(...data);
		var min = Math.min(...data);

		var colors = []
		for(var i = 0; i < data.length; i++){
			let ratio = (data[i] - min)/(max - min)
			colors[i] = `rgb(${Math.round((1-ratio)*255)}, ${Math.round(ratio*255)}, 0, 0.4)`;
		}
		return colors;
	}

	enableView(){
		this.mySpan.classList.remove("hidden");
	}

	disableView(){
		this.mySpan.classList.add("hidden");
	}

}

class MachiViewsManager{
	constructor(window, canvas, outputBox, g){
		this.STATE_NAMES = {
			'MAIN_MENU_STATE':0,
			'HUMAN_GAME_STATE':1,
			'GENTIC_STATE':2,
			'TEST_STRAT_STATE':3,
		}

		this.viewState = this.STATE_NAMES.MAIN_MENU_STATE;

		this.menuManager = new MenuViewManager(window, canvas, outputBox);
		this.manage = new GameViewManager(window, canvas, outputBox);
		this.geneticManager = new GeneticViewManager(g);
		this.aiTestManager = new StratTestManager();

		this.currManage = this.menuManager;
	}

	draw(){
		this.currManage.draw();
	}

	openMenu(){
		this.currManage.disableView();
		this.currManage = this.menuManager;
		this.viewState = this.STATE_NAMES.MAIN_MENU_STATE;
		this.currManage.enableView();
		this.draw();
	}

	openGame(){
		this.currManage.disableView();
		this.currManage = this.manage;
		this.viewState = this.STATE_NAMES.HUMAN_GAME_STATE;
		this.currManage.enableView();
		this.draw();

	}

	openAiTest(){
		this.currManage.disableView();
		this.currManage = this.aiTestManager;
		this.viewState = this.STATE_NAMES.TEST_STRAT_STATE;
		this.currManage.enableView();
	}

	openGenetic(){
		this.currManage.disableView();
		this.currManage = this.geneticManager;
		this.viewState = this.STATE_NAMES.GENTIC_STATE;
		this.currManage.enableView();
	}


	canvasClicked(x, y, event){
		var response;
		if(this.viewState === this.STATE_NAMES.MAIN_MENU_STATE){
			this.menuManager.checkClick(x,y);
			return;
		} else if (this.viewState === this.STATE_NAMES.HUMAN_GAME_STATE){
			// print('state is human game')
			response = this.manage.checkClick(x,y);
			if(!Game.initRun){
				return;
			}
			else if(response !== undefined){
				if(Game.players[Game.turnState.playerTurn].isHuman && Game.requireInput){

					var success = hum.f(response);
					if(success){
						if(Game.lastBought != null){
							print('animating buy!')
							this.manage.animateBuy(Game.turnState.playerTurn, Game.lastBought);
						}
						this.manage.disableListeners();
					}
				}
			}
		}
	}

}
