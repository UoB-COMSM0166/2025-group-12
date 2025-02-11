import {itemTypes} from "./ItemTypes.js";

export class Tree {
    constructor() {
        this.name = "Tree";
        this.color = "red";
        this.type = itemTypes.PLANT;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // passive: only lose 1 health when attacked by storm.
        // active: can recharge a nearby plant's health by 1. with bush and grass.
        // eco: seeds planted in the ecosystem grow faster. with bush and grass.

        this.passive = null;
        this.active = null;
        this.eco = null;
    }
}
