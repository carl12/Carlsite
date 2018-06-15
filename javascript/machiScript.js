console.log('hello world!');
pr = print = console.log

var canvas = document.getElementById('tutorial');
canvas.setAttribute('height','400px');
canvas.setAttribute('width','400px');
// canvas.style.height="500px";
canvas.style.outline="3px solid black";

// canvas.stl
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(10, 10, 50, 50);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(30, 30, 50, 50);

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
		this.img = new Image();
		this.img.src = src;
		var img = this.img
		this.ctx = ctx
		this.img.onload = function(){
			print('on load')
			print(this)
			print(x)
			ctx.drawImage(img, x, y)
		}

	}
	redraw(){
		this.ctx.drawImage(this.img,this.x,this.y)
	} 
	animateTo(x,y,steps){
	var dx = (x-this.x)/steps;
	var dy = (y-this.y)/steps;
	var currStep = 0;
	var myself = this
	function transition(){
		myself.ctx.clearRect(0, 0, canvas.width, canvas.height);
		myself.redraw()
		myself.x+=dx;
		myself.y += dy;
		currStep++;
		if(currStep < steps) {
			requestAnimationFrame(transition)
		}
		// print(curr_x);
	}
	requestAnimationFrame(transition)

	}
}

d1 = new ImageWrapper('images/d1.jpg',ctx, 101,201);



y = 50;
x = 50;
var img = new Image();   // Create new img element
img.src = 'images/AmusementPark-right.png'; // Set source path
img.x = x
img.y = y
img.onload = function(){
	ctx.drawImage(img, x,y);
}


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
  ctx.drawImage(img, img.x, img.y);                       // draw image at current position
  img.x -= 4;
  if (x > 0) requestAnimationFrame(animate)        // loop
}



function moveImgTo(imgToMove,x1,y1,x2,y2){
	timeSteps = 50;
	dx = (x2-x1)/timeSteps;
	dy = (y2-y1)/timeSteps;

	curr_x = x1
	curr_y = y1
	var iasdf = 0;

	print('asdf')
	function transition(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(imgToMove, curr_x, curr_y);
		print(curr_x)
		print(dx)
		curr_x+=dx;
		curr_y += dy;
		iasdf++;
		if(iasdf < timeSteps) {
			requestAnimationFrame(transition)
		}
		// print(curr_x);
	}
	requestAnimationFrame(transition)



}

function moveImgTo2(wrapImg,x2,y2){
	var timeSteps = 50;
	var dx = (x2-wrapImg.x)/timeSteps;
	var dy = (y2-wrapImg.y)/timeSteps;

	var currStep = 0;
	function transition(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		wrapImg.redraw()
		wrapImg.x+=dx;
		wrapImg.y += dy;
		currStep++;
		if(currStep < timeSteps) {
			requestAnimationFrame(transition)
		}
		// print(curr_x);
	}
	requestAnimationFrame(transition)



}
print('aasdf')
canvas.addEventListener('mouseover', function(e) {
	print('asdf')
	// moveImgTo2(d1,300,300);
	d1.animateTo(300,300,50);
	// moveImgTo(img, x,y,200,200);
  // raf = window.requestAnimationFrame(animate);
});

// var tools = require('./tools.js');
// var CardFile = require('./test2.js');
// pr(tools);

// console.log(Cards)
class Player{

	constructor(name){
		this.name = name
		this.money = 0,
		this.cards = []
		this.landmarks = [false,false,false,false]
	}
}

class AIPlayer extends Player {
	constructor(name){
		super(name)
		this.is_human = false
	}
}

class HumanPlayer extends Player {
	constructor(){
		super()
		this.is_human = true
	}
}


// pr(CardFile.Cards.Ranch)

function rollDice(){
	return Math.floor(Math.random() * 6) + 1
}

Game = {

	// list of players
	// list of cards
	genericNames:['Aaron','Bob','Carl','Devon'],
	
	init:function(){
	
		this.cards = Cards
		print(Cards.WheatField)
		this.numPlayers = 4
		this.players = []
		for(var i = 0; i < this.numPlayers; i++){
			this.players.push(new AIPlayer(this.genericNames[i]))
		}
		

		pr(this.players)
	},

	playGame:function(){

		for(var i = 0; i < 100; i++){
			for(var j = 0; j < this.players.length; j++){
				this.currPlayer = j
				this.playTurn()
			}
		}
	},

	playTurn:function(){
		secondTurn = this.rollPhase()
		this.rewardPhase()
		this.buyPhase()
		if(secondTurn){
			this.rollPhase()
			this.rewardPhase()
			this.buyPhase()
		}
	},
	rollPhase:function(){
		pr('roll is ' + rollDice())
	},
	rewardPhase:function(){
		pr('doing rewards')

	},
	buyPhase:function(){
		pr('doing buying')
	},

	updateBoard:function(){}

}

// Game.init()
// Game.playTurn()