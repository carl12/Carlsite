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
	while(i < 200){	
		Game.init();
		i++;
		while(Game.winner === -1){
			
			
			while(!Game.requireInput() && Game.winner == -1){
				Game.next();
				// if (Game.winner != -1){
				// 	print(Game.winner)
				// 	print(Game.players[Game.winner].cards);
				// 	// return true;
				// }
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
		}
		var score = 0;
		for (var j = 0; j < 4; j++){
			if(Game.players[2].landmarks[i]){
				score += 0.25;
				print(score)
				print('blah1')
			}
		}
		print(score);
		if (score > 0){
			print('asdf')
			print('score is ',score)
			print(Game.players[2].income(), ' won by rando');
			print(Game.players[2].strat);
			print(Game.players[2].cards);
		
		}
		// Game.init();
	}
	print('done')
}

runGame();


