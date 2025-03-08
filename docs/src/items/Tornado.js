import {enemyTypes, itemTypes, terrainTypes} from "./ItemTypes.js";
import {Enemy} from "./Enemy.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {PlayBoard} from "../model/Play.js";
import {myutil} from "../../lib/myutil.js";

export class Tornado extends Enemy {
    constructor(p5, x, y, direction) {
        super(x, y);
        this.name = "Tornado";
        this.img = p5.images.get(`${this.name}`);
        this.enemyType = enemyTypes.TORNADO;

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
            console.error(`invalid direction of Tornado`);
            return;
        }

        this.cell = null;
        this.targetCell = null;
        this.countdown = 0;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 5;
    }

    static createNewTornado(p5, playBoard, i, j, direction) {
        if(playBoard.boardObjects.getCell(i,j).enemy !== null){
            return;
        }
        let [avgX, avgY] = myutil.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);
        let tornado = new Tornado(p5, avgX, avgY, direction);
        playBoard.movables.push(tornado);
        playBoard.boardObjects.getCell(i, j).enemy = tornado;
        tornado.cell = playBoard.boardObjects.getCell(i, j);
    }

    movements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('movements of Tornado has received invalid PlayBoard.');
            return false;
        }
        if (this.status === false) {
            return false;
        }
        if (this.isMoving === true) {
            this.moveAndInvokeTornado(p5, playBoard);
            return true;
        }
        if (this.countdown > 0) {
            this.countdown--;
            this.hasMoved = true;
            return false;
        }
        if (this.countdown === 0) {
            if (this.cell) {
                this.cell.enemy = null;
                this.cell = null;
            }
            this.isMoving = true;
            this.moveAndInvokeTornado(p5, playBoard);
            return true;
        }
    }

    // priority and logic of Tornado interactions:
    // 1. check current cell to perform Tornado-terrain interaction.
    // 2. check extended trees' existence, and randomly pick one lucky tree.
    // 3. check current cell to attack plant or seed.
    moveAndInvokeTornado(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('moveAndInvokeTornado has received invalid PlayBoard.');
            return;
        }

        let [dx, dy] = this.direction;
        let oldX = myutil.oldCoorX(playBoard, this.x, this.y) + this.moveSpeed * dx;
        let oldY = myutil.oldCoorY(playBoard, this.x, this.y) + this.moveSpeed * dy;
        let newX = myutil.newCoorX(playBoard, oldX, oldY);
        let newY = myutil.newCoorY(playBoard, oldX, oldY);
        this.x = newX;
        this.y = newY;

        // call interaction when Tornado overlays with plant (cell level)
        let index = myutil.pos2CellIndex(playBoard, this.x, this.y);
        if (index[0] !== -1) {
            let cell = playBoard.boardObjects.getCell(index[0], index[1]);
            // 1. check current cell to perform Tornado-terrain interaction.
            if (cell.terrain.name === "Mountain") {
                this.status = false;
                plantEnemyInteractions.findEnemyAndDelete(playBoard, this);
                return;
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
                plantEnemyInteractions.plantAttackedByTornado(playBoard, luckyTree, this);
                return;
            }

            // 3. check current cell to attack plant or seed.
            if (this.status === true) {
                if (cell.plant !== null && cell.plant.status === true) {
                    plantEnemyInteractions.plantAttackedByTornado(playBoard, cell.plant, this);
                } else if (cell.seed !== null) {
                    plantEnemyInteractions.plantAttackedByTornado(playBoard, cell.seed, this);
                }
            }

            // 4. if player base is at this cell, destroy it.
            if (cell.terrain.terrainType === terrainTypes.BASE) {
                myutil.gameOver(playBoard);
                return;
            }

            // 5. if a bandit is at this cell, dies.
            if (cell.enemy && cell.enemy.name === "Bandit") {
                cell.enemy.health = 0;
                cell.enemy.status = false;
                plantEnemyInteractions.findEnemyAndDelete(playBoard, cell.enemy);
                cell.enemy = null;
            }

        }

        // if the tornado goes out of the grid, it dies anyway.
        if (index[0] === -1) {
            this.status = false;
            plantEnemyInteractions.findEnemyAndDelete(playBoard, this);
        }
    }
}