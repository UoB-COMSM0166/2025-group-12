import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class Bamboo extends Plant {
    constructor(p5) {
        super();
        this.name = "Bamboo";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.BAMBOO;
        this.img = p5.images.get(`${this.name}`);

        this.seed = BambooSeed;

        this.health = 4;
        this.maxHealth = 4;
        this.status = true;
    }

    getPassiveString() {
        return "Bamboo's passive skill. Not implemented.";
    }

    getActiveString() {
        return "Bamboo's active skill. Not implemented.";
    }

    reevaluateSkills(playBoard, cell) {

    }
}

export class BambooSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "BambooSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.BAMBOO;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Bamboo(p5);
        } else {
            return this;
        }
    }
}
