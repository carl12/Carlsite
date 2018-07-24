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
	while(!Game.requireInput()){
		Game.next();
	}
	print(Game.turnState)

		
	// Check whether need input from human or ai
		// Human, set up ui prompt and enable listeners
		// If ai, ask for response
	// Validate input and enter into game

	
}

runGame();


