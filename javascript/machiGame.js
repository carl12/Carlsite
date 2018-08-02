pr = print = console.log




function rollDice(){
	return randInt(1,7);
}

function allTrue(value){
	return value;
}

Game = {
	genericNames:['Aaron','Bob','Carl','Devon'],

	init:function(print = false){
		for(var j in indexedCards){
			indexedCards[j].remain = 6;
		}
		Game.print = print;
		Game.turn = 0;
		Game.winner = -1;
		Game.turnPhases = [Game.rollPhase, Game.rerollPhase, Game.startRewardPhase,
								Game.inputRewardPhase, Game.buyPhase, Game.nextPlayer];

		Game.phaseRequiresInput = [true, true, false, true, true, false]
		Game.phaseStrings = ['roll', 'reroll', 'start reward', 
								'reward input', 'buy', 'ending turn']

		Game.turnState = {'playerTurn':0, 'phase':0, 'amuseDoubles':false, 'isSecond':false,
							'rewardResponse':-1, 'gameOver':false};
		Game.inputQueue = [];
		Game.numPlayers = 4;
		Game.players = [];
		Game.rollDist = new Array(12).fill(0);
		Game.roll = 0;
		Game.d1Roll = 0;
		Game.d2Roll = 0;
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
		if(Game.turnState.phase == 1){
			inputType.currD1 = Game.d1Roll;
			inputType.currD2 = Game.d2Roll;
		}
		if (inputType.phase == 3){
			//TODO - fix
			throw "Not impelmented: getInputType for inputRewardPhase"
		}
		return inputType;
	},

	rollPhase:function(input){
		Game.rollOneOrTwo(input);
		if(Game.d1Roll > 0){
			var currPlayer = Game.players[Game.turnState.playerTurn];
			if(Game.print){
				print(Game.roll ,' rolled');
			}
			if(currPlayer.landmarks[3]){
				Game.turnState.phase += 1;
				return true;
			} else {
				input.reroll = false;
				Game.turnState.phase += 1;
				Game.rerollPhase(input);	
			}
		} else {
			return false;
		}
	},

	rerollPhase:function(input){
		//TODO - take input on whether to reroll or keep
		if(input !== undefined && input.reroll !== undefined){
			var currPlayer = Game.players[Game.turnState.playerTurn];
			if(input.reroll){
				Game.rollOneOrTwo(input);
				if(Game.d1Roll == 0){
					return false;
				} else {
					if(Game.print){
						print(Game.roll ,' re-rolled');
					}
				}
			} 
			if(currPlayer.landmarks[2] && Game.d1Roll === Game.d2Roll){
				if(Game.print){
					print(currPlayer.name,' takes a second turn!')
				}
				Game.turnState.amuseDoubles = true;
				//TODO - add go again functionality
			} 
			Game.turnState.phase += 1;

			return true;
		} else {
			return false;
		}
	},

	rollOneOrTwo(input){
		if(input !== undefined && input.rollTwo !== undefined){
			var a = 0;
			var b = 0;
			var currPlayer = Game.players[Game.turnState.playerTurn]
			if (input.rollTwo && currPlayer.landmarks[0]){
				Game.d1Roll = rollDice();
				Game.d2Roll = rollDice();
			} else {
				Game.d1Roll = rollDice();
				Game.d2Roll = 0;
			}
		} else {
			Game.d1Roll = 0;
			Game.d2Roll = 0;
		}
		Game.roll = Game.d1Roll + Game.d2Roll;
	},

	startRewardPhase:function(){
		//TODO - check if reward cards require player input then move to input reward phase
		for(var i in Game.players){
			var p = Game.players[i];
			var isTurn = Game.turnState.playerTurn == i;
			var pre = p.money;
			for(var j in p.cards){
				var c = p.cards[j];
				if(c.triggers.includes(Game.roll) && c.triggersOn(isTurn))
				{
					if(c.noInput){
						if(c.triggersOn === trigger.red){
							var currPlayer = Game.players[Game.turnState.playerTurn];
							var moneyLost = Math.min(currPlayer.money, c.reward(p));
							Game.players[Game.turnState.playerTurn].money -= moneyLost;
							p.money += moneyLost;

						} else {
							p.money += c.reward(p);
						}
					} else {
						print(c , ' requires input ');
						// Game.inputQueue.push([p, c, Game.roll]);
					}
				}
			}
			p.winnings.push(p.money - pre);
		}
		if(Game.inputQueue.length === 0){
			Game.turnState.phase += 2;
		} else {
			Game.turnState.phase += 1;
		}
		if(Game.print){
				print('reward phase over');
		}
	},

	inputRewardPhase:function(input){
		var resovling = Game.inputQueue.pop()

		return false;
	},

	buyPhase:function(input){
		if(input !== undefined && input.card !== undefined){
			card = input.card;
			//check card is valid
			var currPlayer = Game.players[Game.turnState.playerTurn];
			if(!card.isLandmark){
				if(card.cost <= currPlayer.money && card.remain > 0){
					currPlayer.buyCard(card);
					if(Game.print){
						print(currPlayer.name , ' bought ', card.name);
					}
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
					if(Game.print){
						print(currPlayer.name , ' bought ', card.name, ' !!');
					}
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
				if(Game.print){
						print(Game.players[winner] , ' won!');
				}
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
			if(Game.turnState.amuseDoubles && !Game.turnState.isSecond){
				Game.turnState.isSecond = true;
				// print('woo taking another turn!!')
			} else {
				Game.turnState.playerTurn < Game.players.length - 1 ? Game.turnState.playerTurn++ : Game.turnState.playerTurn = 0;
				Game.turn += 1;
				if(Game.print){
					print('It is now ', Game.players[Game.turnState.playerTurn].name,"'s turn!");
				}
			}
			Game.turnState.phase = 0;
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

Game.turnPhaseNames = ['Roll Phase', 'Reroll Phase', 'Starting Reward Phase', 
	'Input Reward Phase', 'Buy Phase', 'Next Player Phase'];




