import {baseType, itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class Grass extends Plant {
    constructor(p5) {
        super();
        this.name = "Grass";
        this.color = "rgb(195,251,180)";
        this.plantType = plantTypes.GRASS;
        this.img = p5.images.get(`${this.name}`);

        this.seed = GrassSeed;

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
        return "The Grass has no passive skill.";
    }

    getActiveString() {
        if (this.hasActive) {
            return "Send animal friends to attack a nearby group of bandits.";
        }
        return "No active skill now.";
    }

    reevaluateSkills(playBoard, cell) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('reevaluateSkills of Grass has received invalid PlayBoard.');
            return;
        }
        if (cell.plant !== this) {
            console.error("reevaluateSkills of Grass has received wrong cell.");
            return;
        }

        // set all skills to false first.
        this.hasActive = false;
        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a Tree is next to this Grass, it gains active skill.
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
            hasActive: this.hasActive,
            hasExtended: this.hasExtended,
            useLeft: this.useLeft = 1,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let grass = new Grass(p5);
        grass.health = object.health;
        grass.hasActive = object.hasActive;
        grass.hasExtended = object.hasExtended;
        grass.useLeft = object.useLeft;
        return grass;
    }
}

export class GrassSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "GrassSeed";
        this.color = "rgb(195,251,180)";
        this.seedType = seedTypes.GRASS;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Grass(p5);
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
        let grassSeed = new GrassSeed(p5);
        grassSeed.countdown = object.countdown;
        return grassSeed;
    }
}

export class GrassAnimal {
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
