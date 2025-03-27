import {Enemy} from "./Enemy.js";
import {enemyTypes, terrainTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {myutil} from "../../lib/myutil.js";

export class TsunamiAnimation extends Enemy {
    constructor(p5, playBoard, startCol, startRow, range) {
        super(-1, -1);
        this.name = "Tsunami";
        this.enemyType = enemyTypes.TSUNAMI;
        this.img = this.img = p5.images.get(`${this.name}`);

        this.playBoard = playBoard;

        this.startCol = startCol;
        this.startRow = startRow;

        // maximum range able to reach
        this.range = Array.from({length: this.playBoard.gridSize}, () => range);

        // 0 <= moved length[i] <= this.range[i]
        this.movedLength = Array.from({length: this.playBoard.gridSize}, () => 0);

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
        let imgSize = myutil.relative2absolute(1 / 40, 0)[0];
        if (this.startCol !== -1) {
            for (let i = 0; i < this.playBoard.gridSize; i++) {
                for (let j = 0; j <= this.movedLength[i]; j++) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this.playBoard, i, this.startCol + j, p5.CENTER);
                    //console.log(`draw cell (${i}, ${this.startCol + j})`)
                    p5.image(this.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
                }
            }
        } else {
            for (let j = 0; j < this.playBoard.gridSize; j++) {
                for (let i = 0; i <= this.movedLength[j]; i++) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this.playBoard, this.startRow + i, j, p5.CENTER);
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
            plantEnemyInteractions.findMovableAndDelete(playBoard, this);
        }
    }

    slide(p5, playBoard) {
        for (let i = 0; i < this.isMovingArray.length; i++) {
            if (this.isMovingArray[i]) {
                if (this.movedLength[i] < this.range[i]) {
                    if (this.startCol !== -1 && playBoard.boardObjects.getCell(i, this.startCol + this.movedLength[i] + 1).terrain.terrainType === terrainTypes.SEA) {
                        this.range[i] += 1;
                    } else if (this.startRow !== -1 && playBoard.boardObjects.getCell(this.startRow + this.movedLength[i] + 1, i).terrain.terrainType === terrainTypes.SEA) {
                        this.range[i] += 1;
                    }
                    this.movedLength[i] += 1;
                } else {
                    this.isMovingArray[i] = false;
                }
            }
        }

        if (!this.checkIsMoving()) this.isMoving = false;
    }
}