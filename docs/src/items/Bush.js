import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class Bush extends Plant {
    constructor(p5) {
        super();
        this.name = "Bush";
        this.color = "orange";
        this.plantType = plantTypes.BUSH;
        this.img = p5.images.get(`${this.name}`);

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby tree's defense extends to 9 cells.
        // implemented in Tree's reevaluateSkills
    }

    getPassiveString() {
        return "The Bush extends nearby Trees' passive ability to adjacent 8 cells.";
    }

    getActiveString() {
        return "The Bush has no active skill.";
    }

    reevaluateSkills(playBoard, cell) {
        // do nothing for Bush.
    }
}

export class BushSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "BushSeed";
        this.color = "orange";
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
}
