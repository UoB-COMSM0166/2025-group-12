import {itemTypes} from "./ItemTypes.js";

export class Bush {
    constructor() {
        this.name = "Bush";
        this.color = "orange";
        this.type = itemTypes.PLANT;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby tree's defense extends to 9 cells.

        this.passive = null;
        this.active = null;
        this.eco = null;
    }
}
