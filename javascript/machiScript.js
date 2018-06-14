console.log('hello world!');
pr = print = console.log
// var tools = require('./tools.js');
// var CardFile = require('./test2.js');
// pr(tools);

console.log(Cards)
class Player{

	constructor(){
		this.name = 'asdf'
		this.money = 0,
		this.cards = []
		this.landmarks = [false,false,false,false]
	}
}

class AIPlayer extends Player {
	constructor(){
		super()
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

	init:function(){
		this.cards = []
		this.players = []


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

Game.init()
Game.playTurn()