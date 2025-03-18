import {itemTypes} from "./ItemTypes.js";
import {Movable} from "./Movable.js";

export class Enemy extends Movable {
    constructor(x, y) {
        super();
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