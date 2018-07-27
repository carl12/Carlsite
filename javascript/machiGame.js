pr = print = console.log




function rollDice(){
	return Math.ceil(Math.random() * 6);
}

function allTrue(value){
	return value;
}

Game = {
	genericNames:['Aaron','Bob','Carl','Devon'],

	init:function(){
		for(var j in indexedCards){
			indexedCards[j].remain = 6;
		}
		Game.turn = 0;
		Game.winner = -1;
		Game.turnPhases = [Game.rollPhase, Game.rerollPhase, Game.startRewardPhase,
								Game.inputRewardPhase, Game.buyPhase, Game.nextPlayer];

		Game.phaseRequiresInput = [true, true, false, true, true, false]
		Game.phaseStrings = ['roll', 'reroll', 'start reward', 
								'reward input', 'buy', 'ending turn']

		Game.turnState = {'playerTurn':0, 'phase':0, 'amuseDoubles':false, 'isSecond':false,
							'rewardResponse':-1, 'gameOver':false};

		Game.numPlayers = 4;
		Game.players = [];
		Game.rollDist = new Array(12).fill(0);
		Game.roll = 0;
		for(var i = 0; i < Game.numPlayers; i++){
			Game.players.push(new AIPlayer(Game.genericNames[i]));
		}
	},
	getTurnString(){
		return Game.phaseStrings[Game.turnState.phase]
	},

	next:function (input){
		if(!Game.turnState.gameOver){
			return Game.turnPhases[Game.turnState.phase](input);
		} else {
			print('game is over, go home!')
			return false;
		}
		
	},

	requireInput:function(){
		//TODO - add conditional for roll phase input
		return Game.phaseRequiresInput[Game.turnState.phase]
	},

	getInputType:function(){
		inputType={};
		if(Game.turnPhases[Game.turnState.phase] !== Game.inputRewardPhase){
			inputType.player = Game.players[Game.turnState.playerTurn];
		} else {
			inputType.player = Game.players[Game.turnState.rewardResponse];
		}
		inputType.phase = Game.turnState.phase;
		if (inputType.phase == 3){
			//TODO - fix
			throw "Not impelmented: getInputType for inputRewardPhase"
		}
		return inputType;
	},

	rollPhase:function(input){
		if(input !== undefined && input.rollTwo !== undefined){
			var a = 0;
			var b = 0;
			var currPlayer = Game.players[Game.turnState.playerTurn]
			if (input.rollTwo && currPlayer.landmarks[0]){
				a = rollDice();
				b = rollDice();
			} else {
				a = rollDice();
				Game.rollDist[Game.roll-1] ++;	
			}

			//TODO - check for radio tower for reroll

			if(currPlayer.landmarks[2] && a === b){
				//TODO - add go again functionality
			}

			Game.roll = a + b;
			Game.turnState.phase += 2;
			return true;
		} else {
			return false;
		}
		
	},

	rerollPhase:function(){
		//TODO - take input on whether to reroll or keep
	},

	startRewardPhase:function(){
		//TODO - check if reward cards require player input then move to input reward phase
		for(var i in Game.players){
			Game.players[i].rewards(Game.roll, Game.turnState.playerTurn == i);
		}
		Game.turnState.phase += 2;

	},

	inputRewardPhase:function(input){
		//TODO - make this function
		return false;
	},

	buyPhase:function(input){
		if(input !== undefined && input.card !== undefined){
			card = input.card;
			//check card is valid
			currPlayer = Game.players[Game.turnState.playerTurn];
			if(!card.isLandmark){
				if(card.cost <= currPlayer.money && card.remain > 0){
					currPlayer.buyCard(card);
					// print(card.name, ' bought');
				} else {
					// print('Card purchase failed, either insufficient money or none remain');
					// print(card);
					// print(card.cost);
					// print(currPlayer.money);
				}
			} else {
				// print('trying to buy a landmark')
				if(card.cost <= currPlayer.money && !currPlayer.landmarks[card.landmarkPosition]){
					currPlayer.buyCard(card);
					// print(card.name, ' bought!!!');
				} else {
					// print('Landmark purchase failed, either insufficient money or already own');
					
				}
			}
			
		} else {
			// print('No card input');
		}
		Game.turnState.phase += 1;
		return true;
	},

	checkWinner:function(){
		for(var i in Game.players){
			if(Game.players[i].landmarks.every(allTrue)){
				Game.winner = parseInt(i);
				//TODO - add tiebreaking logic
				// print('Add tie-breaking logic');
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
			Game.turn += 1;
			if(Game.turnState.playerTurn == 0){
				// print('-----------'); 
			}
		}
		else{
			// print('game over!');
		}
	},

	currIsHuman:function(){
		var curr = Game.turnState.playerTurn;
		return Game.players[curr].isHuman;
	},

	updateBoard:function(){}
}

Game.turnPhases = [Game.rollPhase, Game.rerollPhase, Game.startRewardPhase,
						Game.inputRewardPhase, Game.buyPhase, Game.nextPlayer];

turnPhases = [
	{
		name:'rollPhase',
		func:Game.rollPhase.bind(Game),
		input:'oneOrTwoDice'
	},
	{
		name:'rerollPhase',
				

	},

]





