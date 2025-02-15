import {Enemy} from "./Enemy.js";
import {itemTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {aStarSearch} from "../model/Astar.js";

export class Mob extends Enemy {
    constructor(p5, x, y) {
        super(x, y);
        this.name = "Mob";
        this.img = p5.images.get(`${this.name}`);

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;
        this.cell = null;
        this.tempcell = null;
        this.targetCell = null;
        this.targetX;
        this.targetY;
        this.moved = false;
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

    static createNewMob(p5, playBoard, i, j) {
        let [avgX, avgY] = playBoard.CellIndex2Pos(p5, i, j, p5.CENTER);
        let mob = new Mob(p5, avgX, avgY);
        playBoard.enemies.push(mob);
        playBoard.boardObjects.getCell(i, j).enemy = mob;
        mob.cell = playBoard.boardObjects.getCell(i, j);
    }

    enemyMovements(p5, playBoard) {
        if(this.moved){
            return false;
        }
        if (!(playBoard instanceof PlayBoard)) {
            console.error('enemyMovements of Storm has received invalid PlayBoard.');
            return false;
        }
        if (this.status === false) {
            return false;
        }

        // randomly choose a target
        let cells = playBoard.boardObjects.getAllCellsWithPlant();
        if (cells.length > 0) {
            this.targetCell = cells[Math.floor(Math.random() * cells.length)];
        }
        if(this.cell !== null && this.targetCell !== null) {
            let posArr = aStarSearch(playBoard.boardObjects.boardObjects, this.cell, this.targetCell, 1);
            let [x, y] = posArr[0];
            this.tempcell = playBoard.boardObjects.getCell(x, y);
            this.targetX = playBoard.CellIndex2Pos(p5, x, y, p5.CENTER)[0];
            this.targetY = playBoard.CellIndex2Pos(p5, x, y, p5.CENTER)[1];
            if (this.x !== this.targetX || this.targetY !== this.targetY) {
                this.x = this.x + (this.targetX - this.x) * 0.1;
                this.y = this.y + (this.targetY - this.y) * 0.1;
                // otherwise they will never be the same
                if(Math.abs(this.x - this.targetX) < 0.1 && Math.abs(this.y - this.targetY) < 0.1) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.cell = this.tempcell;
                    this.moved = true;
                }
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
        //this.moveAndInvokeStorm(playBoard);
    }

    lerpX(start, end, t) {
        return start + (end - start) * t;
    }

    lerpY(start, end, t) {
        return start + (end - start) * t;
    }


}