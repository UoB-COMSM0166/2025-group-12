import {Enemy} from "./Enemy.js";
import {plantTypes} from "./ItemTypes.js";

export class Mob extends Enemy{
    constructor(x, y){
        super(x, y);
        this.name = "Mob";
        this.color = "red";
        this.plantType = plantTypes.TREE;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;
        this.cell = null;
    }

    update(){

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