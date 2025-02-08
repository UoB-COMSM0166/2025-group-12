export class Tile {
    constructor(sx, sy) {
        this.spriteWidth = 456;
        this.spriteHeight = 497;
        this.width = this.spriteWidth / 4;
        this.height = this.spriteHeight / 4;
        this.sx = sx;
        this.sy = sy;
        this.offsetX = 1920/2 - this.width;
        this.offsetY = 350;
        this.x = this.matrix(this.sx, this.sy).x;
        this.y = this.matrix(this.sx, this.sy).y;
        this.color = 'white';
        this.canStand = true;
        this.isHovered = false;
        this.isPressed = false;
    }

    mouseOver(p5) {
        if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
            return true;
        }
        else {
            return false;
        }
        if (this.inverseMatrix(p5.mouseX, p5.mouseY).x > this.sx&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).x < this.sx + 1&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y > this.sy&&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y < this.sy + 1){
            return true;
        }
        else {
            return false;
        }
    }

    matrix(sx, sy) {
        let x, y;
        x = sx * 1 * this.width / 2 + sy * (-1) * this.height / 2 + this.offsetX;
        y = sx * 0.5 * this.width / 2 + sy * 0.5 * this.height / 2 + this.offsetY;
        return {x, y};
    }

    inverseMatrix(sx, sy) {
        let x, y;
        x = sx / this.width + sy * 2 / this.height - this.offsetX;
        y = -sx / this.width + sy * 2 / this.height - this.offsetY; 
        return {x, y};
    }
}