import {itemTypes} from "./ItemTypes.js";
import {Enemy} from "./Enemy.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {PlayBoard} from "../model/Play.js";

export class Storm extends Enemy {
    constructor(x, y, direction) {
        super(x, y);
        this.name = "Storm";

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        if (direction === 'u') {
            this.direction = [0, -1];
        } else if (direction === 'd') {
            this.direction = [0, 1];
        } else if (direction === 'l') {
            this.direction = [-1, 0];
        } else if (direction === 'r') {
            this.direction = [1, 0];
        } else {
            console.log(`invalid direction of storm`);
            return;
        }

        this.cell = null;
        this.countdown = 1;
        this.isMoving = false;
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

    static createNewStorm(p5, playBoard, i, j, direction) {
        let [avgX, avgY] = playBoard.CellIndex2Pos(p5, i, j, p5.CENTER);
        let storm = new Storm(avgX, avgY, direction);
        playBoard.enemies.push(storm);
        playBoard.boardObjects.getCell(i, j).enemy = storm;
        storm.cell = playBoard.boardObjects.getCell(i, j);
    }

    enemyMovements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('enemyMovements of Storm has received invalid PlayBoard.');
            return false;
        }
        if (this.status === false) {
            return false;
        }
        if (this.isMoving === true) {

            this.moveAndInvokeStorm(playBoard);
            return true;
        }
        if (this.countdown > 0) {
            this.countdown--;
        }
        if (this.countdown === 0) {
            // the storm blows!
            if (this.cell) {
                this.cell.enemy = null;
                this.cell = null;
            }
            this.isMoving = true;
            return true;
        }

    }

    moveAndInvokeStorm(playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('moveAndInvokeStorm has received invalid PlayBoard.');
            return;
        }

        let [dx, dy] = this.direction;
        let oldX = playBoard.oldCoorX(this.x, this.y) + 5 * dx; // 5 is a magic number representing the moving speed of storm
        let oldY = playBoard.oldCoorY(this.x, this.y) + 5 * dy;
        let newX = playBoard.newCoorX(oldX, oldY);
        let newY = playBoard.newCoorY(oldX, oldY);
        this.x = newX;
        this.y = newY;

        // call interaction when storm overlays with plant (cell level)
        let index = playBoard.pos2CellIndex(this.x, this.y);
        // if the storm is within grids, look up current cell and 3 cells ahead.
        if (index[0] !== -1) {
            // if there is an extended tree ahead, check first
            let dz = this.direction[0] === 0 ? [0, 1] : [1, 0];
            for (let k = -1; k <= 1; k++) {
                let aheadCell = playBoard.boardObjects.getCell(index[0] + this.direction[1] + dz[0] * k, index[1] + this.direction[0] + dz[1] * k);
                if (aheadCell !== null && aheadCell.plant !== null && aheadCell.plant.name === "Tree") {
                    if (aheadCell.plant.hasExtended === true && aheadCell.plant.status === true) {
                        plantEnemyInteractions.plantAttackedByStorm(playBoard, aheadCell.plant, this);
                    }
                }
            }

            // then look up current cell
            let cell = playBoard.boardObjects.getCell(index[0], index[1]);
            if (cell.plant !== null && cell.plant.status === true) {
                plantEnemyInteractions.plantAttackedByStorm(playBoard, cell.plant, this);
            }
        }

        // if the storm goes out of the grid, it dies anyway.
        if (index[0] === -1) {
            this.status = false;
            let index = playBoard.enemies.findIndex(e => e === this);
            playBoard.enemies.splice(index, 1);
        }
    }
}