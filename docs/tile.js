import { Panel } from "./panel.js";

export class Tile {
    constructor(sx, sy) {
        this.spriteWidth = 456;
        this.spriteHeight = 497;
        this.width = this.spriteWidth / 3;
        this.height = this.spriteHeight / 3;
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
        this.item = [];
        this.displayPanel = false;
        this.panel = new Panel(this);
    }

    mouseOver(p5) {
        let x0 = this.x + this.width/2;
        let y0 = this.y + this.height/3;
        //if mouse is in the diamond?
        if ((Math.abs((p5.mouseX - x0)/(this.width/2)) + Math.abs((p5.mouseY-y0)/(this.height/6))) <= 1){
            return true;
        }
        return false;
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