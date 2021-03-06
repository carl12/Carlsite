print = console.log
// console.log('cards loaded')
const COLOR_TRIGGERS={
	red:(isTurn)=> !isTurn,
	blue:()=>true,
	purple:(isTurn)=> isTurn,
	green:(isTurn) => isTurn,
	none:()=> false
}

ESTABLISHMENT_CATEGORY = ['none','farm','animal','food','natural','factory','business'];
FIRST_LANDMARK_LOC = 15;

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
	per_build:per_build_maker,
	stealAll:basicReward,

}


Cards = {
	WheatField:{
		name:"Wheat Field",
		cost:1,
		triggersOn:COLOR_TRIGGERS.blue,
		triggers:[1],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:1,
		isLandmark:false,
		position:0,
		src:'images/WheatField.jpg'
	},
	Ranch:{
		name:"Ranch",
		cost:1,
		triggersOn:COLOR_TRIGGERS.blue,
		triggers:[2],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:2,
		isLandmark:false,
		position:1,
		src:'images/Ranch.jpg'
	},
	Bakery:{
		name:"Bakery",
		cost:1,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[2,3],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		isLandmark:false,
		position:2,
		src:'images/Bakery.jpg'
	},
	Cafe:{
		name:"Cafe",
		cost:2,
		triggersOn:COLOR_TRIGGERS.red,
		triggers:[3],
		noInput:true,
		rewardVal:1,
		reward:rewards.stealn,
		remain:6,
		category:3,
		isLandmark:false,
		position:3,
		src:'images/Cafe.jpg'
	},
	ConvenienceStore:{
		name:"Convenience Store",
		cost:2,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[4],
		noInput:true,
		rewardVal:3,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		isLandmark:false,
		position:4,
		src:'images/ConvenienceStore.jpg'
	},
	Forest:{
		name:"Forest",
		cost:3,
		triggersOn:COLOR_TRIGGERS.blue,
		triggers:[5],
		noInput:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:4,
		isLandmark:false,
		position:5,
		src:'images/Forest.jpg'
	},
	Stadium:{
		name:"Stadium",
		cost:6,
		triggersOn:COLOR_TRIGGERS.purple,
		triggers:[6],
		noInput:true,
		rewardVal:2,
		reward:rewards.stealAll,
		remain:6,
		category:6,
		isLandmark:false,
		position:6,
		src:'images/Stadium.jpg'
	},
	TVStation:{
		name:"TV Station",
		cost:7,
		triggersOn:COLOR_TRIGGERS.purple,
		triggers:[6],
		noInput:false,
		rewardVal:6,
		reward:rewards.stealn,
		remain:6,
		category:6,
		isLandmark:false,
		position:7,
		src:'images/TVStation.jpg'
	},
	BusinessCenter:{
		name:"Business Center",
		cost:8,
		triggersOn:COLOR_TRIGGERS.purple,
		triggers:[6],
		noInput:false,
		rewardVal:0,
		reward:rewards.trade1,
		remain:6,
		category:6,
		isLandmark:false,
		position:8,
		src:'images/BusinessCenter.jpg'
	},
	CheeseFactory:{
		name:"Cheese Factory",
		cost:5,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[7],
		noInput:true,
		rewardVal:3,
		reward:rewards.per_build(3),
		remain:6,
		category:5,
		isLandmark:false,
		position:9,
		src:'images/CheeseFactory.jpg'
	},
	FurnitureFactory:{
		name:"Furniture Factory",
		cost:3,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[8],
		noInput:true,
		rewardVal:3,
		reward:rewards.per_build(3),
		remain:6,
		category:5,
		isLandmark:false,
		position:10,
		src:'images/FurnitureFactory.jpg'
	},
	Mine:{
		name:"Mine",
		cost:6,
		triggersOn:COLOR_TRIGGERS.blue,
		triggers:[9],
		noInput:true,
		rewardVal:5,
		reward:rewards.basicReward,
		remain:6,
		category:4,
		isLandmark:false,
		position:11,
		src:'images/Mine.jpg'
	},
	FamilyRestaurant:{
		name:"Family Restaurant",
		cost:3,
		triggersOn:COLOR_TRIGGERS.red,
		triggers:[9,10],
		noInput:true,
		rewardVal:2,
		reward:rewards.stealn,
		remain:6,
		category:3,
		isLandmark:false,
		position:12,
		src:'images/FamilyRestaurant.jpg'
	},
	AppleOrchard:{
		name:"Apple Orchard",
		cost:3,
		triggersOn:COLOR_TRIGGERS.blue,
		triggers:[10],
		noInput:true,
		rewardVal:3,
		reward:rewards.basicReward,
		remain:6,
		category:1,
		isLandmark:false,
		position:13,
		src:'images/AppleOrchard.jpg'
	},
	FruitAndVegetableMarket:{
		name:"Fruit and Vegetable Market",
		cost:2,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[11,12],
		noInput:true,
		rewardVal:2,
		reward:rewards.per_build(1),
		remain:6,
		category:0,
		isLandmark:false,
		position:14,
		src:'images/FruitAndVegetableMarket.jpg'
	},
	Station:{
		name:"Station",
		cost:4,
		isLandmark:true,
		landmarkPosition:0,
		position:15,
		src:'images/Station.jpg',
		unbuiltSRC:'images/unbuiltStation.jpg',

	},
	ShoppingMall:{
		name:"Shopping Mall",
		cost:10,
		isLandmark:true,
		landmarkPosition:1,
		position:16,
		src:'images/ShoppingMall.jpg',
		unbuiltSRC:'images/unbuiltShoppingMall.jpg',
	},
	AmusementPark:{
		name:"Amusement Park",
		cost:16,
		isLandmark:true,
		landmarkPosition:2,
		position:17,
		src:'images/AmusementPark.jpg',
		unbuiltSRC:'images/unbuiltAmusementPark.jpg',
	},
	RadioTower:{
		name:"Radio Tower",
		cost:22,
		isLandmark:true,
		landmarkPosition:3,
		position:18,
		src:'images/RadioTower.jpg',
		unbuiltSRC:'images/unbuiltRadioTower.jpg',
	}


};
var indexedCards = [];
Object.entries(Cards).forEach((key,val)=>{indexedCards[key[1].position] = key[1]});
var indexedEstablishments = indexedCards.slice(0, FIRST_LANDMARK_LOC);
var indexedLandmarks = indexedCards.slice(FIRST_LANDMARK_LOC);
