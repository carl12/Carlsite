
// console.log('cards loaded')
trigger={
	red:(isTurn)=> !isTurn,
	blue:()=>true,
	purple:(isTurn)=> isTurn,
	green:(isTurn) => isTurn
}

category=['none','farm','animal','food','natural','factory','business'];

function reward_func(player){
	console.log('implement reward function');
}
function basicReward(player){
	if(this.category == 3 && player.landmarks[1]){
		player.money++;
	}
	player.money+=this.rewardVal;
}
rewards={
	basicReward:basicReward,
	steal1:reward_func,
	stealAll:reward_func,
	trade1:reward_func,
	per_build:reward_func
}


Cards = {
	WheatField:{
		name:"Wheat Field",
		cost:1,
		triggersOn:trigger.blue,
		triggers:[1],
		fixed:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:1,
		position:0,
		isLandmark:false
	},
	Ranch:{
		name:"Ranch",
		cost:1,
		triggersOn:trigger.blue,
		triggers:[2],
		fixed:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:2,
		position:1,
		isLandmark:false
	},
	Bakery:{
		name:"Bakery",
		cost:1,
		triggersOn:trigger.green,
		triggers:[2,3],
		fixed:true,
		rewardVal:1,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		position:2,
		isLandmark:false
	},
	Cafe:{
		name:"Cafe",
		cost:2,
		triggersOn:trigger.red,
		triggers:[3],
		fixed:false,
		rewardVal:1,
		reward:rewards.steal1,
		remain:6,
		category:3,
		position:3,
		isLandmark:false
	},
	ConvStore:{
		name:"Convenience Store",
		cost:2,
		triggersOn:trigger.green,
		triggers:[4],
		fixed:true,
		rewardVal:3,
		reward:rewards.basicReward,
		remain:6,
		category:3,
		position:4,
		isLandmark:false
	},
	Forest:{
		name:"Forest",
		cost:3,
		triggersOn:trigger.blue,
		triggers:[5],
		fixed:true,
		rewardVal:6,
		reward:rewards.basicReward,
		remain:6,
		category:4,
		position:5,
		isLandmark:false
	},
	Stadium:{
		name:"Stadium",
		cost:6,
		triggersOn:trigger.purple,
		triggers:[6],
		fixed:false,
		rewardVal:2,
		reward:rewards.stealAll,
		remain:6,
		category:6,
		position:6,
		isLandmark:false
	},
	TVStation:{
		name:"TV Station",
		cost:7,
		triggersOn:trigger.purple,
		triggers:[6],
		fixed:false,
		rewardVal:6,
		reward:rewards.steal1,
		remain:6,
		category:6,
		position:7,
		isLandmark:false
	},
	BusinessCenter:{
		name:"Business Center",
		cost:8,
		triggersOn:trigger.purple,
		triggers:[6],
		fixed:false,
		rewardVal:0,
		reward:rewards.trade1,
		remain:6,
		category:6,
		position:8,
		isLandmark:false
	},
	CheeseFactory:{
		name:"Cheese Factory",
		cost:5,
		triggersOn:trigger.blue,
		triggers:[7],
		fixed:false,
		rewardVal:3,
		reward:rewards.per_build,
		remain:6,
		category:5,
		position:9,
		isLandmark:false
	}
};

