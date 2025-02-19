import {enemyTypes, itemTypes, terrainTypes} from "./ItemTypes.js";
import {Enemy} from "./Enemy.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {PlayBoard} from "../model/Play.js";
import {stateCode} from "../model/GameState.js";

export class Storm extends Enemy {
    constructor(p5, x, y, direction) {
        super(x, y);
        this.name = "Storm";
        this.img = p5.images.get(`${this.name}`);
        this.enemyType = enemyTypes.STORM;

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

    static createNewStorm(p5, playBoard, i, j, direction) {
        let [avgX, avgY] = playBoard.CellIndex2Pos(p5, i, j, p5.CENTER);
        let storm = new Storm(p5, avgX, avgY, direction);
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
            this.moveAndInvokeStorm(p5, playBoard);
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
            this.moveAndInvokeStorm(p5, playBoard);
            return true;
        }
    }

    // priority and logic of storm interactions:
    // 1. check current cell to perform storm-terrain interaction.
    // 2. check extended trees' existence, and randomly pick one lucky tree.
    // 3. check current cell to attack plant or seed.
    moveAndInvokeStorm(p5, playBoard) {
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
        if (index[0] !== -1) {
            let cell = playBoard.boardObjects.getCell(index[0], index[1]);
            // 1. check current cell to perform storm-terrain interaction.
            if (cell.terrain.name === "Mountain") {
                this.status = false;
                plantEnemyInteractions.findEnemyAndDelete(playBoard, this);
            }

            // 2. check extended trees' existence, and randomly pick one lucky tree.
            let cells = playBoard.boardObjects.getAdjacent4Cells(index[0], index[1]);
            let trees = [];
            for (let adCell of cells) {
                if (adCell !== null && adCell.plant !== null && adCell.plant.name === "Tree") {
                    if (adCell.plant.hasExtended === true && adCell.plant.status === true) {
                        trees.push(adCell.plant);
                    }
                }
            }
            if (trees.length > 0) {
                let luckyTree = trees[Math.floor(Math.random() * trees.length)];
                plantEnemyInteractions.plantAttackedByStorm(playBoard, luckyTree, this);
            }

            // 3. check current cell to attack plant or seed.
            if (cell.plant !== null && cell.plant.status === true) {
                plantEnemyInteractions.plantAttackedByStorm(playBoard, cell.plant, this);
            } else if (cell.seed !== null) {
                plantEnemyInteractions.plantAttackedByStorm(playBoard, cell.seed, this);
            }

            // 4. if player base is at this cell, destroy it.
            if (cell.terrain.terrainType === terrainTypes.BASE) {
                playBoard.gameOver(p5);
            }

            // 4. if a bandit is at this cell, dies.
            if (cell.enemy && cell.enemy.name === "Bandit") {
                cell.enemy.health = 0;
                cell.enemy.status = false;
                plantEnemyInteractions.findEnemyAndDelete(playBoard, cell.enemy);
                cell.enemy = null;
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