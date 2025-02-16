import {terrainTypes} from "./ItemTypes.js";
import {Terrain} from "./Terrain.js";

export class Steppe extends Terrain {
    constructor(p5) {
        super();
        this.name = "Steppe";
        this.color = "black";
        this.terrainType = terrainTypes.STEPPE;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight(){
        return 0;
    }
}