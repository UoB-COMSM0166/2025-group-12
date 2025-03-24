import {Enemy} from "./Enemy.js";
import {enemyTypes, terrainTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {myutil} from "../../lib/myutil.js";
import {Landslide} from "./Earthquake.js";

export class SlideAnimation extends Enemy {
    constructor(firstCell, finalCell) {
        super(-1, -1);
        this.name = "slideAnimation";
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
        else if (this.cell.enemy?.enemyType === enemyTypes.BANDIT) this.cell.enemy = null;

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

    stringify() {
        const object = {
            enemyType: this.enemyType,
            cellX: this.cell?.x,
            cellY: this.cell?.y,
            finalCellX: this.finalCell?.x,
            finalCellY: this.finalCell?.y,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, playBoard) {
        const object = JSON.parse(json);
        return new SlideAnimation(playBoard.boardObjects.getCell(object.cellX, object.cellY), playBoard.boardObjects.getCell(object.finalCellX, object.finalCellY));
    }
}