import {itemTypes} from "./ItemTypes.js";

export class Seed {
    constructor() {
        this.type = itemTypes.SEED;
        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        this.seedType = 0;
        this.countdown = -1;
    }

    stringify() {
        const object = {
            seedType: this.seedType,
            countdown: this.countdown,
        }
        return JSON.stringify(object);
    }
}