import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";

export class FireHerb extends Plant {
    constructor(p5) {
        super();
        this.name = "FireHerb";
        this.color = "red";
        this.plantType = plantTypes.FIRE_HERB;
        this.img = p5.images.get(`${this.name}`);

        this.seed = FireHerbSeed;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // no passive or active skill
        // it only affects the ecosystem
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

    stringify() {
        const object = {
            plantType: this.plantType,
            health: this.health,
        }
        if (this.earthCounter) object.earthCounter = this.earthCounter;
        if (this.coldCounter) object.coldCounter = this.coldCounter;
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let fireHerb = new FireHerb(p5);
        fireHerb.health = object.health;
        fireHerb.earthCounter = object.earthCounter;
        fireHerb.coldCounter = object.coldCounter;
        return fireHerb;
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

    static parse(json, p5) {
        const object = JSON.parse(json);
        let fireSeed = new FireHerbSeed(p5);
        fireSeed.countdown = object.countdown;
        return fireSeed;
    }
}
