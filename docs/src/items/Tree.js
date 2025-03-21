import {baseType, itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";
import {PlayBoard} from "../model/Play.js";

export class Tree extends Plant {
    constructor(p5) {
        super();
        this.name = "Tree";
        this.color = "rgb(0,255,21)";
        this.plantType = plantTypes.TREE;
        this.img = p5.images.get(`${this.name}`);

        this.seed = TreeSeed;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // passive: lose up to 2 health when attacked by Tornado.
        // implemented in plantAttackedByTornado of PlantEnemyInteraction

        // active: can recharge a nearby plant's health by 1. with bush and grass.
        // implemented in rechargeHP of PlantActive

        // extend: when a bush is placed next to it, passive ability extends.
        // implemented in moveAndInvokeTornado of Tornado
        this.hasActive = false;
        this.hasExtended = false;

        // to set limit of active skill usage in one turn. reset at end of turn.
        this.useLeft = 1;
        this.maxUse = 1;
    }

    getPassiveString() {
        if (this.hasExtended) {
            return "Stops an incoming tornado from nearby 8 cells and lose up to 2 HP.";
        }
        return "Stops an incoming tornado and lose up to 2 HP.";
    }

    getActiveString() {
        if (this.hasActive) {
            return "Heal a nearby plant's HP by 1.";
        }
        return "No active skill now.";
    }

    reevaluateSkills(playBoard, cell) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('reevaluateSkills of Tree has received invalid PlayBoard.');
            return;
        }
        if (cell.plant !== this) {
            console.error("reevaluateSkills of Tree has received wrong cell.");
            return;
        }

        // set all skills to false first.
        this.hasActive = false;
        this.hasExtended = false;

        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a bush is next to this tree, it gains extended passive skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && baseType(adCell.plant) === plantTypes.BUSH) {
                this.hasExtended = true;
                break;
            }
        }
        // when a bush and a grass is next to this tree, it gains active.
        if (this.hasExtended) {
            for (let adCell of adjacentCells) {
                if (adCell.plant !== null && baseType(adCell.plant) === plantTypes.GRASS) {
                    this.hasActive = true;
                    break;
                }
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
        let tree = new Tree(p5);
        tree.health = object.health;
        tree.hasActive = object.hasActive;
        tree.hasExtended = object.hasExtended;
        tree.useLeft = object.useLeft;
        return tree;
    }
}

export class TreeSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "TreeSeed";
        this.color = "rgb(0,255,21)";
        this.seedType = seedTypes.TREE;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Tree(p5);
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
        let treeSeed = new TreeSeed(p5);
        treeSeed.countdown = object.countdown;
        return treeSeed;
    }
}
