print = console.log
// console.log('cards loaded')
trigger={
	red:(isTurn)=> !isTurn,
	blue:()=>true,
	purple:(isTurn)=> isTurn,
	green:(isTurn) => isTurn,
	none:()=> false
}

category=['none','farm','animal','food','natural','factory','business'];
firstLandmarkLoc = 15;

function reward_func(player){
	//TODO - implement rewards that require input. 
	// console.log('implement reward function');
	return 0;
}

function per_build_maker(buildingType){
	return function(player){
		count = 0;
		player.cards.forEach((a)=>{if(a.category == buildingType){count+= this.rewardVal;}})
		return count;
	}
	

}

function basicReward(player){
	if(this.category == 3 && player.landmarks[1]){
		return this.rewardVal + 1;
	}
	return this.rewardVal;
}




rewards={
	basicReward:basicReward,
	stealn:basicReward,
	stealAll:reward_func,
	trade1:reward_func,
	per_build:per_build_maker

}


Cards = {
	WheatField:{
		name:"Wheat Field",
		cost:1,
		triggersOn:trigger.blue,
		triggers:[1],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:1,
		isLandmark:false,
		position:0,
		src:''
	},
	Ranch:{
		name:"Ranch",
		cost:1,
		triggersOn:trigger.blue,
		triggers:[2],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:2,
		isLandmark:false,
		position:1,
		src:''
	},
	Bakery:{
		name:"Bakery",
		cost:1,
		triggersOn:trigger.green,
		triggers:[2,3],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		isLandmark:false,
		position:2,
		src:''
	},
	Cafe:{
		name:"Cafe",
		cost:2,
		triggersOn:trigger.red,
		triggers:[3],
		noInput:true,
		rewardVal:1,
		reward:rewards.stealn,
		remain:6,
		category:3,
		isLandmark:false,
		position:3,
		src:''
	},
	ConvStore:{
		name:"Convenience Store",
		cost:2,
		triggersOn:trigger.green,
		triggers:[4],
		noInput:true,
		rewardVal:3,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		isLandmark:false,
		position:4,
		src:''
	},
	Forest:{
		name:"Forest",
		cost:3,
		triggersOn:trigger.blue,
		triggers:[5],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:4,
		isLandmark:false,
		position:5,
		src:''
	},
	Stadium:{
		name:"Stadium",
		cost:6,
		triggersOn:trigger.purple,
		triggers:[6],
		noInput:false,
		rewardVal:2,
		reward:rewards.stealAll,
		remain:6,
		category:6,
		isLandmark:false,
		position:6,
		src:''
	},
	TVStation:{
		name:"TV Station",
		cost:7,
		triggersOn:trigger.purple,
		triggers:[6],
		noInput:false,
		rewardVal:6,
		reward:rewards.stealn,
		remain:6,
		category:6,
		isLandmark:false,
		position:7,
		src:''
	},
	BusinessCenter:{
		name:"Business Center",
		cost:8,
		triggersOn:trigger.purple,
		triggers:[6],
		noInput:false,
		rewardVal:0,
		reward:rewards.trade1,
		remain:6,
		category:6,
		isLandmark:false,
		position:8,
		src:''
	},
	CheeseFactory:{
		name:"Cheese Factory",
		cost:5,
		triggersOn:trigger.green,
		triggers:[7],
		noInput:true,
		rewardVal:3,
		reward:rewards.per_build(2),
		remain:6,
		category:5,
		isLandmark:false,
		position:9,
		src:''
	},
	FurnitureFactory:{
		name:"Furniture Factory",
		cost:3,
		triggersOn:trigger.green,
		triggers:[8],
		noInput:true,
		rewardVal:3,
		reward:rewards.per_build(4),
		remain:6,
		category:5,
		isLandmark:false,
		position:10,
		src:''
	},
	Mine:{
		name:"Mine",
		cost:6,
		triggersOn:trigger.blue,
		triggers:[9],
		noInput:true,
		rewardVal:5,
		reward:rewards.basicReward,
		remain:6,
		category:4,
		isLandmark:false,
		position:11,
		src:''
	},
	FamilyRestaurant:{
		name:"Family Restaurant",
		cost:3,
		triggersOn:trigger.red,
		triggers:[9,10],
		noInput:true,
		rewardVal:2,
		reward:rewards.stealn,
		remain:6,
		category:3,
		isLandmark:false,
		position:12,
		src:''
	},
	AppleOrchard:{
		name:"Apple Orchard",
		cost:3,
		triggersOn:trigger.blue,
		triggers:[10],
		noInput:true,
		rewardVal:3,
		reward:rewards.basicReward,
		remain:6,
		category:1,
		isLandmark:false,
		position:13,
		src:''
	},
	FruitAndVegetableMarket:{
		name:"Fruit and Vegetable Market",
		cost:2,
		triggersOn:trigger.green,
		triggers:[11,12],
		noInput:true,
		rewardVal:2,
		reward:rewards.per_build(1),
		remain:6,
		category:0,
		isLandmark:false,
		position:14,
		src:''
	},
	Station:{
		name:"Station",
		cost:4,
		isLandmark:true,
		landmarkPosition:0,
		position:15
	},
	ShoppingMall:{
		name:"Shopping Mall",
		cost:10,
		isLandmark:true,
		landmarkPosition:1,
		position:16
	},
	AmusementPark:{
		name:"Amusement Park",
		cost:16,
		isLandmark:true,
		landmarkPosition:2,
		position:17
	},
	RadioTower:{
		name:"Radio Tower",		
		cost:24,
		isLandmark:true,
		landmarkPosition:3,
		position:18
	}


};
indexedCards = [];
Object.entries(Cards).forEach((key,val)=>{indexedCards[key[1].position] = key[1]});
player = {
	cards:[indexedCards[5], indexedCards[5],indexedCards[5],indexedCards[5],indexedCards[1]]
}
console.log(Cards.CheeseFactory.reward(player))
