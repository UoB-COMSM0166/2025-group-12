// lets use 10 pixels as the length unit
let unit = 10;

// set size of canvas
let canvasLength = 1280;
let canvasWidth = 720;

// set size of image
let picLength = 50;
let picWidth = 50;

// speed of image
let xMoveSpeed = 0;
let xMaxSpeed = 10;
let yMoveSpeed = 0;
let yMaxSpeed = 5;

// variable of image
let img;

// save multiple keys simultaneously 
let keys = {};

function setup() {
  createCanvas(canvasLength, canvasWidth);
  
  background(100,100,100);
  
  img = createImg('pic.jpg', "pic");
  img.size(picLength, picWidth);
  img.position(0, canvasWidth - picWidth);
  img.style('position', 'absolute');
}

function draw() {
  let x = img.position().x;
  let y = img.position().y;
  
  freeFall();
  if(keyIsPressed == true){
    movePic();
  }
  
  // reset speed when idle
  if(x == img.position().x){
    xMoveSpeed = 0;
  }
  if(y == img.position().y){
    yMoveSpeed = 0;
  }
  
}

function setSpeed(){
  let x = img.position().x;
    let y = img.position().y;
    
    if (yMoveSpeed==0 && keys[32]  && y > 0) {
      yMoveSpeed -= 20;
    }

    if (keys[LEFT_ARROW]  && x > 0) {
      if(xMoveSpeed < xMaxSpeed){
        xMoveSpeed++;
      }
      x -= xMoveSpeed;
    }
    
    if (keys[RIGHT_ARROW]  && x + picLength < canvasLength) {
      if(xMoveSpeed < xMaxSpeed){
        xMoveSpeed++;
      }
      x += xMoveSpeed;
    }
    img.position(x, y);
}

function movePic(){
    let x = img.position().x;
    let y = img.position().y;
    
    if (yMoveSpeed==0 && keys[32]  && y > 0) {
      yMoveSpeed -= 20;
    }

    if (keys[LEFT_ARROW]  && x > 0) {
      if(xMoveSpeed < xMaxSpeed){
        xMoveSpeed++;
      }
      x -= xMoveSpeed;
    }
    
    if (keys[RIGHT_ARROW]  && x + picLength < canvasLength) {
      if(xMoveSpeed < xMaxSpeed){
        xMoveSpeed++;
      }
      x += xMoveSpeed;
    }
    img.position(x, y);
}

function freeFall(){
  let y = img.position().y;
  if (y + picWidth >= canvasWidth) { return;}
      if(yMoveSpeed < yMaxSpeed){
        yMoveSpeed++;
      }
      y += yMoveSpeed;
    
  img.position(img.position().x, y);
}

function keyPressed() {
  keys[keyCode] = true; 
}
function keyReleased() {
  keys[keyCode] = false;
}