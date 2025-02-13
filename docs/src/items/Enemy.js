import { itemTypes } from "./ItemTypes.js";

export class Enemy{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width;
        this.height;
        this.type = itemTypes.ENEMY;
    }
}