import {terrainTypes} from "./ItemTypes.js";
import {Terrain} from "./Terrain.js";

export class Mountain extends Terrain {
    constructor(p5) {
        super();
        this.name = "Mountain";
        this.terrainType = terrainTypes.MOUNTAIN;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 1000; // almost inaccessible.
    }
}