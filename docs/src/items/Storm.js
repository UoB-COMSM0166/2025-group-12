import {itemTypes} from "./ItemTypes.js";
import { Enemy } from "./Enemy.js";

export class Storm extends Enemy {
    constructor(x, y, direction) {
        super();
        this.name = "Storm";

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        if(direction === 'u'){
            this.direction = [0, -1];
        }else if(direction === 'd'){
            this.direction = [0, 1];
        }else if(direction === 'l'){
            this.direction = [-1, 0];
        }else if(direction === 'r'){
            this.direction = [1, 0];
        }else{
            console.log(`invalid direction of storm`);
            return;
        }

        this.x = x;
        this.y = y;
        this.countdown = 1;
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