pr = print = console.log
print('blah')
class Player{
	constructor(name){
		this.name = name;
		this.money = 2;
		this.cards = [];
		this.landmarks = [false,false,false,false];
		this.strat = Math.ceil(Math.random() * 3);
	}

	rewards(roll, isTurn){
		for(var i in this.cards){
			var c = this.cards[i];
			if(c.triggers.includes(roll) && c.triggersOn(isTurn)){
				c.reward(this);
			}
		}
	}

	buyCard(card){
		card.remain -= 1;
		this.money -= card.cost;
		if(card.isLandmark){
			this.landmarks[card.position] = true;
		} else {
			this.cards.push(card)
		}

		// if(!this.landmarks[1] && this.money >= 10){
		// 	this.money -= 10;
		// 	this.landmarks[1]=true;
		// 	print('bought shopping mall');
		// }
		// else if(!this.landmarks[3] && this.money >= 24){
		// 	this.money -= 24;
		// 	this.landmarks[3]=true;
		// 	print('bought radio');
		// }else if(!this.landmarks[2] && this.money >= 16){
		// 	this.money -= 16;
		// 	this.landmarks[2]=true;
		// 	print('bought amusement');
		// }
		// else if(!this.landmarks[0] && this.money >= 10){
		// 	this.money -= 4;
		// 	this.landmarks[0]=true;
		// 	print('bought station');
		// } 
		// else if(this.strat == 1){
		// 	if(Cards.WheatField.remain > 0 && this.money >= 1){
		// 		var toBuy = Cards.WheatField;
		// 		this.money-=toBuy.cost;
		// 		toBuy.remain--;
		// 		this.cards.push(toBuy);
		// 		print('bought wheat');
		// 	}
		// }else if(this.strat == 2){
		// 	if(Cards.Ranch.remain > 0 && this.money >= 1){
		// 		var toBuy = Cards.Ranch;
		// 		this.money-=toBuy.cost;
		// 		toBuy.remain--;
		// 		this.cards.push(toBuy);
		// 		print('bought ranch');
		// 	}
		// }else if(this.strat == 3){
		// 	if(Cards.ConvStore.remain > 0 && this.money >= 2){
		// 		var toBuy = Cards.ConvStore;
		// 		this.money-=toBuy.cost;
		// 		toBuy.remain--;
		// 		this.cards.push(toBuy);
		// 		print('bought conv');
		// 	}
		// }
	}
}

class AIPlayer extends Player {
	constructor(name){
		super(name);
		this.is_human = false;
	}
}

class HumanPlayer extends Player{
	constructor(){
		super();
		this.is_human = true;
	}
}


function rollDice(){
	return Math.ceil(Math.random() * 6);
}

function allTrue(value){
	return value;
}

Game = {
	genericNames:['Aaron','Bob','Carl','Devon'],

	init:function(){
		Game.winner = -1;
		Game.turnPhases = [Game.rollPhase,Game.rerollPhase,Game.startRewardPhase,Game.inputRewardPhase,Game.buyPhase,Game.nextPlayer];
		Game.turnState = {'playerTurn':0,'phase':0,'amuseDoubles':false,'isSecond':false,'rewardResponse':-1,'gameOver':false};
		Game.numPlayers = 3;
		Game.players = [];
		Game.roll = 0;
		Game.currPlayer = -1;
		for(var i = 0; i < Game.numPlayers; i++){
			Game.players.push(new AIPlayer(Game.genericNames[i]));
		}
	},

	// playGame:function(){
	// 	for(var i = 0; i < 50; i++){
	// 		print('--------------------------');
	// 		print('turn '+i+" starting");
	// 		for(var j = 0; j < Game.players.length; j++){
	// 			var win = Game.playTurn();
	// 			if(win >= 0){
	// 				print('player '+win+' won!');
	// 				return win;

	// 			}
	// 		}
	// 	}
	// },

	// playTurn:function(){
	// 	Game.nextPlayer();
	// 	secondTurn = Game.rollPhase();
	// 	Game.rewardPhase();
	// 	Game.buyPhase();
	// 	if(secondTurn){
	// 		Game.rollPhase();
	// 		Game.rewardPhase();
	// 		Game.buyPhase();
	// 	}
	// 	print('------')
	// 	return Game.checkWinner();
	// },

	next:function (input){
		if(!Game.turnState.gameOver){

		Game.turnPhases[Game.turnState.phase](input);
		} else {
			print('game is over, go home!')
		}
		
	},

	rollPhase:function(input){
		// print(Game.turnState)
		//TODO - enable station to roll second die
		Game.roll = rollDice();
		//TODO - set go again for amusement park
		//TODO - check for radio tower and then set state to reroll phase
		Game.turnState.phase += 2;
	},

	rerollPhase:(input)=>{
		//TODO - take input on whether to reroll or keep
	},

	startRewardPhase:function(){
		//TODO - check if reward cards require player input then move to input reward phase
		for(var i in Game.players){
			Game.players[i].rewards(Game.roll, Game.currPlayer == i);
		}
		Game.turnState.phase+=2;

	},

	inputRewardPhase:(input)=>{
		//TODO - make this function
	},

	buyPhase:function(input){
		if(input !== undefined && input.card !== undefined){
			card = input.card;
		//check card is valid
		currPlayer = Game.players[Game.turnState.playerTurn];

		if(card.cost <= currPlayer.money && card.remain > 0){
			Game.players[Game.currPlayer].buyCard(card);
		} else {
			print('Card purchase failed, either insufficient money or none remain');
		}
	} else {
		print('Buy input failed');
	}
	Game.turnState.phase += 1;
		
	},

	checkWinner:function(){
		for(var i in Game.players){
			if(Game.players[i].landmarks.every(allTrue)){
				Game.winner = parseInt(i);
				print('Add tie-breaking logic');
				break;
			}
		}
		if(Game.winner >= 0){
			Game.turnState.gameOver = true;
		}
	},

	nextPlayer:function(){
		Game.checkWinner();
		if(!Game.turnState.gameOver){
			Game.turnState.playerTurn < Game.players.length - 1 ? Game.turnState.playerTurn++ : Game.turnState.playerTurn = 0;
			Game.turnState.phase = 0;
		}
		else{
			print('game over!')
		}
	},

	updateBoard:function(){}
}

Game.init();
// print(Game.turnState.phase)
Game.next();
Game.next();
Game.next();
Game.next();
print(Game.turnState)




