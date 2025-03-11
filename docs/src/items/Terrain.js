import {itemTypes} from "./ItemTypes.js";

export class Terrain {
    constructor() {
        this.img = null;
        this.type = itemTypes.TERRAIN;
    }

    getWeight() {
        console.log("getWeight not implemented.");
    }
}