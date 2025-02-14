import { stageCode } from "../GameState.js";
import { PlayBoard } from "../Play.js";
import { myutil } from "../../../lib/myutil.js";
import { BoardCells } from "../BoardCells.js";
import { Steppe } from "../../items/Steppe.js";
import { PlayerBase } from "../../items/PlayerBase.js";
import { Mountain } from "../../items/Mountain.js";
import { Storm } from "../../items/Storm.js";

export class Stage1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageCode = stageCode.STAGE1;
        // grid parameters
        this.gridSize = 6;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 7;
    }

    // set stage inventory at entering, called by controller
    setStageInventory() {
        this.gameState.inventory.pushItem2Inventory("Tree", 3);
        this.gameState.inventory.pushItem2Inventory("Bush", 3);
        this.gameState.inventory.pushItem2Inventory("Grass", 3);
        // update inventory height
        this.gameState.inventory.updateInventoryHeight();
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe());
            }
        }
        this.boardObjects.setCell(4, 4, new PlayerBase());
        this.boardObjects.setCell(4, 5, new Mountain());
        this.boardObjects.setCell(5, 5, new Mountain());
    }

    nextTurnEnemies(p5) {
        if (this.turn === 1) {
            Storm.createNewStorm(p5, this, 3, 3, 'd');
            Storm.createNewStorm(p5, this, 2, 3, 'u');
            Storm.createNewStorm(p5, this, 3, 2, 'r');
        } else if (this.turn === 2) {
            Storm.createNewStorm(p5, this, 2, 2, 'u');
        } else if (this.turn === 3) {
            Storm.createNewStorm(p5, this, 1, 1, 'r');
        }
    }
}