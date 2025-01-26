let canvasLength = 1280;
let canvasWidth = 720;
let topBarWidth = 100;


let helpTextStatus = false;
let helpText;
let helpButtonX = 0;
let helpButtonY = 0;
let helpButtonWidth = 20;
let helpButtonLength = 50;

let colourButtonStatus = false;
let colourRButton;
let colourGButton;
let colourBButton;
let colourKButton;
let colourButtonX = 0;
let colourButtonY = 20;
let colourButtonWidth = 20;
let colourButtonLength = 100;
let colourButtonSmall = 60;

let clearButtonX = 0;
let clearButtonY = 80;
let clearButtonWidth = 20;
let clearButtonLength = 50;

let backgroundR = 255;
let backgroundG = 255;
let backgroundB = 255;

let lineR = 0;
let lineG = 0;
let lineB = 0;

function setup() {
  
  createCanvas(canvasLength, canvasWidth);
  background(backgroundR,backgroundG,backgroundB);
  
  // setup the menu bar
  stroke(255-backgroundR, 255-backgroundG, 255-backgroundB);
  line(0, topBarWidth, canvasLength, topBarWidth);
  
  // setup help button
  let helpButton = createButton("help");
  helpButton.position(helpButtonX, helpButtonY);
  helpButton.mousePressed(helpButtonFunction);
  helpButton.size(helpButtonLength, helpButtonWidth);
  
  // setup colour button
  let colourButton = createButton("brush colour");
  colourButton.position(colourButtonX, colourButtonY);
  colourButton.mousePressed(colourButtonFunction);
  colourButton.size(colourButtonLength, colourButtonWidth);
  
  // setup clear button
  let clearButton = createButton("clear");
  clearButton.position(clearButtonX, clearButtonY);
  clearButton.mousePressed(setup);
  clearButton.size(clearButtonLength, clearButtonWidth);
}

function draw() {
  if(!keyIsPressed && mouseIsPressed && mouseButton==LEFT && mouseY>topBarWidth && pmouseY>topBarWidth){
    stroke(lineR, lineG, lineB);
    line(pmouseX, pmouseY, mouseX, mouseY)
  }else if(mouseIsPressed && mouseButton==LEFT && keyIsPressed && key=='e'){
    fill(backgroundR,backgroundG,backgroundB);
    noStroke();
    circle(mouseX, mouseY, 50);
  }
}

function mousePressed(){
  
  
}

// functionality of help button
function helpButtonFunction(){
    if(helpTextStatus==false){
      helpText = createP("Press Alt+S to save. Hold E+ left mouse to erase.");
      helpText.position(helpButtonLength + helpButtonX + 10, -17);
      helpTextStatus = true;
    }
    else{
      helpText.remove();
      helpTextStatus = false;
    }
}

// colour button functionality
function colourButtonFunction(){
  if(colourButtonStatus==false){
    colourButtonStatus = true;
    // create four buttons for the colours
    colourRButton = createButton("red", 'red');
    colourRButton.position(colourButtonX + colourButtonLength ,colourButtonY);
    colourRButton.mousePressed(()=>{lineR = 255;lineG = 0;lineB = 0;});
    colourRButton.size(colourButtonSmall, colourButtonWidth);
    
    colourGButton = createButton("green", 'green');
    colourGButton.position(colourButtonX + colourButtonLength + colourButtonSmall ,colourButtonY);
    colourGButton.mousePressed(()=>{lineR = 0;lineG = 255;lineB = 0;});
    colourGButton.size(colourButtonSmall, colourButtonWidth);
    
    colourBButton = createButton("blue", 'blue');
    colourBButton.position(colourButtonX + colourButtonLength + 2*colourButtonSmall ,colourButtonY);
    colourBButton.mousePressed(()=>{lineR = 0;lineG = 0;lineB = 255;});
    colourBButton.size(colourButtonSmall, colourButtonWidth);
    
    colourKButton = createButton("black", 'black');
    colourKButton.position(colourButtonX + colourButtonLength + 3*colourButtonSmall  ,colourButtonY);
    colourKButton.mousePressed(()=>{lineR = 0;lineG = 0;lineB = 0;});
    colourKButton.size(colourButtonSmall, colourButtonWidth);
  }else{
    // destroy the buttons when pressed again
    colourButtonStatus = false;
    colourRButton.remove();
    colourGButton.remove();
    colourBButton.remove();
    colourKButton.remove();
  }
}

function keyPressed(){
  if(key == 's' && ALT){
    save(get(0,topBarWidth,canvasLength,canvasWidth - topBarWidth), "example.jpg");
  }
  
}