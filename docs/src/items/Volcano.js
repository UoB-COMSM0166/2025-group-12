import {Terrain} from "./Terrain.js";
import {Enemy} from "./Enemy.js";
import {myutil} from "../../lib/myutil.js";
import {enemyTypes, itemTypes, plantTypes, terrainTypes} from "./ItemTypes.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {baseType} from "./ItemTypes.js";

export class Volcano extends Terrain {
    constructor(p5) {
        super();
        this.name = "Volcano";
        this.terrainType = terrainTypes.VOLCANO;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 2000;
    }
}

export class Lava extends Terrain {
    constructor(p5) {
        super();
        this.name = "Lava";
        this.terrainType = terrainTypes.LAVA;
        this.img = p5.images.get(`${this.name}`);

        this.countdown = 1;
        this.hasSolidified = false;

        this.seed = null;
        this.cell = null;
    }

    storeSeed(p5, plant) {
        if (plant.type === itemTypes.SEED) {
            this.seed = plant.constructor(p5);
        } else if (plant.type === itemTypes.PLANT) {
            this.seed = new plant.seed(p5);
        }
    }

    solidify(p5) {
        if (this.countdown > 0) {
            this.countdown--;
        } else {
            this.name = "LavaS";
            this.img = p5.images.get(`${this.name}`);
            this.hasSolidified = true;
            if (this.seed !== null) {
                this.seed.countdown = 1;
                this.cell.seed = this.seed;
            }
            this.weight = 0;
        }
    }

    getWeight() {
        return 1000;
    }
}


// need modification:
// when S and F are have the same X coordinate ( they are vertically stacked)
// then the parabola collapse.
// should shift to direct line equation in this case.

export class VolcanicBomb extends Enemy {
    constructor(p5, i1, j1, i2, j2, x1, y1, x2, y2) {
        super();
        this.name = "Bomb";
        this.img = p5.images.get(`${this.name}`);
        this.alertImg = p5.images.get("Alert");
        this.enemyType = enemyTypes.BOMB;

        this.i1 = i1;
        this.j1 = j1;
        this.i2 = i2;
        this.j2 = j2;

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
        this.countdown = 1;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 5;

        this.tS = this.reparametrization(x1, y1);
        this.tF = this.reparametrization(x2, y2);
    }

    movements(p5, playBoard) {
        if (!this.status || this.hasMoved) {
            return false;
        }
        // end movement
        if (this.isMoving === true && this.reached()) {
            this.isMoving = false;
            this.hasMoved = true;
            this.status = false;
            plantEnemyInteractions.findMovableAndDelete(playBoard, this);
            this.hit(p5, playBoard);
            return false;
        }
        // during movement
        if (this.isMoving === true) {
            this.move(this.moveSpeed);
            return true;
        }
        // before movement
        if (this.countdown > 0) {
            this.countdown--;
            this.hasMoved = true;
            return false;
        }
        if (this.countdown === 0) {
            this.img = p5.images.get(`${this.name}`);
            this.isMoving = true;
            this.move(this.moveSpeed);
            return true;
        }
    }

    hit(p5, playBoard) {
        let cell = playBoard.boardObjects.getCell(this.i2, this.j2);

        // 1.1. hit a cell with a Tree, hit it.
        if (cell.plant !== null && baseType(cell.plant) === plantTypes.TREE) {
            plantEnemyInteractions.plantIsAttacked(playBoard, cell.plant, 1);
            return;
        }

        // 2.1. hit a cell with a plant (not Tree), look for a random nearby tree
        if (cell.plant !== null || cell.seed !== null) {
            let cwt = [];
            for (let c of playBoard.boardObjects.getAdjacent8Cells(cell.x, cell.y)) {
                if (c.plant !== null && c.plant.plantType === plantTypes.TREE) {
                    cwt.push(c);
                }
            }
            // 2.2. if a tree is nearby, hit one randomly.
            if (cwt.length !== 0) {
                plantEnemyInteractions.plantIsAttacked(playBoard, cwt[Math.floor(Math.random() * cwt.length)].plant, 1);
                return;
            }
            // 2.3 no tree, hit the plant itself.
            if (cell.plant !== null) {
                plantEnemyInteractions.plantIsAttacked(playBoard, cell.plant, 1);
                return;
            }
            if (cell.seed !== null) {
                plantEnemyInteractions.plantIsAttacked(playBoard, cell.seed, 1);
                return;
            }
        }

        // 3.1 hit a cell which is playerbase:
        if (cell.terrain.terrainType === terrainTypes.BASE) {
            let cwt = [];
            for (let c of playBoard.boardObjects.getAdjacent8Cells(cell.x, cell.y)) {
                if (c.plant !== null && c.plant.plantType === plantTypes.TREE) {
                    cwt.push(c);
                }
            }
            // 3.2. if a tree is nearby, hit one randomly.
            if (cwt.length !== 0) {
                plantEnemyInteractions.plantIsAttacked(playBoard, cwt[Math.floor(Math.random() * cwt.length)].plant, 1);
                return;
            }
            // 3.3. no tree nearby, game over.
            myutil.gameOver(playBoard);
            return;
        }


    }

    move(moveSpeed) {
        let direction = Math.sign(this.x2 - this.x1);
        let distLeft = moveSpeed;
        while (distLeft > 0) {
            let x = this.x + direction;
            let y = this.getY(x);
            let dist = Math.abs(Math.sqrt(myutil.euclideanDistance(this.x, this.y, x, y)));
            distLeft -= dist;
            this.x = x;
            this.y = y;
        }
    }

    reached() {
        let parameter = this.reparametrization(this.x, this.y);
        if (this.tS > this.tF) return parameter <= this.tF;
        else return parameter >= this.tF;
    }

    getY(x) {
        return this.a * (x - this.h) ** 2 + this.k;
    }

    draw(p5) {
        // parabola
        /*
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
        */
        if (this.isMoving) {
            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            p5.image(this.img, this.x - imgSize / 2, this.y - imgSize, imgSize, imgSize);
        } else {
            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            p5.image(this.alertImg, this.x2 - imgSize / 2, this.y2 - imgSize / 2, imgSize, imgSize);
        }

    }

    integrate(f, a, b) {
        let steps = 1000;
        let dx = (b - a) / steps;
        let sum = 0;

        for (let i = 1; i <= steps; i++) {
            let x1 = a + (i - 1) * dx;
            let x2 = a + i * dx;
            sum += (f(x1) + f(x2)) / 2 * dx;
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
