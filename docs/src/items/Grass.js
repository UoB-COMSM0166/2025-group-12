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

        // to set limit of active skill usage in one turn. reset at end of turn.
        this.useLeft = 1;
        this.maxUse = 1;
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
        this.name = "GrassSeed";
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

export class GrassAnimal{
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
