import {itemTypes, terrainTypes} from "./ItemTypes.js";

export class Terrain {
    constructor() {
        this.img = null;
        this.type = itemTypes.TERRAIN;
        this.terrainType = 0;
    }

    getWeight() {
        console.error("getWeight not implemented.");
        return 1000;
    }

    stringify() {
        const object = {
            terrainType: this.terrainType,
        }
        return JSON.stringify(object);
    }
}