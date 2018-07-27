//Add listeners to images and dice
//Handle listener input
var canvas = document.getElementById('myCanvas');
var canvasLeft = canvas.offsetLeft;
var canvasTop = canvas.offsetTop;



canvas.addEventListener("click", (event)=>{
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;

	var imgClicked = manage.checkImageClicked(x,y);
	print(imgClicked)
	print(x,y);
});




Game.init();
manage = new CanvasManager(ctx);
manage.draw();

function runGame(){
	var i =0;
	while(i < 1000){	
		Game.init();
		i++;
		while(Game.winner === -1){
			
			
			while(!Game.requireInput() && Game.winner == -1){
				Game.next();
			}
			if(Game.winner != -1){
				break;
			}
			inputType = Game.getInputType();
			var response;
			if (inputType.player.isHuman) {
				//Enable listeners to receive input
				//Enter message to prompt for input
			} else { 
				// Submit request to ai
				response = inputType.player.takeInput(inputType);
			}
			result = Game.next(response);
			// manage.draw();
		}
		// var score = 0;
		
		// print(Game.winner);
		if (Game.winner == 2){
			print(Game.players[2].income(), ' won by rando');
			print(Game.players[2].strat);
			print(Game.players[2].cards);
			print('-------');
		
		}
		// Game.init();
	}
	print('done')
}

var pop = [];
var popSize = 150;
var scores = [];
var winners;
var scoreBreakpoint;

var iterations = 1000;
var maxGen = 5;
var currGen = 1;
var currMetaGen = 1;
var maxMetaGen = 4;

var bestScore = [-1];
var bestScoreGene = [];
var bestScoreGen = [];
var bestStratScores = [];

var spotWinner = [0, 0, 0, 0];





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
			setTimeout(runGeneration);
			setTimeout(print,0,'~~~~~~~~~~~~~');
			setTimeout(print,0,'Running Meta Gen ', currMetaGen, ' of ' ,maxMetaGen);
			setTimeout(print,0,'~~~~~~~~~~~~~');
			

		} else {
			setTimeout(print,0,'------ All Finished! ------');
			setTimeout(printFinalist)
		}
	}

}
function startGenetic(){
	genPopulation();
	runGeneration();
	
}

function printFinalist(){

	var total = spotWinner.reduce((a, b) => a + b, 0);
	var b = spotWinner.map(x => x / total);

	print('------------');
	print(spotWinner);
	print(b);
	print('-~-~-~-~-~-~-~');
	print(bestScore);
	print(bestScoreGen);
	print('-~-~-~-~-~-~-~');
	print(JSON.stringify(bestScoreGene[bestScoreGene.length-1]))
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
	for(var i = 0; i < popSize; i++){
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
		Game.players[playLoc].doubles = currStrat[0];
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
		
		spotWinner[Game.winner]+= 1;
		for(var k = 0; k < Game.players.length; k++){
			let p = Game.players[k];
			if(Game.winner === k){
				if(k === playLoc){
					score1 += 1;
				} else {
					numAiWins[p.aiChoice] ++;
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
	var breakpoint = sortedScores.length/5;
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
	// print('breakpoint for going forward is ', scoreBreakpoint)
	for(var i = 0; i < scores.length; i++){
		if(scores[i] >= scoreBreakpoint){
			winners.push(i);
		}
	}
	console.log('out of ',pop.length,' strats, we have ', winners.length, ' winners');
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


startGenetic();


