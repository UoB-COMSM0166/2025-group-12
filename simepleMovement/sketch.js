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

let grid;

// save multiple keys simultaneously
let keys = {};

// status of the image
let onGround = true;

function setup() {
  createCanvas(canvasLength, canvasWidth);
  background(100, 100, 100);
  
  grid = Array.from({ length: canvasLength/unit }, () => Array.from({ length: canvasWidth/unit }, () => false));
  setCurrentGrid();
console.log(grid);

  img = createImg("pic.jpg", "pic");
  img.size(picLength, picWidth);
  img.position(400, 400);
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
  
  // press 'a' to move left
  if (keys[65] && -xMoveSpeed < xMaxSpeed && x > 0 && onGround) {
    xMoveSpeed--;
  }
  // press 'd' to move right
  if (keys[68] && xMoveSpeed < xMaxSpeed && x + picLength < canvasLength && onGround) {
    xMoveSpeed++;
  }
  // press 'w' to jump
  if (onGround == true && keys[87] && y > 0) {
    yMoveSpeed -= 20;
    onGround = false;
  }
  // free fall
  if (yMoveSpeed < yMaxSpeed && y + picWidth < canvasWidth) {
    yMoveSpeed++;
  }
}

function movePic() {
  let x = img.position().x;
  let y = img.position().y;
  
  let rowStart = floor(y / unit);
  let rowEnd = floor((y + picWidth) / unit);
  let colLeft = floor((x + xMoveSpeed) / unit);
  let colRight = floor((x + picLength + xMoveSpeed) / unit);
  let lb = floor((y + picWidth + yMoveSpeed) / unit);
  let top = floor((y + yMoveSpeed) / unit);

  // Downward collision detection
  if (yMoveSpeed > 0 && lb < canvasWidth / unit) {
    for (let col = floor(x / unit); col <= floor((x + picLength) / unit); col++) {
      if (grid[lb][col] === true) {
        yMoveSpeed = 0;
        onGround = true;
        y = lb * unit - picWidth;
        break;
      }
    }
  }

  // Upward collision detection
  if (yMoveSpeed < 0 && top >= 0) {
    for (let col = floor(x / unit); col <= floor((x + picLength) / unit); col++) {
      if (grid[top][col] === true) {
        yMoveSpeed = 0;
        y = (top + 1) * unit;
        break;
      }
    }
  }
  
  // Leftward collision detection
  if (xMoveSpeed < 0 && colLeft >= 0) {
    for (let row = rowStart; row < rowEnd; row++) {
      if (grid[row][colLeft] === true) {
        xMoveSpeed = 0;
        x = (colLeft + 1) * unit;
        break;
      }
    }
  }

  // Rightward collision detection
  if (xMoveSpeed > 0 && colRight < canvasLength / unit) {
    for (let row = rowStart; row < rowEnd; row++) {
      if (grid[row][colRight] === true) {
        xMoveSpeed = 0;
        x = colRight * unit - picLength;
        break;
      }
    }
  }
  
  // following 3 conditions make the canvas a
  // 1D infinite potential well
  if (y + picWidth + yMoveSpeed > canvasWidth) {
    y = canvasWidth - picWidth;
    yMoveSpeed = 0;
    // only allows to jump when on the ground
    onGround = true;
  }
  if (x + xMoveSpeed < 0) {
    x = 0;
    xMoveSpeed = 0;
  }
  if (x + picLength + xMoveSpeed > canvasLength) {
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
function roundAwayFromZero(num) {
  if (num > 0) {
    return Math.ceil(num); // Use Math.ceil for positive numbers
  } else {
    return Math.floor(num); // Use Math.floor for negative numbers
  }
}

function setCurrentGrid() {
  // Create a ground row at the bottom
  for (let i = 0; i < canvasLength / unit; i++) {
    grid[canvasWidth / unit - 1][i] = true; // Bottom row
    noStroke();
    fill(255, 0, 0);
    rect(i * unit, canvasWidth - unit, unit, unit);
  }

  // Add a platform in the middle
  for (let i = 50; i < 100; i++) {
    grid[60][i] = true; // Platform at row 60
    noStroke();
    fill(255, 0, 0);
    rect(i * unit, 60 * unit, unit, unit);
  }
}
