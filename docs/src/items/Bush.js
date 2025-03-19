import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";

export class Bush extends Plant {
    constructor(p5) {
        super();
        this.name = "Bush";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.BUSH;
        this.img = p5.images.get(`${this.name}`);

        this.seed = BushSeed;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby tree's defense extends to 9 cells.
        // implemented in Tree's reevaluateSkills
    }

    getPassiveString() {
        return "Extends nearby Trees' passive ability to adjacent 8 cells.";
    }

    getActiveString() {
        return "No active skill.";
    }

    reevaluateSkills(playBoard, cell) {
        // do nothing for Bush.
    }

    stringify() {
        const object = {
            plantType: this.plantType,
            health: this.health,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let bush = new Bush(p5);
        bush.health = object.health;
        return bush;
    }
}

export class BushSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "BushSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.BUSH;
        this.countdown = 2;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Bush(p5);
        } else {
            return this;
        }
    }

    stringify() {
        const object = {
            seedType: this.seedType,
            countdown: this.countdown,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let bushSeed = new BushSeed(p5);
        bushSeed.countdown = object.countdown;
        return bushSeed;
    }
}
