import {itemTypes} from "./ItemTypes.js";

export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = itemTypes.ENEMY;
    }

    draw(p5){
        console.error("draw not implemented.");
    }

    movements(p5, playBoard) {
        console.error("movements not implemented.");
    }
}