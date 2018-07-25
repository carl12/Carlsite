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
	while(!Game.requireInput() ){
		Game.next();
		if (Game.winner != -1){
			print(Game.winner)
			print(Game.players[Game.winner].cards);
			return true;
		}
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
	if(result){
		manage.draw();
		setTimeout(runGame,100);
	} else {
		print(i , ' is i')
		print('had a problem')

	}

		
	// Check whether need input from human or ai
		// Human, set up ui prompt and enable listeners
		// If ai, ask for response
	// Validate input and enter into game

	
}

runGame();


