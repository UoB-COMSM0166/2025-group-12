import { itemTypes, plantTypes } from "./ItemTypes.js";
import { Plant } from "./Plant.js";
import {PlayBoard} from "../model/Play.js";

export class Bush extends Plant {
    constructor() {
        super();
        this.name = "Bush";
        this.color = "orange";
        this.plantType = plantTypes.BUSH;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby tree's defense extends to 9 cells.
    }

    drawHealthBar(p5, x, y, width, height){
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(255, 255, 255, 0);
        p5.rect(x, y, width, height);

        let p = this.health / this.maxHealth;

        p5.noStroke();
        p5.fill("green");
        p5.rect(x, y, width * p, height);

        for(let i = 1; i < this.maxHealth; i++){
            p5.stroke(0);
            p5.strokeWeight(1);
            p5.line(x + i * width / this.maxHealth, y, x + i * width / this.maxHealth, y + height);
        }
    }

    reevaluateSkills(playBoard, cell){
        // do nothing for Bush.
    }
}
