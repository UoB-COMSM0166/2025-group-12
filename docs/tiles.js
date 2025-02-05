export default class Tiles {
    // static spriteWidth = 456;
    // static spriteHeight = 497;
    // static width = this.spriteWidth /5;
    // static height = this.spriteHeight /5;
    constructor(game, sx, sy) {
        this.game = game;
        this.p5 = this.game.p5;
        this.spriteWidth = 456;
        this.spriteHeight = 497;
        this.width = this.spriteWidth / 5;
        this.height = this.spriteHeight / 5;
        this.sx = sx;
        this.sy = sy;

        this.x = this.matrix(this.sx, this.sy).x;
        this.y = this.matrix(this.sx, this.sy).y;
        this.color = 'white';
        this.canStand = true;
    }

    update() {
        if(this.mouseOver(this.p5)){
            this.y -= 1;
        }
        else{
            this.y = this.matrix(this.sx, this.sy).y
        }

        if(this.y <= this.matrix(this.sx, this.sy).y - 20){
            this.y = this.matrix(this.sx, this.sy).y - 20;
        }
    }

    draw(p5) {
        p5.push();
        p5.fill(this.color);

        p5.image(p5.img, this.x, this.y, this.width, this.height, 0, 0, this.spriteWidth, this.spriteHeight);
        p5.pop();
    }

    changeColor(color) {
        this.color = color;
    }

    mouseOver(p5) {
        let temp = this.inverseMatrix(p5.mouseX, p5.mouseY);
        // if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
        console.log(this.inverseMatrix(p5.mouseX, p5.mouseY).x);
        console.log(this.inverseMatrix(p5.mouseX, p5.mouseY).y);
        const error = 0.005
        if (this.inverseMatrix(p5.mouseX, p5.mouseY).x > this.sx - error&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).x < this.sx + 1 + error&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y > this.sy  - error&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y < this.sy + 1 + error){
            return true;
        }
        else {
            return false;
        }
    }

    highlight(p5) {
        if (this.mouseOver(p5)) {
            this.color = 'yellow';
        }
        else {
            this.color = 'white';
        }
    }

    matrix(sx, sy) {
        const offsetX = 850 - this.width;
        const offsetY = 550;
        let x, y;
        x = sx * 1 * this.width / 2 + sy * (-1) * this.height / 2 + offsetX;
        y = sx * 0.5 * this.width / 2 + sy * 0.5 * this.height / 2 + offsetY;
        return {x, y};
    }

    inverseMatrix(sx, sy) {
        const offsetX = 850 - this.width;
        const offsetY = 550;
        sx -=offsetX, sy -=offsetY;
        let x, y;
        x = sx / this.width + sy * 2 / this.height;
        y = -sx / this.width + sy * 2 / this.height; 
        return {x, y};
    }
}
