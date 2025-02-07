const Scene = {
    MENU: "MENU",
    MAP: "MAP",
    LEVEL: "LEVEL"
};

import Inventory from "./inventory.js";
import Button from "./button.js";

export class ModelList {
    constructor(){
        this.menuModel = new MenuModel();
    }
}

export default class Model {
    constructor(){
        //this.scene = 'menu';
        this.buttonList = [];
        //this.board = new Board;
        //this.inventory = new Inventory();

    }

    setWidth(width){
        this.width = width;
    }

    setScene(scene){
        this.scene = scene;
    }
}

export class MenuModel extends Model {
    constructor(){
        super();
        this.scene = 'menu';
        this.addButton();
    }
    addButton(){
        this.buttonList[0] = new Button(1920 / 2 - 100/2, 700, 100, 40, "New Game");
    }
}

class Tile {
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
        let temp = this.inverseMatrix(p5.mouseX, p5.mouseY);
        // if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
        // console.log(this.inverseMatrix(p5.mouseX, p5.mouseY).y);
        const error = 0.005
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
        //const offsetX = 850 - this.width;
        //const offsetY = 550;
        //sx -=offsetX, sy -=offsetY;
        let x, y;
        x = sx / this.width + sy * 2 / this.height;
        y = -sx / this.width + sy * 2 / this.height; 
        return {x, y};
    }
}

class Board{
    constructor(){
        this.tilesArray = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.initTiles();
    }

    draw(p5){
        this.tilesArray.forEach(row =>{
            row.forEach(cell => {
                cell.draw(p5);
            });
        })
    }
    
    //fill the 2d array
    initTiles(){
        const size = 50;
        const d = 1;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                let x = i * d;
                let y = j * d;
                this.tilesArray[j][i] = new Tile(x, y, size);
            }
        }
    }
}
