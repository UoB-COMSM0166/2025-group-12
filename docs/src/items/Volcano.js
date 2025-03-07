import {Terrain} from "./Terrain.js";
import {Enemy} from "./Enemy.js";
import {myutil} from "../../lib/myutil.js";

export class Volcano extends Terrain{

}

export class Lava extends Enemy{

}


// need modification:
// when S and F are have the same X coordinate ( they are vertically stacked)
// then the parabola collapse.
// should shift to direct line equation in this case.

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

        this.tS = this.reparametrization(x1, y1);
        this.tF = this.reparametrization(x2, y2);
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
        let parameter = this.reparametrization(this.x, this.y);
        if(this.tS > this.tF) return parameter <= this.tF;
        else return parameter >= this.tF;
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

    integrate(f, a, b) {
        let steps = 1000;
        let dx = (b - a) / steps;
        let sum = 0;

        for (let i = 1; i <= steps; i++) {
            let x1 = a + (i - 1) * dx;
            let x2 = a + i * dx;
            sum += (f(x1) + f(x2)) / 2 * dx;  // Trapezoidal rule
        }

        return sum;
    }

    reparametrization(x, y) {
        if (Math.abs(y - this.getY(x)) > 1e-6) {
            console.error("Point (x, y) is not on the parabola!");
            return null;
        }

        // Integrate from vertex h to x
        return this.integrate(u => Math.sqrt(1 + (2 * this.a * (u - this.h)) ** 2), this.h, x);
    }

}
