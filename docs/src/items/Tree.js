import {itemTypes, plantTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";

export class Tree extends Plant {
    constructor() {
        super();
        this.name = "Tree";
        this.color = "red";
        this.plantType = plantTypes.TREE;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // passive: only lose 1 health when attacked by storm.
        // active: can recharge a nearby plant's health by 1. with bush and grass.
        // extend: when a bush is placed next to it, passive ability extends.
        this.hasActive = false;
        this.hasExtended = false;
    }

    drawHealthBar(p5, x, y, width, height) {
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(255, 255, 255, 0);
        p5.rect(x, y, width, height);

        let p = this.health / this.maxHealth;

        p5.noStroke();
        p5.fill("green");
        p5.rect(x, y, width * p, height);

        for (let i = 1; i < this.maxHealth; i++) {
            p5.stroke(0);
            p5.strokeWeight(1);
            p5.line(x + i * width / this.maxHealth, y, x + i * width / this.maxHealth, y + height);
        }
    }

    reevaluateSkills(playBoard, cell) {
        if (!(playBoard instanceof PlayBoard)) {
            console.log('reevaluateSkills of Tree has received invalid PlayBoard.');
        }
        if (cell.plant !== this) {
            console.log("reevaluateSkills of Tree has received wrong cell.");
        }

        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a bush is next to this tree, it gains extended passive skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && adCell.plant.name === "Bush") {
                this.hasExtended = true;
                break;
            }
        }
        // when a bush and a grass is next to this tree, it gains active.
        if (this.hasExtended) {
            for (let adCell of adjacentCells) {
                if (adCell.plant !== null && adCell.plant.name === "Grass") {
                    this.hasActive = true;
                    break;
                }
            }
        }

    }
}
