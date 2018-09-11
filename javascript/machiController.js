//Add listeners to images and dice
//Handle listener input

var canvas = document.getElementById('myCanvas');
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


canvas.addEventListener("click", (event)=>{
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;

	var response = manage.checkClick(x,y);
	if(!Game.initRun){
		return;
	}
	else if(response !== undefined){
		if(Game.players[Game.turnState.playerTurn].isHuman && Game.requireInput){
			
			var success = f(response);
			if(success){
			if(Game.lastBought != null){
				manage.animateBuy(Game.turnState.playerTurn, Game.lastBought)
			}
				manage.disableListeners();
			}
		}
	}

	// print(x,y);
});

var callQueue = [];
var popInTimeout = false;
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
		setTimeout(delayedCall, info[1], info[0], info[2]);
	}
}

function delayedCall(func, args){

	func(...args);
	if(callQueue.length > 0){
		setTimeout(popCallQueue);
	} else {
		popInTimeout = false;
	}
}


// Game.init();

var manage = new GameCanvasManager(window, canvas, outputBox);
// manage.game = Game;
manage.draw();

var geneticManager = new GeneticViewManager();

var me;
var humanInputType; 

function returnHumanGameMaker(numPlayers){
	return ()=>{initHumanGame(numPlayers)};
}


function initHumanGame(numPlayers = 4, position = undefined){
	print('Welcome to Machi Koro!');
	var playLoc;
	if(position === undefined){
		playLoc = randInt(0,numPlayers);
	} else {
		playLoc = position;
	}
	Game.init(numPlayers, true);
	print('you are player '+ playLoc);
	print('asdf')
	Game.players[playLoc] = new HumanPlayer("Human Player!");
	me = Game.players[playLoc];
	manage.game = Game;


	manage.disableListeners();
	manage.setDimensions();

	addToCallQueue(runHumanGame);
}

function f(response){
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
		addToCallQueue(runHumanGame, 1000);
	} else {
		addToCallQueue(runHumanGame, 300);
	}
	return Game.next(output);
}

function runHumanGame(){

	if(Game.winner === -1){
		manage.draw()
		if(!Game.requireInput()){
			Game.next();
		} else {
			inputType = Game.getInputType();
			if(!Game.players[Game.turnState.playerTurn].isHuman){	
				var response;
				response = inputType.player.takeInput(inputType);
				Game.next(response);
			} else {
				manage.takeHumanInput(inputType);
				humanInputType = inputType;
				manage.draw();
				if(Game.turnState.phase == 4){
					print('You have $'+me.money);
				}
				return;
			}

			if(Game.lastBought != null){
				manage.animateBuy(Game.turnState.playerTurn, Game.lastBought)
			}
		}
		manage.draw()
		addToCallQueue(runHumanGame, 1000)
	} 
}

var pop = [];
var popSize = 100;
var scores = [];
var winners;
var scoreBreakpoint;

var breakpointRatio = 0.2;
var mutationRate = 0.01;
var metaGenTransfer = 0;
var singleBothOrDoubles = 1;

var iterations = 100;
var maxGen = 3;
var currGen = 1;
var maxMetaGen = 2;
var currMetaGen = 1;

var bestScore = [];
var bestScoreGene = [];
var bestScoreGen = [];
var bestStratScores = [];
var numBest = 10;
var useView = true;

var singleGames = new Array(aiStratList.length).fill(0);
var singleWins = new Array(aiStratList.length).fill(0);
var multiGames = new Array(aiStratList.length).fill(0);
var multiWins = new Array(aiStratList.length).fill(0);

var spotWinner = [0,0,0,0];

function switchOnGraphs(){
	manage.disableGameSpan();
	geneticManager.startGeneticView();
	geneticManager.toggleMenu();
}

function testStrats(tests = 10000){
	for(var j = 0; j < tests; j++){
		addToCallQueue(runRandomStrats);
		if(j % 30000 == 0){
			addToCallQueue(print, 0, j, ' runs out of ', tests);
		}
	}
	addToCallQueue(printAiPerformance);
}

function runRandomStrats(){
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
	spotWinner[Game.winner]+= 1;

	var aiCount = new Array(aiStratList.length).fill(0);
	var winningAi = -1;
	for(var k = 0; k < Game.players.length; k++){
		p = Game.players[k];
		
		aiCount[p.aiChoice]++;
		if(Game.winner == k){
			var winningAi = p.aiChoice;
			spotWinner[k] ++;
		}
		 
	}
	// print(aiCount);
	for(var k = 0; k < aiCount.length; k++){
		if(aiCount[k] > 1){
			multiGames[k] ++;
			if(k == winningAi){
				multiWins[k] ++;
			}
		} else if(aiCount[k] > 0){
			singleGames[k]++;
			if(k == winningAi){
				singleWins[k]++;
			}
		}
	}
}

function startGeneticParam(popSizeIn = 200, breakpointRatioIn = 0.2, mutationRateIn = 0.01, 
	metaGenTransferIn = 0, singleBothOrDoublesIn = 1, iterationsIn = 1000, maxGenIn = 8, 
	maxMetaGenIn = 8, numBestIn = 10, useViewIn = true){

	popSize = popSizeIn;
	breakpointRatio = breakpointRatioIn;
	mutationRate = mutationRateIn;
	metaGenTransfer = metaGenTransferIn;
	singleBothOrDoubles = singleBothOrDoublesIn;

	iterations = iterationsIn;
	maxGen = maxGenIn;
	maxMetaGen = maxMetaGenIn;
	numBest = numBestIn;
	useView = useViewIn;

	startGenetic();
}

function startGenetic(){
	if(useView){
		switchOnGraphs();
	}
	genPopulation();
	runGeneration();	
}

function runGeneration(){
	print('--------------');
	print('GENERATION ', currGen ,' of ',maxGen);
	print('--------------');
	runGames();
	addToCallQueue(getWinners);
	addToCallQueue(nextGeneration);
	addToCallQueue(outputWinners);
	if(currGen < maxGen){
		addToCallQueue(()=>currGen++);
		addToCallQueue(runGeneration, 6000);
	} else {
		if(currMetaGen < maxMetaGen){

			addToCallQueue(()=>{currGen=1;currMetaGen++;});
			addToCallQueue(genPopulation);
			addToCallQueue(print,0,'~~~~~~~~~~~~~');
			addToCallQueue(print,0,'Running Meta Gen ', currMetaGen, ' of ' ,maxMetaGen);
			addToCallQueue(print,0,'~~~~~~~~~~~~~');
			addToCallQueue(runGeneration, 6000);
			

		} else {
			addToCallQueue(print,0,'------ All Finished! ------');
			addToCallQueue(printAiPerformance);
			addToCallQueue(printFinalist)
			addToCallQueue(alert, 0, 'done');
		}
	}
}

function printAiPerformance(){
	var singleWinrate = [];
	var multiWinrate = [];
	for(var i = 0; i < aiStratList.length; i++){
		singleWinrate[i] = singleWins[i]/singleGames[i];
		multiWinrate[i] = multiWins[i]/multiGames[i];
	}
	print('------------');
	print(singleWinrate);
	// print(multiWinrate);
}

function printPop(pop){
	for(var i = 0; i < pop.length; i++){
		print(JSON.stringify(pop[i]));
	}
}

function printFinalist(){

	// var total = spotWinner.reduce((a, b) => a + b, 0);
	// var b = nWins.map(x => x / total);


	print('-~-~-~-~-~-~-~');
	print(bestScore);
	print(bestScoreGen);
	print('-~-~-~-~-~-~-~');
	printPop(bestScoreGene);
}

function genPopulation(){
	pop = [];
	var builds = [];
	var doubles;
	for(var i = 0; i < metaGenTransfer && i < bestScoreGene.length; i++){
		pop.push(bestScoreGene[i]);
	}

	// while(bestScoreGeneCopy.length > 0){
	// 	pop.push(bestScoreGeneCopy.pop());
	// }
	for(var i = pop.length - 1; i < popSize; i++){
		builds = genRandomStrat();

		if(singleBothOrDoubles == 0){
			doubles = 0;
		} else if (singleBothOrDoubles == 1){
			doubles = randInt(0,2);
		} else {
			doubles = 1;
		}
		pop.push([builds, doubles])
	}
	if(useView){
		geneticManager.clearScores();
	}
}

function runGames(){
	for(var i = 0; i < pop.length; i++){
		var currGene = pop[i];
		addToCallQueue(runOneStrat, 0, i);
	}
}

function runOneStrat(stratLoc, isRerun = false){
	print('.');
	var score1 = 0;
	var currStrat = pop[stratLoc];
	var bestStrat = false;
	var playLoc;

	if(currStrat == bestScoreGene[bestScoreGene.length-1]){
		bestStrat =true;
	}
	for(var j = 0; j < iterations; j++){

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
		spotWinner[Game.winner]+= 1;

		var aiCount = new Array(aiStratList.length).fill(0);
		var winningAi = -1;
		for(var k = 0; k < Game.players.length; k++){
			p = Game.players[k];
			if(k !== playLoc){
				aiCount[p.aiChoice]++;
				if(Game.winner == k){
					var winningAi = p.aiChoice;
					spotWinner[k] ++;
				}
			} else {
				if(Game.winner == k){
					score1++;
					spotWinner[k] ++;
				}
			}
		}
		// print(aiCount);
		for(var k = 0; k < aiCount.length; k++){
			if(aiCount[k] > 1){
				multiGames[k] ++;
				if(k == winningAi){
					multiWins[k] ++;
				}
			} else if(aiCount[k] > 0){
				singleGames[k]++;
				if(k == winningAi){
					singleWins[k]++;
				}
			}
		}


	}
	if(bestScore.length < numBest || score1 > bestScore[bestScore.length-1]){
		var insert = bestScore.length;
		var string = JSON.stringify(currStrat);
		var sameStratLoc = bestScore.length;
		for(var j = bestScore.length-1; j >= 0; j--){
			if(bestScore[j] < score1){
				insert--;
			}
			if(string === JSON.stringify(bestScoreGene[j])){
				sameStratLoc = j;
			}
		}


		if(insert <= sameStratLoc){
			
			if(sameStratLoc === bestScore.length){	
				if(bestScore.length > numBest){
					bestScore.pop();
					bestScoreGene.pop();
					bestScoreGen.pop();
				}	
			} else {

				print('Found strat with score '+score1);
				print(bestScore);
				print(sameStratLoc,"is location of neighbor strat");

				bestScore.splice(sameStratLoc,1)
				bestScoreGene.splice(sameStratLoc,1)
				bestScoreGen.splice(sameStratLoc,1)
			}
			bestScore.splice(insert, 0, score1);
			bestScoreGene.splice(insert, 0, currStrat);
			bestScoreGen.splice(insert, 0, [currMetaGen, currGen]);
			
			print(bestScore);
		} else {
			print('Higher score done by same strat')
			print(bestScore);
			print(score1);
		}
		
			
		
	}
	scores[stratLoc] = score1;	
	if(useView){
		geneticManager.submitNewScore(score1, stratLoc);
	}
}

function getWinners() {
	winners = [];
	//sort from highest to lowest
	var sortedScores = scores.slice(0,scores.length).sort((a,b)=>b-a);
	var breakpoint = Math.floor(sortedScores.length * breakpointRatio);
	// print('sorted scores' ,sortedScores)

	if(sortedScores[0] >= bestScore[0]){
		//bestScore.push(sortedScores[0]);
		//bestScoreGene.push(pop[scores.indexOf(sortedScores[0])]);
		// bestScoreGen.push([currMetaGen, currGen]);
		var bestScoreLoc = scores.indexOf(sortedScores[0]);
		// bestStratScores.push(sortedScores[0]);


		print('New record! ', sortedScores[0]);
		runOneStrat(bestScoreLoc, true);
		print('Record setting gene: ', bestScoreGene);
	}

	var i = breakpoint;
	while(sortedScores[i] < 1){
		i--;
	}
	scoreBreakpoint = sortedScores[i];
	// print(scoreBreakpoint, ' is score breakpoint');
	print('breakpoint for going forward is ', scoreBreakpoint)
	print(JSON.stringify(sortedScores));
	
	for(var i = 0; i < scores.length; i++){
		if(scores[i] >= scoreBreakpoint){
			winners.push(i);
		}
	}
	console.log('out of ', pop.length,' strats, we have ', winners.length, ' winners');
	if(useView){
		geneticManager.endTesting(scoreBreakpoint, [currMetaGen, currGen]);
	}
	return i;
}

function nextGeneration(){
	var numCopies = popSize/winners.length;
	var newPop = [];

	for(var i = 0; i < winners.length; i++){
		
			var currGene = pop[winners[i]];
			if(currGene[0] === undefined){
				print(currGene);
			}
			newPop.push(currGene);
			for(var j = 1; i*numCopies + j < Math.floor(numCopies*(i+1)); j++){

				newPop.push(mutateGene([shuffle(currGene[0]),currGene[1]]));

		}
	}
	print(newPop.length)
	if(newPop.length !== popSize){
		print(winners.length)
		print(numCopies)
		print(winners.length * numCopies)
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
		print('~+~+~+~+~+~+~+~+~+~+~+~++~+~')
	}
	pop = newPop;
	// print('we made a new pop with ', pop.length, ' which should be the same as ', popSize);	
}

function mutateGene(gene){
	var pre = JSON.parse(JSON.stringify(gene));
	var mutate = false;
	for(var i = 0; i < gene[0].length; i++){
		for(var j = 0; j < 2; j++){
			var curr = gene[0][i][j];
			var rndNum = Math.random();
			if(gene[0][i][0] < 15 && rndNum < mutationRate){
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
}



function outputWinners(){

	// print('scores are ', scores);
	// print('Population is ', pop);
	// print('breakpoint is ', scoreBreakpoint);
}

canvas.addEventListener('mouseover', function(e) {
	manage.draw();

});

// Enter either

// initHumanGame();
// startGenetic();
// testStrats();

