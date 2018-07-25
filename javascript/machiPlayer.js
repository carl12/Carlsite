class Player{
	constructor(name){
		this.name = name;
		this.money = 2;
		this.cards = [];
		this.landmarks = [false,false,false,false];
		
	}

	rewards(roll, isTurn){
		for(var i in this.cards){
			var c = this.cards[i];
			if(c.triggers.includes(roll) && c.triggersOn(isTurn)){
				this.money += c.reward(this);
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
		this.stratBuyFunc = [this.basicStrat.bind(this), this.ranchStrat.bind(this), 
			this.basicStrat.bind(this), this.basicStrat.bind(this), this.convStoreStrat.bind(this)];
		this.isHuman = false;
		var version = Math.floor(Math.random()*2);
		if(version == 0){
			this.strat = 1;
		} else {
			this.strat = 4;
		}
		
		


	}
	takeInput(input) {
		var num = input.phase;
		
		if(num == 0){
			var output = {};
			//TODO - add more logic here, might have just bought station to get to win
			if(this.strat == 1){
				output.rollTwo = this.landmarks[0];
			} else {
				output.rollTwo = false;
			}
			return output;
		} else if (num == 4) { 

			return this.stratBuyFunc[this.strat]();
		} else {
			// TODO - implement other logic
			throw "Not Implemented: providing input for other phases";
		}
	}

	canBuy(listOfBuildings){
		var buildLoc;
		var building;
		for(var i in listOfBuildings){
			buildLoc = listOfBuildings[i];
			building = indexedCards[buildLoc];
			if(building.isLandmark){
				if(!this.landmarks[buildLoc - firstLandmarkLoc] && this.money >= building.cost){
					return buildLoc;
				}
			} else {
				if(building.remain > 0 && this.money >= building.cost){
					return buildLoc;
				}
			}
		}
		return -1;

	}

	basicStrat(){
		var output = {};
		//TODO - buy other things sometimes
		var num = this.canBuy([16,18,17,15]);
		if(num !== -1){
			output.card = indexedCards[num];
			
			return output;
		}
		// if(indexedCards[this.strat].remain == 0){
		// 	var nextNum = [1, 2, 4, 4, 0];
		// 	var newStrat = this.strat;
		// 	for(var i = 0; i < nextNum.length; i++){
		// 		var newStrat = nextNum[newStrat]
		// 		if(indexedCards[newStrat].remain > 0){
		// 			this.strat = newStrat;
		// 			break;
		// 		}
		// 	}
		// 	console.log('new strat is ', indexedCards[this.strat].name);
		// 	output.card = indexedCards[this.strat];
		// } 
		else {
			output.card = indexedCards[this.strat];
		} 
		
		return output;
	}
	convStoreStrat(){
		var output= {};
		var num = this.canBuy([4, 16, 18, 17, 15]);
		if (num !== -1){
			output.card = indexedCards[num];
		} 
		return output;
	}

	ranchStrat(){
		var output= {};
		var num = this.canBuy([1, 15, 18, 17, 16, 9]);
		if (num !== -1){
			output.card = indexedCards[num];
		} 
		return output;

	}
}

class HumanPlayer extends Player{
	constructor(){
		super();
		this.isHuman = true;
	}
}