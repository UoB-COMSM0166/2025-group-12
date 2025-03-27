import {terrainTypes} from "./ItemTypes.js";
import {Terrain} from "./Terrain.js";

export class Sea extends Terrain {
    constructor(p5) {
        super();
        this.name = "Sea";
        this.terrainType = terrainTypes.SEA;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 100000;
    }
}