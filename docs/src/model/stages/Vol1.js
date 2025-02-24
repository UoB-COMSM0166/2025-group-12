import {stageCode} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {Tornado} from "../../items/Tornado.js";
import {Bandit} from "../../items/Bandit.js";
import {FloatingWindow} from "../FloatingWindow.js";

export class Volcano1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageCode = stageCode.VOLCANO;
        // grid parameters
        this.gridSize = 10;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 5;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.pushItem2Inventory(p5, "Tree", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Bush", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Grass", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "GrassSeed", 2);
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

    nextTurnItems(p5) {
        if (this.turn === 2) {
            Tornado.createNewTornado(p5, this, 0, 0, 'd');
            Bandit.createNewBandit(p5, this, 0, 1);
        }
    }

    modifyBoard(p5, code) {}

    setFloatingWindow(p5) {
        if (this.turn === this.maxTurn + 1) {
            if (this.allFloatingWindows.has("000")) {
                this.floatingWindow = this.allFloatingWindows.get("000");
                this.allFloatingWindows.delete("000");
                return;
            }
        }
    }

    initAllFloatingWindows(p5){
        let afw = new Map();

        afw.set("000", new FloatingWindow(p5, null, "{white:Stage Cleared!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("001", new FloatingWindow(p5, null, "{white:Game Over}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("002", new FloatingWindow(p5, null, "{white:Out of Action Points!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        this.allFloatingWindows = afw;
    }
}