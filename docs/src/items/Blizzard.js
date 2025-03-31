import {Plant} from "./Plant.js";
import {Terrain} from "./Terrain.js";
import {enemyTypes, plantTypes, seedTypes, terrainTypes} from "./ItemTypes.js";
import {Seed} from "./Seed.js";
import {Enemy} from "./Enemy.js";
import {myutil} from "../../lib/myutil.js";
import {PlayBoard} from "../model/Play.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";

export class Blizzard extends Enemy {
    constructor(p5, playBoard, countdown = 0) {
        super(-1, -1);
        this.name = "Blizzard";
        this.enemyType = enemyTypes.BLIZZARD;
        this.status = true;

        this.playBoard = playBoard;

        this.cell = null;
        this.countdown = countdown;
        this.isMoving = false;
        this.hasMoved = true;

        this.playAnimation = 0;

        if (this.countdown > 0) {
            this.img = p5.images.get("Alert");
        } else {
            this.img = p5.images.get(`${this.name}`);
        }
    }

    draw(p5) {
        let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
        // draw 9 images
        let cells = this.playBoard.boardObjects.getAdjacent8Cells(this.cell.x, this.cell.y);
        cells.push(this.cell);

        for (let cell of cells) {
            let [avgX, avgY] = myutil.cellIndex2Pos(p5, this.playBoard, cell.x, cell.y, p5.CENTER);
            p5.image(this.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
        }
    }

    static createNewBlizzard(p5, playBoard, i, j, countdown = 0) {
        let blizzard = new Blizzard(p5, playBoard, countdown);
        playBoard.movables.push(blizzard);
        blizzard.cell = playBoard.boardObjects.getCell(i, j);
    }

    movements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('movements of Blizzard has received invalid PlayBoard.');
            return false;
        }
        if (!this.status) {
            return false;
        }
        // end movement
        if (this.isMoving && this.playAnimation >= 100) {

            let cells = this.playBoard.boardObjects.getAdjacent8Cells(this.cell.x, this.cell.y);
            cells.push(this.cell);
            for (let cell of cells) {
                this.hit(p5, cell);
            }

            this.isMoving = false;
            this.hasMoved = true;
            plantEnemyInteractions.findMovableAndDelete(playBoard, this);
            return true;
        }
        // during movement
        if (this.isMoving && this.playAnimation < 100) {
            // play animation placeholder
            this.playAnimation += 5;
            return true;
        }
        // before movement
        if (this.countdown > 0) {
            this.countdown--;
            this.hasMoved = true;
            if (this.countdown <= 1) this.img = p5.images.get(`${this.name}`);
            return false;
        }
        if (this.countdown === 0) {
            this.isMoving = true;
            this.img = p5.images.get(`${this.name}`);
            return true;
        }
    }

    hit(p5, cell) {
        if (cell.ecosystem?.withstandSnow) return;

        if (cell.plant) plantEnemyInteractions.plantIsAttacked(this.playBoard, cell.plant, 1);

        if (cell.seed) plantEnemyInteractions.plantIsAttacked(this.playBoard, cell.seed, 1);
    }

    stringify() {
        const object = {
            enemyType: this.enemyType,
            countdown: this.countdown,
            cellX: this.cell?.x,
            cellY: this.cell?.y,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, playBoard) {
        const object = JSON.parse(json);
        let blizzard = new Blizzard(p5, playBoard, object.countdown);
        blizzard.cell = playBoard.boardObjects.getCell(object.cellX, object.cellY);
        return blizzard;
    }

}

export class Snowfield extends Terrain {
    constructor(p5) {
        super();
        this.name = "Snowfield";
        this.terrainType = terrainTypes.SNOWFIELD;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 0;
    }
}

export class Plum extends Plant {
    constructor(p5) {
        super();
        this.name = "Plum";
        this.color = "rgb(222,111,161)";
        this.plantType = plantTypes.PLUM;
        this.img = p5.images.get(`${this.name}`);

        this.seed = PlumSeed;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;
    }

    getPassiveString() {
        return "Dissolve nearby snowfield.";
    }

    getActiveString() {
        return "No active skill.";
    }

    reevaluateSkills(playBoard, cell) {

    }

    stringify() {
        const object = {
            plantType: this.plantType,
            health: this.health,
        }
        if (this.earthCounter) object.earthCounter = this.earthCounter;
        if (this.coldCounter) object.coldCounter = this.coldCounter;
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let plum = new Plum(p5);
        plum.health = object.health;
        plum.earthCounter = object.earthCounter;
        plum.coldCounter = object.coldCounter;
        return plum;
    }

    static plumRange(i0, j0, i1, j1) {
        return myutil.manhattanDistance(i0, j0, i1, j1) <= 2 && myutil.euclideanDistance(i0, j0, i1, j1) <= 2;
    }
}

export class PlumSeed extends Seed {
    constructor(p5) {
        super();
        this.name = "PlumSeed";
        this.color = "rgb(222,111,161)";
        this.seedType = seedTypes.PLUM;
        this.countdown = 2;
        this.img = this.img = p5.images.get("Seed");
    }

    grow(p5) {
        this.countdown--;
        if (this.countdown === 0) {
            return new Plum(p5);
        } else {
            return this;
        }
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let plumSeed = new PlumSeed(p5);
        plumSeed.countdown = object.countdown;
        return plumSeed;
    }
}
