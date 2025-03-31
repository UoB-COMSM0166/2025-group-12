import {baseType, itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class Orchid extends Plant {
    constructor(p5) {
        super();
        this.name = "Orchid";
        this.color = "rgb(250,240,180)";
        this.plantType = plantTypes.ORCHID;
        this.img = p5.images.get(`${this.name}`);

        this.seed = OrchidSeed;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // active: send animal friends to attack outlaw.
        // implemented in sendAnimalFriends of PlantActive
        this.hasActive = false;

        // to set limit of active skill usage in one turn. reset at end of turn.
        this.useLeft = 1;
        this.maxUse = 1;
    }

    getPassiveString() {
        return "The Orchid has no passive skill.";
    }

    getActiveString() {
        if (this.hasActive) {
            return "Send animal friends to attack a nearby group of bandits.";
        }
        return "No active skill now.";
    }

    reevaluateSkills(playBoard, cell) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('reevaluateSkills of Orchid has received invalid PlayBoard.');
            return;
        }
        if (cell.plant !== this) {
            console.error("reevaluateSkills of Orchid has received wrong cell.");
            return;
        }

        // set all skills to false first.
        this.hasActive = false;
        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a Tree is next to this Orchid, it gains active skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && baseType(adCell.plant) === plantTypes.TREE) {
                this.hasActive = true;
                break;
            }
        }
    }

    stringify() {
        const object = {
            plantType: this.plantType,
            health: this.health,
            useLeft: this.useLeft,
        }
        if (this.earthCounter) object.earthCounter = this.earthCounter;
        if (this.coldCounter) object.coldCounter = this.coldCounter;
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let orchid = new Orchid(p5);
        orchid.health = object.health;
        orchid.useLeft = object.useLeft;
        orchid.earthCounter = object.earthCounter;
        orchid.coldCounter = object.coldCounter;
        return orchid;
    }
}

export class OrchidSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "OrchidSeed";
        this.color = "rgb(250,240,180)";
        this.seedType = seedTypes.ORCHID;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Orchid(p5);
        } else {
            return this;
        }
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let orchidSeed = new OrchidSeed(p5);
        orchidSeed.countdown = object.countdown;
        return orchidSeed;
    }
}

export class AnimalFriends {
    constructor(p5, target) {
        this.target = target;
        this.x = 0;
        this.y = 0;

        this.img = p5.images.get(`panther`);
        this.cell = null;
        this.status = true;

        this.targetCell = null;
        this.isMoving = false;
        this.hasMoved = true;
        this.direction = [];
    }
}
