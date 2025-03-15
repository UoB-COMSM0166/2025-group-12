import {itemTypes} from "./ItemTypes.js";

export class Terrain {
    constructor() {
        this.img = null;
        this.type = itemTypes.TERRAIN;
    }

    getWeight() {
        console.error("getWeight not implemented.");
    }
}