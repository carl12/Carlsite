//Add listeners to images and dice
//Handle listener input
var canvas = document.getElementById('myCanvas');
var canvasLeft = canvas.offsetLeft;
var canvasTop = canvas.offsetTop;



canvas.addEventListener("click", (event)=>{
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;

	var response = manage.checkClick(x,y);
	if(response !== undefined){
		if(Game.players[Game.turnState.playerTurn].isHuman && Game.requireInput){
			var success = f(response);
			if(success){
				manage.disableListeners();
			}
		}
	}

	// print(x,y);
});




Game.init();
manage = new CanvasManager(ctx);
manage.draw();

var me;
var humanInputType; 

function initHumanGame(){

	print('welcome to Machi Koro!');
	var playLoc = randInt(0,3);
	Game.init(true);
	print('you are player '+ playLoc);
	Game.players[playLoc] = new HumanPlayer("Human!");
	me = Game.players[playLoc];
	var k = 0; 

	runHumanGame();
}

function f(response){
	var output = [];
	if(Game.turnState.phase == 0){
		output.rollTwo = response;

	} else if(Game.turnState.phase == 1){
		if(response.length != undefined){
			if(response.length == 2){
				print('rerolling in f')
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
		// print(output);
	}
	if(Game.turnState.phase == 4){
		setTimeout(runHumanGame, 1000);
	} else {
		setTimeout(runHumanGame, 300);
	}
	return Game.next(output);
}

function runHumanGame(){

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
			break;
		}
	}
}

function arrAdd(a, b, plus = 1){
	var c = [];
	var flip = plus ? 1 : -1;
	for(var i = 0; i < a.length; i++)
	{
		c[i] = a[i] + flip * b[i];
	}
	return c;
}

function arrProd(a, b, times=1){
	var c = [];
	var flip = times ? 1: -1;
	for(var i = 0; i < a.length; i++){
		c[i] = a[i] * Math.pow(b[i],flip);
	}
	return c;
}

var pop = [];
var popSize = 200;
var scores = [];
var winners;
var scoreBreakpoint;

var iterations = 1000;
var maxGen = 7;
var currGen = 1;
var maxMetaGen = 5;
var currMetaGen = 1;

var bestScore = [-1];
var bestScoreGene = [];
var bestScoreGen = [];
var bestStratScores = [];

var singleGames = new Array(aiStratList.length).fill(0);
var singleWins = new Array(aiStratList.length).fill(0);
var multiGames = new Array(aiStratList.length).fill(0);
var multiWins = new Array(aiStratList.length).fill(0);

var spotWinner = [0,0,0,0];

function testStrats(tests){
	for(var j = 0; j < tests; j++){
		setTimeout(runRandomStrats);
		if(j % 30000 == 0){
			setTimeout(print, 0, j, ' runs out of ', tests);
		}
	}
	setTimeout(printAiPerformance);
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


function startGenetic(){
	genPopulation();
	runGeneration();	
}

function runGeneration(){
	print('--------------');
	print('GENERATION ', currGen ,' OF ',maxGen);
	print('--------------');
	runGames();
	setTimeout(getWinners);
	setTimeout(nextGeneration);
	setTimeout(outputWinners);
	if(currGen++ < maxGen){
		setTimeout(runGeneration);
	} else {
		if(currMetaGen++ < maxMetaGen){
			currGen = 1;

			setTimeout(genPopulation);
			setTimeout(print,0,'~~~~~~~~~~~~~');
			setTimeout(print,0,'Running Meta Gen ', currMetaGen, ' of ' ,maxMetaGen);
			setTimeout(print,0,'~~~~~~~~~~~~~');
			setTimeout(runGeneration);
			

		} else {
			setTimeout(print,0,'------ All Finished! ------');
			setTimeout(printAiPerformance);
			setTimeout(printFinalist)
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
	alert('done!');
}

function printFinalist(){

	// var total = spotWinner.reduce((a, b) => a + b, 0);
	// var b = nWins.map(x => x / total);


	print('-~-~-~-~-~-~-~');
	print(bestScore);
	print(bestScoreGen);
	print('-~-~-~-~-~-~-~');
	print(JSON.stringify(bestScoreGene[bestScoreGene.length-1]))
	alert('done!');
}

function genPopulation(){
	pop = [];
	var builds = [];
	var doubles;
	var bestScoreGeneCopy = bestScoreGene.slice(0,bestScoreGene.length);
	while(bestScoreGeneCopy.length > 0){
		pop.push(bestScoreGeneCopy.pop());
	}
	for(var i = pop.length - 1; i < popSize; i++){
		builds = genRandomStrat();
		doubles = randInt(0,2);
		pop.push([builds, doubles])
	}
}

function runGames(){
	for(var i = 0; i < pop.length; i++){
		var currGene = pop[i];
		setTimeout(runOneStrat, 0, i);
	}
}

function runOneStrat(i, isRerun = false){

	var score1 = 0;
	var currStrat = pop[i];
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
	if(bestStrat){
		print('best strat scored ', score1);
		bestStratScores.push(score1);
	}
	scores[i] = score1;	
}

function getWinners() {
	winners = [];
	//sort from highest to lowest
	var sortedScores = scores.slice(0,scores.length).sort((a,b)=>b-a);
	var breakpoint = Math.floor(sortedScores.length/5);
	// print('sorted scores' ,sortedScores)

	if(sortedScores[0] > bestScore[bestScore.length-1]){
		bestScore.push(sortedScores[0]);
		bestScoreGene.push(pop[scores.indexOf(sortedScores[0])]);
		bestScoreGen.push([currMetaGen, currGen]);
		var bestScoreLoc = scores.indexOf(sortedScores[0]);
		bestStratScores.push(sortedScores[0]);


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
	
	for(var i = 0; i < scores.length; i++){
		if(scores[i] >= scoreBreakpoint){
			winners.push(i);
		}
	}
	console.log('out of ', pop.length,' strats, we have ', winners.length, ' winners');
	return i;
}

function nextGeneration(){
	var numCopies = popSize/winners.length;
	var newPop = [];

	for(var i = 0; i < winners.length; i++){
		
			var currGene = pop[winners[i]];
			newPop.push(currGene);
			for(var j = 1; i*numCopies + j < Math.floor(numCopies*(i+1)); j++){

				newPop.push([shuffle(currGene[0]),currGene[1]]);

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

