var hardNum = 6;
var easyNum = 3;
var numColors= hardNum;
var colors = [];
var pickedColor;

//Grab items from DOM
var colorSquares = document.querySelectorAll(".colorSquare");
var response = document.querySelector("#response");
var resetButton = document.querySelector("#reset");
var titleColor = document.querySelector(".color");
var titleSection = document.querySelector("h1");
var modeButtons = document.querySelectorAll(".mode");


init();

function init(){
  resetButton.addEventListener("click",reset);
  setupModeButtons();
  setupSquares();
  reset();


}

function setupModeButtons(){
  for(var j = 0; j < modeButtons.length; j++){
    console.log(j)
    modeButtons[j].addEventListener("click",function(){
      modeButtons[0].classList.remove("selected");
      modeButtons[1].classList.remove("selected");
      this.classList.add("selected");
      this.textContent == "Easy" ? numColors = easyNum : numColors=hardNum;
      reset();
    });
  }
}

function setupSquares(){
  for(var i = 0; i < colorSquares.length; i++){
    //Add click listeners for squares
    colorSquares[i].addEventListener("click",function(){
      if(this.style.backgroundColor === pickedColor){
        //Change background and response
        win(pickedColor);
      }else{
        //Remove colored square and change mesage
        this.style.backgroundColor = "";
        response.textContent ="Try Again"
      }
    })
  }
}

function reset(){

  //generte new colors
  colors = generateRandomColors();
  //pick a new color
  pickedColor = colors[pickColor()];

  var i = 0;
  //redraw colors
  for(; i < numColors; i++){
      colorSquares[i].style.backgroundColor = colors[i];
      colorSquares[i].style.display = "block";
    }
    //remove unused color spots
    for(; i < hardNum; i++){
      colorSquares[i].style.display = "none";
    }


    titleColor.textContent = pickedColor;
    response.textContent =""
    titleSection.style.backgroundColor = "";
    resetButton.textContent = "New Colors";
}

//Change colors to match winning color and change relevant text
function win(colorIn){
  for(var i = 0; i < colorSquares.length; i++){
    colorSquares[i].style.backgroundColor = colorIn;
  }
  titleSection.style.backgroundColor = colorIn;
  response.textContent ="Correct!"
  resetButton.textContent = "Play Again?";
}

//Randomly generate location of correct num
function pickColor(){
  return Math.floor(Math.random()*numColors);
}

//Create array of random colors
function generateRandomColors(){
  var colors = [];
  for(var i = 0; i < numColors; i++){
    var red = Math.floor(Math.random()*256);
    var green = Math.floor(Math.random()*256);
    var blue = Math.floor(Math.random()*256);
    colors.push("rgb(" + red + ", " + blue + ", " + green + ")");
  }
  return colors;
}
