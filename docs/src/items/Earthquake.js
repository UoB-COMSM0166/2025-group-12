import {baseType, enemyTypes, itemTypes, plantTypes, terrainTypes} from "./ItemTypes.js";
import {Enemy} from "./Enemy.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {Terrain} from "./Terrain.js";
import {Seed} from "./Seed.js";
import {Plant} from "./Plant.js";

export class Earthquake extends Enemy {
    constructor() {
        super(-1, -1);
        this.name = "Earthquake";
        this.enemyType = enemyTypes.EARTHQUAKE;

        this.status = true;

        this.isMoving = false;
        this.hasMoved = true;
        this.isShaking = false;
    }

    draw(p5) {

    }

    static createNewEarthquake(p5, playBoard) {
        let earthquake = new Earthquake();
        playBoard.movables.push(earthquake);
    }

    movements(p5, playBoard) {
        if (!this.status || this.hasMoved) {
            return false;
        }
        // end movement
        if (this.isMoving && !this.isShaking) {
            this.isMoving = false;
            this.hasMoved = true;
            this.status = false;
            this.hit(p5, playBoard);
            plantEnemyInteractions.findEnemyAndDelete(playBoard, this);
            return false;
        }
        // during movement
        if (this.isMoving && this.isShaking) {
            this.shake(p5);
            return true;
        }
        // before movement
        this.isMoving = true;
        this.isShaking = true;
        this.shakeDuration = 60;
        this.startFrame = p5.frameCount;
        return true;
    }

    shake(p5) {
        let shakeAmount = 10;
        let shakeX = p5.random(-shakeAmount, shakeAmount);
        let shakeY = p5.random(-shakeAmount, shakeAmount);
        p5.translate(shakeX, shakeY);

        // Stop shaking after a duration
        if (p5.frameCount > this.startFrame + this.shakeDuration) {
            this.isShaking = false;
        }
    }

    // deal damage to all trees
    hit(p5, playBoard) {
        for (let cwp of playBoard.boardObjects.getAllCellsWithPlant()) {
            if (baseType(cwp.plant) === plantTypes.TREE) {
                plantEnemyInteractions.plantIsAttacked(playBoard, cwp.plant, 1);
            }
        }
    }

}

export class Hill extends Terrain{
    constructor(p5, canSlide = false) {
        super();
        this.name = "Hill";
        this.color = "black";
        this.terrainType = terrainTypes.HILL;
        this.img = p5.images.get(`${this.name}`);

        this.canSlide = canSlide;
    }

    getWeight() {
        return 20;
    }
}

export class Landslide extends Terrain{
    constructor(p5) {
        super();
        this.name = "Landslide";
        this.color = "black";
        this.terrainType = terrainTypes.LANDSLIDE;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 1000;
    }
}