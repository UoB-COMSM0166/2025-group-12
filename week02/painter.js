let canvasLength = 1280;
let canvasWidth = 720;
let topBarWidth = 100;

let helpTextStatus = false;
let helpText;

let helpButtonX = 0;
let helpButtonY = 0;
let helpButtonWidth = 20;
let helpButtonLength = 50;

let backgroundR = 255;
let backgroundG = 255;
let backgroundB = 255;

let lineR = 0;
let lineG = 0;
let lineB = 0;

function setup() {
  
  createCanvas(canvasLength, canvasWidth);
  background(backgroundR,backgroundG,backgroundB);
  
  // setup help button
  fill(255,0,0);
  rect(helpButtonX, helpButtonY, helpButtonLength, helpButtonWidth);
  fill(255,255,255);
  text("help", 10, 10);
}

function draw() {
  if(!keyIsPressed && mouseIsPressed && mouseButton==LEFT && mouseY>topBarWidth){
    stroke(lineR, lineG, lineB);
    line(pmouseX, pmouseY, mouseX, mouseY)
  }else if(mouseIsPressed && mouseButton==LEFT && keyIsPressed && key=='e'){
    fill(backgroundR,backgroundG,backgroundB);
    noStroke();
    circle(mouseX, mouseY, 50);
  }
}

function mousePressed(){
  if(mouseIsPressed && mouseX<50 && mouseY<50 ){
    
    if(helpTextStatus==false){
      color(100,0,200);
      helpText = createP("Press Alt+S to save. Press E+mouseLeft to erase.", 100, 100);
      //helpText.position(helpButtonLength + helpButtonX + 10, -10);
      
      helpTextStatus = true;
    }
    else{
      helpText.remove();
      helpTextStatus = false;
    }
    
  }
}

function keyPressed(){
  if(key == 's' && ALT){
    save(get(0,topBarWidth,canvasLength,canvasWidth - topBarWidth), "example.jpg");
  }
  else if(key == 'r'){
    lineR = 255;
    lineG = 0;
    lineB = 0;
  }
  else if(key == 'g'){
    lineR = 0;
    lineG = 255;
    lineB = 0;
  }
  else if(key == 'b'){
    lineR = 0;
    lineG = 0;
    lineB = 255;
  }
  else if(key == 'k'){
    lineR = 0;
    lineG = 0;
    lineB = 0;
  }
}
