import { itemTypes } from "./ItemTypes.js";

export class Seed{
    constructor(){
        this.type = itemTypes.SEED;
        this.health = 1;
        this.maxHealth = 1;
        this.status = true;
    }
}