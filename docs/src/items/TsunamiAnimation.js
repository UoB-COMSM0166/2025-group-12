import {Enemy} from "./Enemy.js";
import {movableTypes, plantTypes, terrainTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {InteractionLogic} from "./InteractionLogic.js";
import {myUtil} from "../../lib/myUtil.js";

export class TsunamiAnimation extends Enemy {
    constructor(p5, playBoard, startCol, startRow, range = 1, blockerLimit = 3) {
        super(-1, -1);
        this.name = "Tsunami";
        this.movableType = movableTypes.TSUNAMI;
        this.img = this.img = p5.images.get(`${this.name}`);

        this.playBoard = playBoard;

        this.startCol = startCol;
        this.startRow = startRow;

        // maximum range able to reach
        this.range = Array.from({length: this.playBoard.gridSize}, () => range);

        // 0 <= moved length[i] <= this.range[i]
        this.movedLength = Array.from({length: this.playBoard.gridSize}, () => 0);

        // when blocker[i] -> 0, decrease range[i] by 1
        this.blockerLimit = blockerLimit;
        this.blocker = Array.from({length: this.playBoard.gridSize}, () => this.blockerLimit);

        // loop through this to end moving
        this.isMovingArray = Array.from({length: this.playBoard.gridSize}, () => false);

        this.isMoving = false;
        this.hasMoved = true;

        this.accumulate = 0;
    }

    static createNewTsunami(p5, playBoard, startCol, startRow, range) {
        let tsunami = new TsunamiAnimation(p5, playBoard, startCol, startRow, range);
        playBoard.movables.push(tsunami);
    }

    draw(p5) {
        let imgSize = myUtil.relative2absolute(1 / 40, 0)[0];
        if (this.startCol !== -1) {
            for (let i = 0; i < this.playBoard.gridSize; i++) {
                for (let j = 0; j <= this.movedLength[i]; j++) {
                    let [avgX, avgY] = myUtil.cellIndex2Pos(p5, this.playBoard, i, this.startCol + j, p5.CENTER);
                    p5.image(this.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
                }
            }
        } else {
            for (let j = 0; j < this.playBoard.gridSize; j++) {
                for (let i = 0; i <= this.movedLength[j]; i++) {
                    let [avgX, avgY] = myUtil.cellIndex2Pos(p5, this.playBoard, this.startRow + i, j, p5.CENTER);
                    p5.image(this.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
                }
            }
        }
    }

    checkIsMoving() {
        for (let isMoving of this.isMovingArray) {
            if (isMoving) return true;
        }
        return false;
    }

    movements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('movements of TsunamiAnimation has received invalid PlayBoard.');
            return false;
        }
        if (this.hasMoved) {
            return false;
        }
        if (this.isMoving) {
            this.move(p5, playBoard);
            return true;
        }
        this.isMoving = true;
        this.isMovingArray = this.isMovingArray.map(value => true);
        return true;
    }

    move(p5, playBoard) {
        this.accumulate += 1;
        if (this.accumulate >= 20) {
            this.slide(p5, playBoard);
            this.accumulate = 0;
        }
        if (!this.isMoving) {
            this.hasMoved = true;
            InteractionLogic.findMovableAndDelete(playBoard, this);
        }
    }

    slide(p5, playBoard) {
        let gameOver = false;
        for (let i = 0; i < this.isMovingArray.length; i++) {
            if (this.isMovingArray[i]) {
                if (this.movedLength[i] < this.range[i]) {
                    let cell;
                    if (this.startCol !== -1) {
                        cell = playBoard.boardObjects.getCell(i, this.startCol + this.movedLength[i] + 1);
                        if (cell.terrain.terrainType === terrainTypes.SEA) this.range[i] += 1;
                    } else {
                        cell = playBoard.boardObjects.getCell(this.startRow + this.movedLength[i] + 1, i);
                        if (cell.terrain.terrainType === terrainTypes.SEA) this.range[i] += 1;
                    }
                    this.movedLength[i] += 1;

                    // interact with plant
                    if (cell.plant || cell.seed) {
                        // decrease max range according to plant health
                        // if the plant is palm, invoke its passive skill (placeholder)
                        if (cell?.plant.plantType === plantTypes.PALM) {
                            cell.plant.health--;
                            if (cell.plant.health === 0) {
                                InteractionLogic.findPlantAndDelete(playBoard, cell.plant);
                            }
                            this.range[i] -= 2;
                        }
                        // else, use health to offset range
                        else {
                            let health = cell.seed ? 1 : cell.plant.health;
                            while (health > 0) {
                                this.blocker[i] -= 1;
                                if (this.blocker[i] <= 0) {
                                    this.range[i] -= 1;
                                    this.blocker[i] = this.blockerLimit;
                                }
                                health--;
                            }
                            if (cell.plant) {
                                cell.removePlant();
                                playBoard.fertilized[cell.x][cell.y] = true;
                            }
                            if (cell.seed) {
                                cell.removeSeed();
                                playBoard.fertilized[cell.x][cell.y] = true;
                            }
                        }
                    }

                    // interact with enemy
                    if (cell.enemy?.movableType === movableTypes.BANDIT) {
                        InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
                    }

                    // interact with terrain
                    switch (cell.terrain.terrainType) {
                        case terrainTypes.BASE:
                            gameOver = true;
                            break;
                        case terrainTypes.VOLCANO:
                        case terrainTypes.MOUNTAIN:
                            this.range[i] = 0;
                            break;
                        case terrainTypes.LUMBERING:
                            this.range[i] -= 1;
                            break;
                    }
                } else {
                    this.isMovingArray[i] = false;
                }
            }
            if (gameOver) myUtil.gameOver(playBoard);
        }

        if (!this.checkIsMoving()) this.isMoving = false;
    }

    stringify() {
        const object = {
            movableType: this.movableType,
            startCol: this.startCol,
            startRow: this.startRow,
            range: this.range[0],
            blockerLimit: this.blockerLimit[0],
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, playBoard) {
        const object = JSON.parse(json);
        return new TsunamiAnimation(p5, playBoard, object.startCol, object.startRow, object.range, object.blockerLimit);
    }
}