import {itemTypes, plantTypes, seedTypes} from "./ItemTypes.js";
import {Plant} from "./Plant.js";
import {PlayBoard} from "../model/Play.js";
import {Seed} from "./Seed.js";

export class Grass extends Plant {
    constructor(p5) {
        super();
        this.name = "Grass";
        this.color = "blue";
        this.plantType = plantTypes.GRASS;
        this.img = p5.images.get(`${this.name}`);

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // active: send animal friends to attack outlaw.
        // not implemented yet.
        this.hasActive = null;
    }

    getPassiveString(){
        return "The Grass has no passive skill.";
    }

    getActiveString(){
        if(this.hasActive){
            return "The Grass can send your animal friends to attack a nearby group of bandits.";
        }
        return "The Grass has no active skill now.";
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
            console.log('reevaluateSkills of Grass has received invalid PlayBoard.');
        }
        if(cell.plant !== this){
            console.log("reevaluateSkills of Grass has received wrong cell.");
        }

        // set all skills to false first.
        this.hasActive = false;
        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a Tree is next to this Grass, it gains active skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && adCell.plant.name === "Tree") {
                this.hasActive = true;
                break;
            }
        }
    }
}

export class GrassSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "Grass";
        this.color = "blue";
        this.seedType = seedTypes.GRASS;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5){
        this.countdown--;
        if(this.countdown === 0){
            return new Grass(p5);
        }else{
            return this;
        }
    }
}
