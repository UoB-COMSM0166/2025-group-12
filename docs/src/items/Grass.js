import { itemTypes, plantTypes } from "./ItemTypes.js";
import { Plant } from "./Plant.js";

export class Grass extends Plant {
    constructor() {
        super();
        this.name = "Grass";
        this.color = "blue";
        this.plantType = plantTypes.GRASS;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // active: send animal friends to attack outlaw.

        this.passive = null;
        this.active = null;
        this.eco = null;
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
}
