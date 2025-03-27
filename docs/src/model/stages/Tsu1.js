import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Sea} from "../../items/Sea.js";
import {TsunamiAnimation} from "../../items/TsunamiAnimation.js";

export class Tsunami1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.TSUNAMI;
        this.stageNumbering = "5-1";
        // grid parameters
        this.gridSize = 16;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 20, 4 / 45);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 30;

        // record fertilized cells -- only this stage
        this.fertilized = Array.from({length: this.gridSize},
            () => Array.from({length: this.gridSize}, () => false));
    }

    setSeedCountdown(x, y) {
        let cell = this.boardObjects.getCell(x, y);
        if (cell.seed && this.fertilized[x][y]) {
            cell.seed.countdown = 1;
        }
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.setItemOfInventory(p5, "TreeSeed", 2);
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (j >= 8) {
                    this.boardObjects.setCell(i, j, new Steppe(p5));
                } else {
                    this.boardObjects.setCell(i, j, new Sea(p5));
                }
            }
        }
        this.boardObjects.setCell(8, 15, new PlayerBase(p5));
    }

    nextTurnItems(p5) {
        if(this.turn === 2) TsunamiAnimation.createNewTsunami(p5, this, 1, -1, 5);
    }

    modifyBoard(p5, code) {
    }

    setFloatingWindow(p5) {
        if (this.turn === this.maxTurn + 1) {
            if (this.allFloatingWindows.has("000")) {
                this.floatingWindow = this.allFloatingWindows.get("000");
                this.allFloatingWindows.delete("000");
                return;
            }
        }
    }

    initAllFloatingWindows(p5) {
        let afw = new Map();

        myutil.commonFloatingWindows(p5, afw);

        this.allFloatingWindows = afw;
    }
}
