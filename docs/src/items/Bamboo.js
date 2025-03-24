import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
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
        return "Automatically spreads to all nearby landslide terrain and repair local environment."
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
        let bamboo = new Bamboo(p5);
        bamboo.health = object.health;
        bamboo.earthCounter = object.earthCounter;
        bamboo.coldCounter = object.coldCounter;
        return bamboo;
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

    static parse(json, p5) {
        const object = JSON.parse(json);
        let bambooSeed = new BambooSeed(p5);
        bambooSeed.countdown = object.countdown;
        return bambooSeed;
    }
}
