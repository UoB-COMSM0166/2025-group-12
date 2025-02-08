function setup() {
    createCanvas(1000, 1000);
    noFill();
}

function draw() {
    background(255);

    let centerX = 500;
    let centerY = 200;
    let size = 50;
    /*
      for each row
      x += i*size;
      y += i*size/2
      for each colomn
      x -= j*size
      y += j*size/2
    */
    for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 8; i++) {
            let showleft = false;
            let showright = false;
            if (j === 7) {
                showleft = true;
            }
            if (i === 7) {
                showright = true;
            }
            drawBlock(centerX + i * size - j * size, centerY + i * size / 2 + j * size / 2, size, showleft, showright);
        }
    }

}


function drawBlock(centerX, centerY, size, showleft, showright) {
    stroke('black');
    //draw top
    beginShape();
    vertex(centerX, centerY);
    vertex(centerX + size, centerY - size / 2);
    vertex(centerX, centerY - size);
    vertex(centerX - size, centerY - size / 2);
    endShape(CLOSE);
    //draw left
    if (showleft) {
        beginShape();
        vertex(centerX, centerY);
        vertex(centerX - size, centerY - size / 2);
        vertex(centerX - size, centerY + size / 2);
        vertex(centerX, centerY + size);
        endShape(CLOSE);
    }
    //draw right
    if (showright) {
        beginShape();
        vertex(centerX, centerY);
        vertex(centerX, centerY + size);
        vertex(centerX + size, centerY + size / 2);
        vertex(centerX + size, centerY - size / 2);
        endShape(CLOSE);
    }


}