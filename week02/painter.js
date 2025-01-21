let helpTextStatus = false;
let helpText;

let helpButtonX = 0;
let helpButtonY = 0;
let helpButtonWidth = 20;
let helpButtonLength = 50;

function setup() {
  
  createCanvas(1400, 700);
  background(100, 200, 100);
  
  fill(255,0,0);
  rect(helpButtonX, helpButtonY, helpButtonLength, helpButtonWidth);
  fill(255,255,255);
  text("help", 10, 10);
}

function draw() {
  if(mouseIsPressed && mouseY>100){
    fill(100,100,200);
    stroke(255,255,255);
    line(pmouseX, pmouseY, mouseX, mouseY)
  }
}

function mousePressed(){
  if(mouseIsPressed && mouseX<50 && mouseY<50 ){
    
    if(helpTextStatus==false){
      helpText = createP("Press Alt+S to save.");
      helpText.position(helpButtonLength + helpButtonX + 10, -10);
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
    save("example.jpg");
  }
}
