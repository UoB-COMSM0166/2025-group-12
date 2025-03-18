import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Blizzard, Plum, Snowfield} from "../../items/Blizzard.js";
import {BlizzardPlayBoard} from "./BlizzardPlayboard.js";
import {Bandit} from "../../items/Bandit.js";
import {Tornado} from "../../items/Tornado.js";

export class Blizzard1PlayBoard extends BlizzardPlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageNumbering = "4-1";
        // grid parameters
        this.gridSize = 10;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 15;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.pushItem2Inventory(p5, "Plum", 2);
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Snowfield(p5));
                this.snowfields.push(this.boardObjects.getCell(i, j));
            }
        }
        this.boardObjects.setCell(8, 8, new PlayerBase(p5));
    }

    nextTurnItems(p5) {
        this.resetSnowfield(p5);

        if (this.turn === 2) {
            Blizzard.createNewBlizzard(p5, this, 4, 4, 0);
        }
        if (this.turn === 3) {
            Tornado.createNewTornado(p5, this, 3, 0, 'r');
        }
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
