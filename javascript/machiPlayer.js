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
		this.cards = [indexedCards[0], indexedCards[2]];

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
aiStratList = [
[[[5,3],[15,1],[10,2],[16,1],[0,3],[17,1],[18,1],[11,1]],1],//337
[[[16,1],[3,3],[4,4],[18,1],[0,2],[15,1],[0,1],[17,1],[2,3]],0],//335 avg 31%
[[[1,1],[16,1],[17,1],[3,3],[18,1],[4,1],[0,5],[15,1]],0],//354
[[[1,5],[0,3],[3,2],[16,1],[4,1],[0,2],[18,1],[15,1],[17,1]],0], //516?!?!
[[[1,2],[16,1],[3,3],[1,2],[2,2],[3,5],[17,1],[1,5],[18,1],[5,2],[2,1],[15,1]],0],//401
]



bTeam = [
[[[1,3],[16,1],[3,4],[2,1],[18,1],[15,1],[17,1]],0],
[[[16,1],[17,1],[18,1],[0,3],[2,5],[2,5],[4,4],[15,1],[5,5]],0],//408
[[[11,1],[17,1],[18,1],[16,1],[5,5],[15,1],[1,5],[5,4],[0,2],[1,4],[10,5],[2,5],[1,1]],1],
[[[11,2],[5,3],[17,1],[1,3],[16,1],[0,2],[18,1],[15,1],[10,4],[0,1],[4,4]],1], //Scored a 429/1000 ?!?!

[[[1,2],[18,1],[0,2],[16,1],[2,5],[5,1],[3,4],[2,2],[15,1],[17,1],[13,1]],0],
//Above on patch where start with wheat field and bakery
[[[1,1],[18,1],[16,1],[2,5],[17,1],[5,2],[12,3],[0,3],[15,1],[4,3],[2,5],[13,4],[2,4]],0],
[[[1,4],[16,1],[2,5],[2,2],[12,1],[15,1],[17,1],[18,1],[3,1]],0], //439!
[[[5,4],[1,1],[18,1],[11,1],[15,1],[17,1],[1,3],[16,1],[10,2],[4,2],[10,4],[1,3]],true],
[[[5,3],[15,1],[17,1],[11,1],[16,1],[18,1],[1,4],[10,5],[3,4]],1], //scored a 395/1000!
[[[1,2],[17,1],[5,2],[15,1],[18,1],[9,2],[0,1],[16,1],[1,5],[3,2],[0,4]],1], //new guy on da block - bad in last place somehow
[[[17,1],[18,1],[5,2],[0,2],[15,1],[16,1],[1,5],[5,5],[10,3],[1,2],[1,3],[2,1],[1,3]],1], //sketchy one - fixed by changing to 1
[[[17,1],[16,1],[0,3],[2,5],[18,1],[3,4],[15,1],[5,2]], false],

//ousted first place, only got ~29% -- consistently last place in randomized game - getting demoted
[[[0,4],[1,4],[18,1],[3,5],[16,1],[15,1],[17,1]],false], 
[[[5,2],[17,1],[1,3],[12,1],[11,1],[15,1],[0,1],[10,4],[16,1],[18,1],[1,2],[3,3]],0],
]
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
	constructor(name){
		super(name);
		this.isHuman = true;
	}
}

// console.log(genRandomStrat())