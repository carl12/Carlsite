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


Cards = [
	{
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

		src:'images/WheatField.jpg'
	},
	{
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

		src:'images/Ranch.jpg'
	},
	{
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

		src:'images/Bakery.jpg'
	},
	{
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

		src:'images/Cafe.jpg'
	},
	{
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

		src:'images/ConvenienceStore.jpg'
	},
	{
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

		src:'images/Forest.jpg'
	},
	{
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

		src:'images/Stadium.jpg'
	},
	{
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

		src:'images/TVStation.jpg'
	},
	{
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

		src:'images/BusinessCenter.jpg'
	},
	{
		name:"Cheese Factory",
		cost:5,
		triggersOn:COLOR_TRIGGERS.green,
		triggers:[7],
		noInput:true,
		rewardVal:3,
		reward:rewards.per_build(2),
		remain:6,
		category:5,
		isLandmark:false,

		src:'images/CheeseFactory.jpg'
	},
	{
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

		src:'images/FurnitureFactory.jpg'
	},
	{
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

		src:'images/FamilyRestaurant.jpg'
	},
	{
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

		src:'images/AppleOrchard.jpg'
	},
	{
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

		src:'images/FruitAndVegetableMarket.jpg'
	},
	{
		name:"Harbor",
		cost:2,
		isLandmark:true,
		src:'images/Harbor.jpg'
	},
	{
		name:"Station",
		cost:4,
		isLandmark:true,
		landmarkPosition:0,
		src:'images/Station.jpg',

	},
	{
		name:"Shopping Mall",
		cost:10,
		isLandmark:true,
		landmarkPosition:1,
		src:'images/ShoppingMall.jpg',
	},
	{
		name:"Amusement Park",
		cost:16,
		isLandmark:true,
		landmarkPosition:2,

		src:'images/AmusementPark.jpg',
	},
	{
		name:"Radio Tower",
		cost:22,
		isLandmark:true,
		landmarkPosition:3,
		src:'images/RadioTower.jpg',
	}


];
var indexedCards = [];
Object.entries(Cards).forEach((key,val)=>{indexedCards[key[1].position] = key[1]});
var indexedEstablishments = indexedCards.slice(0, FIRST_LANDMARK_LOC);
var indexedLandmarks = indexedCards.slice(FIRST_LANDMARK_LOC);
