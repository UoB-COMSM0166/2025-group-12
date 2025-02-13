import { itemTypes } from "./ItemTypes.js";

export class Enemy{
    constructor(){
        this.x;
        this.y;
        this.width;
        this.height;
        this.type = itemTypes.ENEMY;
    }
}