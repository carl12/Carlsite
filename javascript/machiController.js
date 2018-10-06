//Add listeners to images and dice
//Handle listener input

var canvas = document.getElementById('mainCanvas');
var outputBox = document.getElementById('outputText');

var canvasLeft = canvas.offsetLeft;
var canvasTop = canvas.offsetTop;
window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};
var callQueue = [];
var popInTimeout = false;
var pausedTimeout = false;
var currQueuedCall = 0;

g = {
	pop:[],
	popSize:100,
	scores:[],
	sortedScores:[],
	winners:[],
	scoreBreakpoint:0,

	breakpointRatio:0.2,
	mutationRate:0.01,
	metaGenTransfer:0,
	singleBothOrDoubles:1,

	iterations:100,
	maxGen:3,
	currGen:1,
	maxMetaGen:2,
	currMetaGen:1,

	bestScore:[],
	bestScoreGene:[],
	bestScoreGen:[],
	bestStratScores:[],
	numBest:10,
	useView:true,

	singleGames:new Array(aiStratList.length).fill(0),
	singleWins:new Array(aiStratList.length).fill(0),
	multiGames:new Array(aiStratList.length).fill(0),
	multiWins:new Array(aiStratList.length).fill(0),
	spotWinner: [0,0,0,0],


	startGeneticParam:function(popSizeIn = 200, breakpointRatioIn = 0.2, mutationRateIn = 0.03,
		metaGenTransferIn = 0, singleBothOrDoublesIn = 2, iterationsIn = 300, maxGenIn = 8,
		maxMetaGenIn = 8, numBestIn = 10, useViewIn = true){

		this.popSize = popSizeIn;
		this.breakPointRation = breakpointRatioIn;
		this.mutationRate = mutationRateIn;
		this.metaGenTransfer = metaGenTransferIn;
		this.singleBothOrDoubles = singleBothOrDoublesIn;

		this.iterations = iterationsIn;
		this.maxGen = maxGenIn;
		this.maxMetaGen = maxMetaGenIn;
		this.numBest = numBestIn;
		this.useView = useViewIn;


		this.startGenetic();
	},

	startGenetic:function(){
		viewManage.openGenetic();
		this.genView = viewManage.geneticManager;

		if(this.useView){
			viewManage.openGenetic();

		}
		this.genPopulation();
		this.runGeneration();
	},

	runGeneration:function(){
		print('--------------');
		print('GENERATION ', this.currGen ,' of ',this.maxGen);
		print('--------------');
		this.runGames();
		geneticBindCall(this.getWinners);
		geneticBindCall(this.nextGeneration);
		geneticBindCall(this.outputWinners);
		if(this.currGen < this.maxGen){
			geneticBindCall(()=>this.currGen++);
			geneticBindCall(this.runGeneration, 1000);
		} else {
			if(this.currMetaGen < this.maxMetaGen){

				geneticBindCall(()=>{this.currGen=1;this.currMetaGen++;});
				geneticBindCall(this.genPopulation);
				geneticBindCall(print,0,'~~~~~~~~~~~~~');
				geneticBindCall(print,0,'Running Meta Gen ', this.currMetaGen, ' of ' ,this.maxMetaGen);
				geneticBindCall(print,0,'~~~~~~~~~~~~~');
				geneticBindCall(this.runGeneration, 1000);


			} else {
				geneticBindCall(print,0,'------ All Finished! ------');
				geneticBindCall(this.printAiPerformance);
				geneticBindCall(this.printFinalist)
				geneticBindCall(alert.bind(window), 0, 'done');
			}
		}
	},

	printAiPerformance:function(){
		var singleWinrate = [];
		var multiWinrate = [];
		for(var i = 0; i < aiStratList.length; i++){
			singleWinrate[i] = this.singleWins[i]/this.singleGames[i];
			multiWinrate[i] = this.multiWins[i]/this.multiGames[i];
		}
		print('------------');
		print(singleWinrate);
		// print(multiWinrate);
	},

	printPop:function(pop){
		for(var i = 0; i < pop.length; i++){
			print(JSON.stringify(pop[i]));
		}
	},

	printFinalist:function(){

		// var total = spotWinner.reduce((a, b) => a + b, 0);
		// var b = nWins.map(x => x / total);


		print('-~-~-~-~-~-~-~');
		print(this.bestScore);
		print(this.bestScoreGen);
		print('-~-~-~-~-~-~-~');
		this.printPop(this.bestScoreGene);
	},

	genPopulation:function(){
		this.pop = [];
		var builds = [];
		var doubles;
		for(var i = 0; i < this.metaGenTransfer && i < this.bestScoreGene.length; i++){
			this.pop.push(this.bestScoreGene[i]);
		}

		// while(bestScoreGeneCopy.length > 0){
		// 	pop.push(bestScoreGeneCopy.pop());
		// }
		for(var i = this.pop.length - 1; i < this.popSize; i++){
			this.pop.push(this.genRandomStrat());
		}
	},

	genRandomStrat(){
		var builds = genRandomBuildPriority();
		var doubles;
		if(this.singleBothOrDoubles == 0){
			doubles = 0;
		} else if (this.singleBothOrDoubles == 1){
			doubles = randInt(0,2);
		} else {
			doubles = 1;
		}
		return [builds, doubles];
	},

	runGames:function(){
		for(var i = 0; i < this.pop.length; i++){
			var currGene = this.pop[i];
			geneticBindCall(this.runOneStrat, 0, i);
		}
	},

	runOneStrat:function(stratLoc, isRerun = false){
		print('.');
		var score1 = 0;
		var currStrat = this.pop[stratLoc];
		var bestStrat = false;
		var playLoc;

		if(currStrat == this.bestScoreGene[this.bestScoreGene.length-1]){
			bestStrat =true;
		}
		for(var j = 0; j < this.iterations; j++){

			Game.init();
			playLoc = randInt(0,4);
			Game.players[playLoc].strat = currStrat[0];
			Game.players[playLoc].doubles = currStrat[1];
			Game.players[playLoc].aiChoice = -1;
			var k = 0;
			while(Game.winner === -1 && k < 1000){
				k++;
				while(!Game.requireInput() && Game.winner == -1){
					Game.next();
				}
				if(Game.winner != -1) {
					break;
				}
				inputType = Game.getInputType();
				var response;
				response = inputType.player.takeInput(inputType);
				Game.next(response);
			}
			let p;
			this.spotWinner[Game.winner]+= 1;

			var aiCount = new Array(aiStratList.length).fill(0);
			var winningAi = -1;
			for(var k = 0; k < Game.players.length; k++){
				p = Game.players[k];
				if(k !== playLoc){
					aiCount[p.aiChoice]++;
					if(Game.winner == k){
						var winningAi = p.aiChoice;
						this.spotWinner[k] ++;
					}
				} else {
					if(Game.winner == k){
						score1++;
						this.spotWinner[k] ++;
					}
				}
			}
			// print(aiCount);
			for(var k = 0; k < aiCount.length; k++){
				if(aiCount[k] > 1){
					this.multiGames[k] ++;
					if(k == winningAi){
						this.multiWins[k] ++;
					}
				} else if(aiCount[k] > 0){
					this.singleGames[k]++;
					if(k == winningAi){
						this.singleWins[k]++;
					}
				}
			}


		}
		if(this.bestScore.length < this.numBest || score1 > this.bestScore[this.bestScore.length-1]){
			var insert = this.bestScore.length;
			var string = JSON.stringify(currStrat);
			var sameStratLoc = this.bestScore.length;
			for(var j = this.bestScore.length-1; j >= 0; j--){
				if(this.bestScore[j] < score1){
					insert--;
				}
				if(string === JSON.stringify(this.bestScoreGene[j])){
					sameStratLoc = j;
				}
			}


			if(insert <= sameStratLoc){

				if(sameStratLoc === this.bestScore.length){
					if(this.bestScore.length > this.numBest){
						this.bestScore.pop();
						this.bestScoreGene.pop();
						this.bestScoreGen.pop();
					}
				} else {

					print('Found strat with score '+score1);
					print(this.bestScore);
					print(sameStratLoc,"is location of neighbor strat");

					this.bestScore.splice(sameStratLoc,1)
					this.bestScoreGene.splice(sameStratLoc,1)
					this.bestScoreGen.splice(sameStratLoc,1)
				}
				this.bestScore.splice(insert, 0, score1);
				this.bestScoreGene.splice(insert, 0, currStrat);
				this.bestScoreGen.splice(insert, 0, [this.currMetaGen, this.currGen]);

				print(this.bestScore);
			} else {
				print('Higher score done by same strat')
				print(this.bestScore);
				print(score1);
			}



		}
		if(!isRerun){
			this.scores[stratLoc] = score1;
		}
		if(this.useView){
			this.genView.submitNewScore(score1, stratLoc);
			this.genView.draw(this, stratLoc);
		}
	},

	getWinners:function() {
		this.winners = [];
		//sort from highest to lowest
		this.sortedScores = this.scores.slice(0,this.scores.length).sort((a,b)=>b-a);
		var breakpoint = Math.floor(this.sortedScores.length * this.breakPointRation);

		if(this.sortedScores[0] >= this.bestScore[0]){
			var bestScoreLoc = this.scores.indexOf(this.sortedScores[0]);


			print('New record! ', this.sortedScores[0]);
			this.runOneStrat(bestScoreLoc, true);
			print('Record setting gene: ', this.bestScoreGene);
		}

		var i = breakpoint;
		while(this.sortedScores[i] < 1 && i >= 0){
			i--;
		}
		if(i < 0){ //special case if no wins occured
			this.scoreBreakpoint = 1;
		} else {
			this.scoreBreakpoint = this.sortedScores[i];
		}
		print('breakpoint for going forward is ', this.scoreBreakpoint)
		print(JSON.stringify(this.sortedScores));

		for(var i = 0; i < this.scores.length; i++){
			if(this.scores[i] >= this.scoreBreakpoint){
				this.winners.push(i);
				print('asdf')
			}
		}
		console.log('out of ', this.pop.length,' strats, we have ', this.winners.length, ' winners');
		if(this.useView){
			this.genView.endTesting(this.scoreBreakpoint, [this.currMetaGen, this.currGen]);
		}
		return i;
	},

	nextGeneration:function(){
		if(this.winners.length == 0){
			print('No winners, generating new population');
			this.genPopulation();
			return;
		}
		var numCopies = Math.floor(this.popSize/this.winners.length);
		var newPop = [];

		for(var i = 0; i < this.winners.length; i++){

				var currGene = this.pop[this.winners[i]];
				if(currGene[0] === undefined){
					print(currGene);
				}
				newPop.push(currGene);
				for(var j = 1; i*numCopies + j < Math.floor(numCopies*(i+1)); j++){

					newPop.push(this.mutateGene([shuffle(currGene[0]),currGene[1]]));

			}
		}
		while(newPop.length < this.popSize){
			newPop.push(this.genRandomStrat());
		}
		print(newPop.length)
		if(newPop.length !== this.popSize){
			print(this.winners.length)
			print(numCopies)
			print(this.winners.length * numCopies)
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
			print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		}
		this.pop = newPop;
		this.scores = [];
		// print('we made a new pop with ', pop.length, ' which should be the same as ', popSize);
	},

	mutateGene:function(gene){
		var pre = JSON.parse(JSON.stringify(gene));
		var mutate = false;
		for(var i = 0; i < gene[0].length; i++){
			for(var j = 0; j < 2; j++){
				var curr = gene[0][i][j];
				var rndNum = Math.random();
				if(gene[0][i][0] < 15 && rndNum < this.mutationRate){
					mutate = true;
					var pre1 = gene[0][i][j];
					if(j == 0){
						gene[0][i][j] = randIntTwoRange(0,7,9,15);
					}
					else{
						gene[0][i][j] = randInt(0,6);
					}
					print('mutated', i , j , pre1, gene[0][i][j]);
				}
			}
		}

		return gene;
	},

	outputWinners:function(){

		// print('scores are ', scores);
		// print('Population is ', pop);
		// print('breakpoint is ', scoreBreakpoint);
	},

	testStrats:function(tests = 1000, view = false){
		viewManage.openAiTest();
		for(var j = 0; j < tests; j++){
			geneticBindCall(this.runRandomStrats);
			if(view && j%100 == 0){
				addToCallQueue(viewManage.currManage.inputData.bind(viewManage.currManage), 0, this, j);
			}
			if(j % 3000 == 0){
				geneticBindCall(print, 0, j, ' runs out of ', tests);
			}
		}
		geneticBindCall(this.printAiPerformance);
	},

	runRandomStrats:function(){

		Game.init();
		var k = 0;
		while(Game.winner === -1 && k < 1000){
			k++;
			while(!Game.requireInput() && Game.winner == -1){
				Game.next();
			}
			if(Game.winner != -1) {
				break;
			}
			inputType = Game.getInputType();
			var response;
			response = inputType.player.takeInput(inputType);
			Game.next(response);
		}
		let p;
		this.spotWinner[Game.winner]+= 1;

		var aiCount = new Array(aiStratList.length).fill(0);
		var winningAi = -1;
		for(var k = 0; k < Game.players.length; k++){
			p = Game.players[k];

			aiCount[p.aiChoice]++;
			if(Game.winner == k){
				var winningAi = p.aiChoice;
				this.spotWinner[k] ++;
			}

		}
		// print(aiCount);
		for(var k = 0; k < aiCount.length; k++){
			if(aiCount[k] > 1){
				this.multiGames[k] ++;
				if(k == winningAi){
					this.multiWins[k] ++;
				}
			} else if(aiCount[k] > 0){
				this.singleGames[k]++;
				if(k == winningAi){
					this.singleWins[k]++;
				}
			}
		}
	},
}

hum = {
	humanInputType:{},

	initHumanGame:function(numPlayers = 4, position = undefined){
		this.gameView = viewManage.manage;
		print('Welcome to Machi Koro!');
		var playLoc;
		if(position === undefined){
			playLoc = randInt(0,numPlayers);
		} else {
			playLoc = position;
		}
		Game.init(numPlayers, true);
		print('you are player '+ playLoc);
		this.me = Game.setPlayerAsHuman(playLoc, "Human Player!");
		this.gameView.game = Game;

		this.gameView.disableListeners();
		this.gameView.setDimensions();
		viewManage.openGame();

		humanBindCall(this.runHumanGame);
	},

	f:function(response){
		var output = [];
		if(Game.turnState.phase == 0){
			output.rollTwo = response;

		} else if(Game.turnState.phase == 1){
			if(response.length != undefined){
				if(response.length == 2){
					output.reroll = response[0];
					output.rollTwo = response[1];
				}
			}
		} else if (Game.turnState.phase == 3) {
			if(response.length != undefined){
				if(humanInputType.card == 7){
					if(response.length == 3){
						output.targetPlayer = response[0];
						output.targetBuilding = response[1];
						output.myBuilding = response[2];
					}
				}else {
					// TODO - finish this
					output.targetPlayer = response;
				}

			}
		} else if(Game.turnState.phase == 4) {

			if (response !== -1){
				output.card = indexedCards[response];
			}
		}
		if(Game.turnState.phase == 4){
			humanBindCall(this.runHumanGame, 1000);
		} else {
			humanBindCall(this.runHumanGame, 300);
		}

		return Game.next(output);
	},

	runHumanGame:function(){

		if(Game.winner === -1){
			this.gameView.draw()
			if(!Game.requireInput()){
				Game.next();
			} else {
				var inputType = Game.getInputType();
				if(!Game.players[Game.turnState.playerTurn].isHuman){
					var response;
					response = inputType.player.takeInput(inputType);
					Game.next(response);
				} else {
					this.gameView.takeHumanInput(inputType);
					this.humanInputType = inputType;
					this.gameView.draw();
					if(Game.turnState.phase == 4){
						print('You have $'+this.me.money);
					}
					return;
				}

				if(Game.lastBought != null){
					this.gameView.animateBuy(Game.turnState.playerTurn, Game.lastBought)
				}
			}
			this.gameView.draw()
			humanBindCall(this.runHumanGame, 1000)
		}
	},

	quitHumanGame:function(){
		this.humanInputType = {};
		this.me = undefined;
		clearCallQueue();
		viewState.openMenu();

	},
}

var viewManage = new MachiViewsManager(window, canvas, outputBox, g);
var V_STATES = viewManage.STATE_NAMES;
// var menuManager = new MenuViewManager(window, canvas, outputBox);
// var manage = new GameViewManager(window, canvas, outputBox);
// var geneticManager = new GeneticViewManager(g);

canvas.addEventListener("click", (event)=>{
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;
	viewManage.canvasClicked(x, y, event);
});

function geneticBindCall(func, timeout, ...args){
	addToCallQueue(func.bind(g), timeout, ...args);
}

function humanBindCall(func, timeout, ...args){
	addToCallQueue(func.bind(hum), timeout, ...args);
}

function addToCallQueue(func, timeout = 0, ...args){
	callQueue.push([func, timeout, args]);
	if(!popInTimeout){
		setTimeout(popCallQueue);
		popInTimeout = true;
	}
}

function popCallQueue(){
	if(callQueue.length > 0){
		info = callQueue.splice(0,1)[0];
		currQueuedCall = setTimeout(delayedCall, info[1], info[0], info[2]);
	}
}

function delayedCall(func, args){
	if(!pausedTimeout){
		func(...args);
		if(callQueue.length > 0){
			currQueuedCall = setTimeout(popCallQueue);
		} else {
			popInTimeout = false;
		}
	} else {
		currQueuedCall = setTimeout(delayedCall, 20, func, args);
	}
}

function clearCallQueue(){
	clearTimeout(currQueuedCall);
	callQueue = [];
}

// var me;
// var humanInputType;

function returnHumanGameMaker(numPlayers){
	return ()=>{
		hum.initHumanGame(numPlayers);
	};
}






canvas.addEventListener('mouseover', function(e) {
	viewManage.draw();
	// if(viewState === V_STATES.MAIN_MENU_STATE){
	// 	menuManager.draw();
	// } else if(viewState === V_STATES.HUMAN_GAME_STATE){
	// 	manage.draw();
	// }
});
