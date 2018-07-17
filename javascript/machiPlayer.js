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
		this.isHuman = false;
	}
}

class HumanPlayer extends Player{
	constructor(){
		super();
		this.isHuman = true;
	}
}