import {itemTypes} from "./ItemTypes.js";

export class Grass {
    constructor() {
        this.name = "Grass";
        this.color = "blue";
        this.type = itemTypes.PLANT;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // active: send animal friends to attack outlaw.

        this.passive = null;
        this.active = null;
        this.eco = null;
    }
}
