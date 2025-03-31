import {Plant} from "./Plant.js";
import {plantTypes, seedTypes} from "./ItemTypes.js";
import {Seed} from "./Seed.js";

export class Kiku extends Plant {
    constructor(p5) {
        super();
        this.name = "Kiku";
        this.color = "rgb(255,182,30)";
        this.plantType = plantTypes.KIKU;
        this.img = p5.images.get(`${this.name}`);

        this.seed = KikuSeed;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;
    }

    getPassiveString() {
        return "Increase the upper limit of action points by 1.";
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
        let kiku = new Kiku(p5);
        kiku.health = object.health;
        kiku.earthCounter = object.earthCounter;
        kiku.coldCounter = object.coldCounter;
        return kiku;
    }
}

export class KikuSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "KikuSeed";
        this.color = "rgb(255,182,30)";
        this.seedType = seedTypes.KIKU;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Kiku(p5);
        } else {
            return this;
        }
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let kikuSeed = new KikuSeed(p5);
        kikuSeed.countdown = object.countdown;
        return kikuSeed;
    }
}