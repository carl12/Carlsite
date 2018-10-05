DOUBLE_ROLL_ODDS = [1/36, 2/36, 3/36, 4/36, 5/36, 6/36, 5/36, 4/36, 3/36, 2/36, 1/36];

function shuffle(arrIn) {
  var currentIndex = arrIn.length, temporaryValue, randomIndex;
  var array = JSON.parse(JSON.stringify(arrIn));
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function randInt(low, high){
	var diff = high-low;
	var val = Math.floor(Math.random() * diff) + low;
	return val;
}

function randIntTwoRange(low1, high1, low2, high2){
	var diff = (high1-low1) + (high2-low2);
	var val = Math.floor(Math.random() * diff) + low1;

	if(val  >= high1 ){
		val = val - high1 + low2;
	}
	return val;
}

function genRandomBuildPriority(){
	var base = [[18,1],[17,1],[16,1],[15,1]]
	var length = randInt(1,10);
	var generated = [];
	for(var i = 0; i < length; i++){
		generated.push([randIntTwoRange(0,7,9,15),randInt(1,6)]);
	}
	return shuffle(base.concat(generated));
}
class Player{
	constructor(name){
		this.name = name;
		this.money = 2;
		this.buildingCount = new Array(19).fill(0);

		this.cards = [indexedCards[0], indexedCards[2]];
		this.buildingCount[0] = 1;
		this.buildingCount[2] = 1;
		this.landmarks = [false,false,false,false];
		this.winnings = [];

	}
	rewards(roll, isTurn){

	}

	buyCard(card){

		this.money -= card.cost;
		if(card.isLandmark){
			this.landmarks[card.landmarkPosition] = true;
		} else {
			card.remain -= 1;
			this.cards.push(card)
			this.buildingCount[card.position]+=1;
		}
	}
	income(){
		return this.winnings.reduce((a, b) => a + b, 0);
	}

	getRollEv(roll){
		var income1D = 0;
		var income2D = 0;
		var c;
		if(this.landmarks[0]){
			for(var i = 0; i < this.cards.length; i++){
				c = this.cards[i];
				for(var j = 0; j < c.triggers.length && c.triggersOn(true); j++){
					income2D += c.reward(this) * DOUBLE_ROLL_ODDS[c.triggers[j]];
				}
			}
		}
		for(var i = 0; i < this.cards.length; i++){
			c = this.cards[i];
			for(var j = 0; j < c.triggers.length && c.triggers[j] <= 6 && c.triggersOn(true); j++){
				income1D += c.reward(this)/6;
			}
		}

		if(income1D > income2D){
			return [income1D, 1];
		} else {
			return [income2D, 2];
		}
	}

	evalIncome(roll){
		var income = 0;
		var c;

		for(var i = 0; i < this.cards.length; i++){
			c = this.cards[i];

			if(c.triggers.includes(roll) && c.triggersOn(true)) {
				income += c.reward(this);
			}
		}
		return income;
	}
}
aiStratList = [
[[[18,1],[0,0],[1,2],[3,1],[16,1],[4,4],[17,1],[2,3],[15,1]],0],
[[[5,3],[15,1],[10,2],[18,1],[17,1],[16,1],[11,2],[1,2]],1], // - countered by [[[5,5],[12,1],[18,1],[1,3],[17,1],[16,1],[2,5],[15,1]],0],
[[[18,1],[5,3],[15,1],[10,1],[16,1],[17,1],[1,2],[0,2],[5,2],[11,4]],1],
[[[5,2],[18,1],[17,1],[15,1],[10,1],[16,1],[11,5],[1,2]],1], // just added
[[[16,1],[1,4],[4,5],[18,1],[17,1],[15,1],[0,5]],0],
[[[16,1],[3,3],[4,4],[18,1],[0,2],[15,1],[0,1],[17,1],[2,3]],0],//335 avg 31%
[[[18,1],[0,5],[4,4],[16,1],[15,1],[17,1]],0],
[[[0,4],[16,1],[2,4],[18,1],[4,1],[15,1],[17,1]],0],
[[[5,3],[5,1],[15,1],[18,1],[1,4],[10,1],[16,1],[17,1],[3,4]],1],
[[[1,3],[16,1],[3,5],[4,1],[18,1],[2,4],[15,1],[17,1],[3,5]],0],
[[[3,2],[3,3],[18,1],[16,1],[0,5],[4,4],[15,1],[17,1]],0],
[[[5,3],[15,1],[10,2],[16,1],[0,3],[17,1],[18,1],[11,1]],1],//337
// [[[16,1],[18,1],[1,5],[2,5],[17,1],[15,1],[0,4]],0],
// [[[1,5],[18,1],[16,1],[3,5],[0,4],[15,1],[17,1]],0],
]

//[0.2936760891546138, 0.28368856565124706, 0.27562029234233243, 0.2757425543062105, 0.2742609089978204, 0.2601329474904972, 0.2547351495550805, 0.2555264321931354, 0.22891265936934097, 0.22995090315528569, 0.22126520716799813]
class AIPlayer extends Player {
	constructor(name){
		super(name);

		this.isHuman = false;
		var version = Math.floor(Math.random()*2);
		this.aiChoice = randInt(0,aiStratList.length);

		this.strat = aiStratList[this.aiChoice][0];
		this.doubles = aiStratList[this.aiChoice][1];


		// if(this.name[0] == 'A'){
		// 	this.doubles = aiStratList[0][1];
		// 	this.strat = aiStratList[0][0];
		// } else if(this.name[0] == 'B'){

		// 	this.strat = aiStratList[1][0];
		// 	this.doubles = aiStratList[1][1];
		// } else {
		// 	this.strat = aiStratList[2][0];
		// 	this.doubles = aiStratList[2][1];

		// }





	}

	takeInput(input) {
		var num = input.phase;

		if(num == 0 || num == 1){
			var output = {};
			//TODO - add more logic here, might have just bought station to get to win
			if(this.doubles){
				output.rollTwo = this.landmarks[0];
			} else {
				output.rollTwo = false;
			}
			if(num == 1){
				var income = this.evalIncome(input.currD1 + input.currD2);
				var rollEv = this.getRollEv()[0];

				if(income > rollEv){
					output.reroll = false;
				} else if (this.landmarks[2] && input.currD1 == input.currD2 && income > rollEv/6){
					output.reroll = false;
				} else {

					output.reroll = true;
				}
			}
			return output;
		} else if (num == 4) {
			return this.basicStrat();
		} else {
			// TODO - implement other logic
			throw "Not Implemented: providing input for other phases";
		}
	}



	canBuy(listOfBuildings){
		var buildLoc;
		var building;
		var quantity;

		for(var i in listOfBuildings){

			buildLoc = listOfBuildings[i][0];
			quantity = listOfBuildings[i][1];
			building = indexedCards[buildLoc];

			if(building.isLandmark){
				if(!this.landmarks[buildLoc - FIRST_LANDMARK_LOC] && this.money >= building.cost){
					return buildLoc;
				}
			} else {
				if(building.remain > 0 && this.money >= building.cost && this.buildingCount[buildLoc] <= quantity){
					return buildLoc;
				}
			}


		}
		return -1;

	}


	basicStrat(){
		var output= {};
		var num = this.canBuy(this.strat);
		if (num !== -1){
			output.card = indexedCards[num];
		}
		return output;
	}

	// ranchStrat(){
	// 	var output= {};
	// 	var num = this.canBuy([[1,6], [15,1], [18,1], [17,1], [16,1], [9,3]]);
	// 	if (num !== -1){
	// 		output.card = indexedCards[num];
	// 	}
	// 	return output;

	// }
}

class HumanPlayer extends Player{
	constructor(name){
		super(name);
		this.isHuman = true;
	}
}

// console.log(genRandomStrat())
