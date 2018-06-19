pr = print = console.log
print('blah')
class Player{
	constructor(name){
		this.name = name
		this.money = 2,
		this.cards = []
		this.landmarks = [false,false,false,false]
		this.strat = Math.ceil(Math.random() * 3);
	}

	rewards(roll, isTurn){
		for(var i in this.cards){
			var c = this.cards[i]
			if(c.triggers.includes(roll) && c.triggersOn(isTurn)){
				c.reward(this);
			}
		}
	}
	buyCard(game){
		if(!this.landmarks[1] && this.money >= 10){
			this.money -= 10;
			this.landmarks[1]=true;
			print('bought shopping mall')
		}
		else if(!this.landmarks[3] && this.money >= 24){
			this.money -= 24;
			this.landmarks[3]=true;
			print('bought radio')
		}else if(!this.landmarks[2] && this.money >= 16){
			this.money -= 16;
			this.landmarks[2]=true;
			print('bought amusement')
		}
		else if(!this.landmarks[0] && this.money >= 10){
			this.money -= 4;
			this.landmarks[0]=true;
			print('bought station')
		} 
		else if(this.strat == 1){
			if(Cards.WheatField.remain > 0 && this.money >= 1){
				var toBuy = Cards.WheatField
				this.money-=toBuy.cost;
				toBuy.remain--;
				this.cards.push(toBuy);
				print('bought wheat')
			}
		}else if(this.strat == 2){
			if(Cards.Ranch.remain > 0 && this.money >= 1){
				var toBuy = Cards.Ranch
				this.money-=toBuy.cost;
				toBuy.remain--;
				this.cards.push(toBuy);
				print('bought ranch')
			}
		}else if(this.strat == 3){
			if(Cards.ConvStore.remain > 0 && this.money >= 2){
				var toBuy = Cards.ConvStore
				this.money-=toBuy.cost;
				toBuy.remain--;
				this.cards.push(toBuy);
				print('bought conv')
			}
		}

		print(this.strat)
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
	return Math.ceil(Math.random() * 6);
}

function allTrue(value){
	return value;
}

Game = {

	// list of players
	// list of cards
	genericNames:['Aaron','Bob','Carl','Devon'],
	
	init:function(){
	
		// this.cards = Cards
		this.numPlayers = 3
		this.players = []
		this.roll = 0
		this.currPlayer = -1;
		for(var i = 0; i < this.numPlayers; i++){
			this.players.push(new AIPlayer(this.genericNames[i]))
		}
		

	},

	playGame:function(){
		for(var i = 0; i < 50; i++){
			print('--------------------------')
			print('turn '+i+" starting")
			for(var j = 0; j < this.players.length; j++){
				var win = this.playTurn()
				if(win >= 0){
					print('player '+win+' won!')
					return win;

				}
			}
		}
	},

	playTurn:function(){
		this.nextPlayer()
		secondTurn = this.rollPhase()
		this.rewardPhase()
		this.buyPhase()
		if(secondTurn){
			this.rollPhase()
			this.rewardPhase()
			this.buyPhase()
		}
		return this.checkWinner()
	},
	nextPlayer:function(){
		this.currPlayer < this.players.length - 1 ? this.currPlayer++ : this.currPlayer = 0;
	},
	rollPhase:function(){
		this.roll = rollDice()
		console.log('roll is ' + this.roll)
	},
	rewardPhase:function(){
		for(var i in this.players){
			this.players[i].rewards(this.roll, this.currPlayer == i)
		}

	},
	buyPhase:function(){
		this.players[this.currPlayer].buyCard(this);
	},
	checkWinner:function(){
		var winner = -1;
		for(var i in this.players){
			if(this.players[i].landmarks.every(allTrue)){
				winner = i;
				print('Add tie-breaking logic');
				break;
			}
		}
		return winner;
	},

	updateBoard:function(){}

}

// Game.init()
// console.log(Game.players)
// console.log(Game.players.length)
// console.log(Game.checkWinner())
// print(Game.players)