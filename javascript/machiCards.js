
console.log('cards loaded')
triggers={
	red:[false,true],
	blue:[true,true],
	purple:[true,false],
	green:[true,false]
}

category=['none','farm','animal','food','natural','factory','business']

function reward_func(){
	console.log('implement reward function')
}

rewards={
	steal1:reward_func,
	stealAll:reward_func,
	trade1:reward_func,
	per_build:reward_func
}



Cards = {
	WheatField:{
		name:"Wheat Field",
		cost:1,
		turn:triggers.blue,
		trigger:[1],
		fixed:true,
		reward:1,
		remain:6
	},
	Ranch:{
		name:"Ranch",
		cost:1,
		turn:triggers.blue,
		trigger:[2],
		fixed:true,
		reward:1,
		remain:6
	},
	Bakery:{
		name:"Bakery",
		cost:1,
		turn:triggers.green,
		trigger:[2,3],
		fixed:true,
		reward:1,
		remain:6
	},
	Cafe:{
		name:"Cafe",
		cost:2,
		turn:triggers.red,
		trigger:[3],
		fixed:false,
		reward_func:rewards.steal1,
		reward:1,
		remain:6
	},
	ConvStore:{
		name:"Convenience Store",
		cost:2,
		turn:triggers.green,
		trigger:[4],
		fixed:true,
		reward:3,
		remain:6
	},
	Forest:{
		name:"Forest",
		cost:3,
		turn:triggers.blue,
		trigger:[5],
		fixed:true,
		reward:6,
		remain:6
	},
	Stadium:{
		name:"Stadium",
		cost:6,
		turn:triggers.purple,
		trigger:[6],
		fixed:false,
		reward_func:rewards.stealAll,
		reward:2,
		remain:6
	},
	TVStation:{
		name:"TV Station",
		cost:7,
		turn:triggers.purple,
		trigger:[6],
		fixed:false,
		reward_func:rewards.steal1,
		reward:6,
		remain:6
	},
	BusinessCenter:{
		name:"Business Center",
		cost:8,
		turn:triggers.purple,
		trigger:[6],
		fixed:false,
		reward_func:rewards.trade1,
		reward:0,
		remain:6
	},
	CheeseFactory:{
		name:"Cheese Factory",
		cost:5,
		turn:triggers.blue,
		trigger:[7],
		fixed:false,
		reward_func:rewards.per_build,
		reward:3,
		remain:6
	}
}

// class Card{
// 	constructor(name,cost){
// 		this.name = name
// 		this.cost = cost
// 	}
// }

// class Establishment extends Card {
// 	constructor(name, cost, turn, roll, basic, reward){
// 		super(name,cost)
// 		this.turn = turn
// 		this.basic = basic
// 		this.roll = roll
// 		this.category = 0
// 		this.reward = reward
// 	}
// }

// class BlueCard extends Card {
// 	constructor(name,cost,roll,reward){
// 		super(name, cost, triggers.blue, roll, true, reward)
// 	}
// }

// class WheatField extends BlueCard {
// 	constructor(){
// 		super('Wheat Field',1,[1],1)
// 		this.category = 1
// 	}
// }

// class Ranch extends BlueCard {
// 	constructor(){
// 		super('Ranch',1,[2],1)
// 		this.category = 1
// 	}
// }

// class Forest extends BlueCard {
// 	constructor(){
// 		super('Forest',3,[5],1)
// 		this.category = 1
// 	}
// }
