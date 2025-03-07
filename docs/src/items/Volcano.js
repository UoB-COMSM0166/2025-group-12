import {Terrain} from "./Terrain.js";
import {Enemy} from "./Enemy.js";
import {myutil} from "../../lib/myutil.js";

export class Volcano extends Terrain{

}

export class Lava extends Enemy{

}

export class VolcanicBomb{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        let Y = Math.min(y1, y2);
        this.k = Y - Math.abs(y1 - y2) / 2;
        let sqrtTerm = Math.sqrt((y1 - this.k) / (y2 - this.k));
        let h1 = (x1 - sqrtTerm * x2) / (1 - sqrtTerm);
        let h2 = (x1 + sqrtTerm * x2) / (1 + sqrtTerm);
        this.h = (h1 > Math.min(x1, x2) && h1 < Math.max(x1, x2)) ? h1 : h2;
        this.a = (y1 - this.k) / ((x1 - this.h) ** 2);

        this.x = x1;
        this.y = y1;
        this.status = true;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 10;
    }

    movements(p5, playBoard){
        if (!this.status || this.hasMoved) {
            return false;
        }
        // end movement
        if (this.isMoving === true && this.reached()) {
            this.isMoving = false;
            this.hasMoved = true;
            this.status = false;
            return false;
        }
        // during movement
        if (this.isMoving === true) {
            this.move(this.moveSpeed);
            return true;
        }
        // before movement
        if (this.isMoving === false) {
            this.isMoving = true;
            this.move(this.moveSpeed);
            return true;
        }
    }

    move(moveSpeed){
        let direction =  Math.sign(this.x2 - this.x1) ;
        let distLeft = moveSpeed;
        while(distLeft>0){
            let x = this.x + direction;
            let y = this.getY(x);
            let dist = Math.abs(Math.sqrt(myutil.euclideanDistance(this.x, this.y, x, y)));
            distLeft -= dist;
            this.x = x;
            this.y = y;
        }
    }

    reached(){
        if(this.x1 > this.x2){
            return this.x <= this.x2;
        }else{
            return this.x >= this.x2;
        }
    }

    getY(x) {
        return this.a * (x - this.h) ** 2 + this.k;
    }

    draw(p5) {
        p5.stroke(2);
        p5.noFill();
        p5.beginShape();
        for (let x = 0; x < 2000; x++) {
            let y = this.getY(x);
            p5.vertex(x, y);
        }
        p5.endShape();

        // Draw points
        p5.fill(0);
        p5.ellipse(this.x1, this.y1, 10, 10);
        p5.text("S", this.x1 - 15, this.y1);

        p5.ellipse(this.x2, this.y2, 10, 10);
        p5.text("F", this.x2 + 5, this.y2);

        p5.fill(0);
        p5.ellipse(this.x, this.y, 10, 10);
        p5.text("P", this.x - 15, this.y);
    }

}
