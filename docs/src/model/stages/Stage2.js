import {stageCode} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {Storm} from "../../items/Storm.js";
import {Bandit} from "../../items/Bandit.js";

export class Stage2PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageCode = stageCode.STAGE2;
        // grid parameters
        this.gridSize = 10;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 50;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.pushItem2Inventory(p5, "Tree", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Bush", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Grass", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "GrassSeed", 2);
        // update inventory height
        this.gameState.inventory.updateInventoryHeight();
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe(p5));
            }
        }
        this.boardObjects.setCell(4, 4, new PlayerBase(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
    }

    nextTurnEnemies(p5) {
        if (this.turn === 1) {
            Bandit.createNewBandit(p5, this, 0, 0);
            Storm.createNewStorm(p5, this, 0, 4, 'd');
        }
    }
}