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
let yMaxSpeed = 10;

// variable of image
let img;

// save multiple keys simultaneously
let keys = {};

// status of the image
let onGround = true;

function setup() {
  createCanvas(canvasLength, canvasWidth);

  background(100, 100, 100);

  img = createImg("pic.jpg", "pic");
  img.size(picLength, picWidth);
  img.position(0, canvasWidth - picWidth);
  img.style("position", "absolute");
}

function draw() {
  let x = img.position().x;
  let y = img.position().y;
  
  setSpeed();
  movePic();
  
  // reset speed when idle
  if (x == img.position().x) {
    xMoveSpeed = 0;
  }
  if (y == img.position().y) {
    yMoveSpeed = 0;
  }
}

function setSpeed() {
  let x = img.position().x;
  let y = img.position().y;
  
  // if left or right arrow is not pressed, gradually reset horizontal speed
  if(!keys[65] && !keys[68]){
    if(xMoveSpeed > 0){
      xMoveSpeed--;
    }else if(xMoveSpeed < 0){
      xMoveSpeed++;
    }
  }
  
  // jump
  if (onGround == true && keys[87] && y > 0) {
    yMoveSpeed -= 20;
    onGround = false;
  }
  // free fall
  if (yMoveSpeed < yMaxSpeed && y + picWidth < canvasWidth) {
    yMoveSpeed++;
  }
  // move left
  if (keys[65] && -xMoveSpeed < xMaxSpeed && x > 0) {
    xMoveSpeed--;
  }
  // move right
  if (keys[68] && xMoveSpeed < xMaxSpeed && x + picLength < canvasLength) {
    xMoveSpeed++;
  }
}

function movePic() {
  let x = img.position().x;
  let y = img.position().y;

  if (yMoveSpeed > 0 && y + picWidth >= canvasWidth) {
    y = canvasWidth - picWidth;
    yMoveSpeed = 0;
    onGround = true;
  }
  
  if (xMoveSpeed < 0 && x <= 0) {
    x = 0;
    xMoveSpeed = 0;
  }
  if (xMoveSpeed > 0 && x + picLength >= canvasLength) {
    x = canvasLength - picLength;
    xMoveSpeed = 0;
  }
  img.position(x + xMoveSpeed, y + yMoveSpeed);
}

function keyPressed() {
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
}
