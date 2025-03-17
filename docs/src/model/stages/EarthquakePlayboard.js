import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {Mountain} from "../../items/Mountain.js";
import {Bandit, Lumbering} from "../../items/Bandit.js";
import {baseType, enemyTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Earthquake, Hill, Landslide} from "../../items/Earthquake.js";
import {plantEnemyInteractions} from "../../items/PlantEnemyInter.js";
import {Enemy} from "../../items/Enemy.js";
import {Bamboo} from "../../items/Bamboo.js";

export class EarthquakePlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.EARTHQUAKE;
    }

    spreadBamboo(p5, cell) {
        if (!cell.plant && !cell.seed) {
            cell.plant = new Bamboo(p5);
        }

        for (let adCell of this.boardObjects.getAdjacent8Cells(cell.x, cell.y)) {
            if (adCell.plant || adCell.seed) continue;

            if (adCell.terrain.terrainType === terrainTypes.LANDSLIDE) {
                adCell.plant = new Bamboo(p5);
                this.spreadBamboo(p5, adCell);
            }
        }
    }

    generateSlide(p5) {
        let hills = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                if (cell.terrain.terrainType === terrainTypes.HILL && cell.terrain.canSlide) {
                    hills.push(this.boardObjects.getCell(i, j));
                }
            }
        }

        let cell = hills[Math.floor(Math.random() * hills.length)];
        for (let adCell of this.boardObjects.getAdjacent8Cells(cell.x, cell.y)) {
            if (adCell.plant !== null && baseType(adCell.plant) === plantTypes.TREE && adCell.ecosystem !== null) {
                return;
            }
        }

        this.movables.push(new slideAnimation(this.boardObjects.getCell(cell.x, cell.y), this.boardObjects.getCell(cell.x, 5)));
    }
}

class slideAnimation extends Enemy {
    constructor(firstCell, finalCell) {
        super(-1, -1);
        this.enemyType = enemyTypes.SLIDE;

        this.cell = firstCell;
        this.finalCell = finalCell;

        this.isMoving = false;
        this.hasMoved = true;

        this.accumulate = 0;
    }

    draw() {
    }

    movements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('movements of Tornado has received invalid PlayBoard.');
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
        // some terrain can block landslide
        if (this.cell.terrain.terrainType === terrainTypes.MOUNTAIN) {
            this.isMoving = false;
        }

        // kill plants and bandit on this cell:
        if (this.cell.plant !== null) this.cell.removePlant();
        else if (this.cell.seed !== null) this.cell.removeSeed();
        else if (this.cell.enemy.enemyType === enemyTypes.BANDIT) this.cell.enemy = null;

        // if cell is player base, game over.
        if (this.cell.terrain.terrainType === terrainTypes.BASE) {
            myutil.gameOver(playBoard);
            this.isMoving = false;
        }

        this.cell.terrain = new Landslide(p5);
        // place exit condition here to ensure final cell is included
        if (this.cell === this.finalCell) this.isMoving = false;

        // find next cell
        let direction = [0, 0];
        if (this.finalCell.x - this.cell.x !== 0) {
            direction[0] = (this.finalCell.x - this.cell.x) / Math.abs(this.finalCell.x - this.cell.x);
        }
        if (this.finalCell.y - this.cell.y !== 0) {
            direction[1] = (this.finalCell.y - this.cell.y) / Math.abs(this.finalCell.y - this.cell.y);
        }
        if (direction[0] !== 0 && direction[1] !== 0) {
            direction[Math.floor(Math.random() * 2)] = 0;
        }
        this.cell = playBoard.boardObjects.getCell(this.cell.x + direction[0], this.cell.y + direction[1]);

    }
}