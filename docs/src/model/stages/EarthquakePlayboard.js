import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {baseType, enemyTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Bamboo} from "../../items/Bamboo.js";
import {SlideAnimation} from "../../items/SlideAnimation.js";

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

        this.movables.push(new SlideAnimation(this.boardObjects.getCell(cell.x, cell.y), this.boardObjects.getCell(cell.x, 5)));
    }
}