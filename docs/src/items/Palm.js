import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";

export class Palm extends Plant {
    constructor(p5) {
        super();
        this.name = "Palm";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.PALM;
        this.img = p5.images.get(`${this.name}`);

        this.seed = PalmSeed;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;
    }

    getPassiveString() {
        return "Dampen tsunami."
    }

    getActiveString() {
        return "No active skill.";
    }

    reevaluateSkills(playBoard, cell) {

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
        let palm = new Palm(p5);
        palm.health = object.health;
        palm.earthCounter = object.earthCounter;
        palm.coldCounter = object.coldCounter;
        return palm;
    }
}

export class PalmSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "PalmSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.PALM;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Palm(p5);
        } else {
            return this;
        }
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let palmSeed = new PalmSeed(p5);
        palmSeed.countdown = object.countdown;
        return palmSeed;
    }
}
