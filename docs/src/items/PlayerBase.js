import {terrainTypes} from "./ItemTypes.js";
import {Terrain} from "./Terrain.js";

export class PlayerBase extends Terrain {
    constructor(p5) {
        super();
        this.name = "PlayerBase";
        this.terrainType = terrainTypes.BASE;
        this.img = p5.images.get(`${this.name}`);

        this.health = 1;
        this.maxHealth = 1;
    }

    getWeight() {
        return 0;
    }
}