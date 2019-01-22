function rollDice(){
	return randInt(1,7);
}

function allTrue(value){
	return value;
}


Game.turns = [
  {f:"a",n:"roll phase"},
  {},
  {},
  {},
  {},
  {},

]
Game.turnPhases = [Game.rollPhase, Game.rerollPhase, Game.startRewardPhase,
						Game.inputRewardPhase, Game.buyPhase, Game.nextPlayer];

Game.turnPhaseNames = ['Roll Phase', 'Reroll Phase', 'Starting Reward Phase',
	'Input Reward Phase', 'Buy Phase', 'Next Player Phase'];
