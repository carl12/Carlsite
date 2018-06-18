pr = print = console.log

var canvas = document.getElementById('tutorial');
canvas.setAttribute('height','400px');
canvas.setAttribute('width','400px');

canvas.style.outline="3px solid black";


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
print(manage.images[1].moving)




print('aasdf')
canvas.addEventListener('mouseover', function(e) {
	print('asdf')
	manage.draw();

});


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