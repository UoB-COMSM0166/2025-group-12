import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class FireHerb extends Plant {
    constructor(p5) {
        super();
        this.name = "FireHerb";
        this.color = "red";
        this.plantType = plantTypes.FIRE_HERB;
        this.img = p5.images.get(`${this.name}`);

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // no passive or active skill
        // it only affects the ecosystem
        //
    }

    getPassiveString() {
        return "No passive skill.";
    }

    getActiveString() {
        return "No active skill.";
    }

    reevaluateSkills(playBoard, cell) {
        // do nothing.
    }
}

export class FireHerbSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "FireHerbSeed";
        this.color = "red";
        this.seedType = seedTypes.FIRE_HERB;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new FireHerb(p5);
        } else {
            return this;
        }
    }
}
