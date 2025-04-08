import {stageGroup} from "../GameState.js";
import {movableTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Plum, Snowfield} from "../../items/Blizzard.js";
import {EarthquakePlayBoard} from "./EarthquakePlayboard.js";

export class BlizzardPlayBoard extends EarthquakePlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.BLIZZARD;

        // snowfield prototype cells
        this.snowfields = [];
    }

    // we will need to reset snowfield if plum dies.
    resetSnowfield(p5, playBoard) {
        for (let index of this.snowfields) {
            let cell = playBoard.boardObjects.getCell(index[0], index[1]);
            let hasPlum = false;
            for (let nCell of this.boardObjects.getNearbyCells(cell.x, cell.y, Plum.plumRange)) {
                if (nCell.plant?.plantType === plantTypes.PLUM) {
                    hasPlum = true;
                    break;
                }
            }
            if (!hasPlum) {
                cell.terrain = new Snowfield(p5);
            }
        }
    }
}
