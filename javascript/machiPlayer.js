function shuffle(arrIn) {
  var currentIndex = arrIn.length, temporaryValue, randomIndex;
  var array = arrIn.slice(0,arrIn.length);
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

function genRandomStrat(){
	var base = [[18,1],[17,1],[16,1],[15,1]]
	var length = randInt(1,10);
	var generated = [];
	for(var i = 0; i < length; i++){
		generated.push([randIntTwoRange(0,6,9,14),randInt(1,6)]);

	}
	// console.log(generated);
	// console.log(base.concat(generated))
	return shuffle(base.concat(generated));

}

class Player{
	constructor(name){
		this.name = name;
		this.money = 2;
		this.cards = [];
		this.landmarks = [false,false,false,false];
		this.winnings = [];
		this.buildingCount = new Array(19).fill(0);
		
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
}

class AIPlayer extends Player {
	constructor(name){
		super(name);
		
		this.isHuman = false;
		var version = Math.floor(Math.random()*2);
		this.doubles = false;
		this.strat = [[16,1], [4,6], [18,1], [17,1], [15,1]];
		if(this.name[0] == 'A'){
			this.strat = [[1,2],[0,5],[3,5],[16,1],[15,1],[18,1],[17,1]];
			this.doubles = false;
		} else if(this.name[0] == 'B'){

			this.strat = [[1,3],[17,1],[4,1],[18,1],[5,3],[0,1],[15,1],[12,1],[16,1],[4,5],[2,2]];
			this.doubles = false;
		} else {
			
			this.strat = [[16,1],[0,4],[15,1],[1,4],[2,5],[18,1],[17,1]];
			this.doubles = false;
		}
		
		
		


	}

	takeInput(input) {
		var num = input.phase;
		
		if(num == 0){
			var output = {};
			//TODO - add more logic here, might have just bought station to get to win
			if(this.doubles){
				output.rollTwo = this.landmarks[0];
			} else {
				output.rollTwo = false;
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
				if(!this.landmarks[buildLoc - firstLandmarkLoc] && this.money >= building.cost){
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
	constructor(){
		super();
		this.isHuman = true;
	}
}

// console.log(genRandomStrat())