import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {enemyTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Plum, Snowfield} from "../../items/Blizzard.js";

export class BlizzardPlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.BLIZZARD;

        // snowfield prototype cells
        this.snowfields = [];
    }

    // we will need to reset snowfield if plum dies.
    resetSnowfield(p5) {
        for (let cell of this.snowfields) {
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
