import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {FloatingWindow} from "../FloatingWindow.js";
import {Bandit, Lumbering} from "../../items/Bandit.js";
import {Tornado} from "../../items/Tornado.js";

export class Tornado3PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.TORNADO;
        this.stageNumbering = "1-3";
        // grid parameters
        this.gridSize = 6;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 6;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.setItemOfInventory(p5, "Tree", 1);
        this.gameState.inventory.setItemOfInventory(p5, "Bush", 1);
        this.gameState.inventory.setItemOfInventory(p5, "Grass", 1);
        this.gameState.inventory.setItemOfInventory(p5, "TreeSeed", 2);
        this.gameState.inventory.setItemOfInventory(p5, "BushSeed", 2);
        this.gameState.inventory.setItemOfInventory(p5, "GrassSeed", 1);
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe(p5));
            }
        }
        this.boardObjects.setCell(2, 2, new Mountain(p5));
        this.boardObjects.setCell(2, 3, new Mountain(p5));
        this.boardObjects.setCell(3, 2, new Mountain(p5));
        this.boardObjects.setCell(3, 3, new Mountain(p5));
        this.boardObjects.setCell(4, 4, new PlayerBase(p5));
        this.boardObjects.setCell(5, 4, new Mountain(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
        this.boardObjects.setCell(1, 1, new Lumbering(p5));
    }

    nextTurnItems(p5) {
        if (this.turn === 2) {
            Bandit.createNewBandit(p5, this, 1, 2);
            Tornado.createNewTornado(p5, this, 0, 4, 'd');
        }
        if (this.turn === 3) {
            Tornado.createNewTornado(p5, this, 0, 5, 'd');
        }
        if (this.turn === 4) {
            Tornado.createNewTornado(p5, this, 4, 0, 'r');
        }
        if (this.turn === 5) {
            Tornado.createNewTornado(p5, this, 0, 5, 'd');
        }
    }

    modifyBoard(p5, code) {
    }

    setFloatingWindow(p5) {
        if (this.turn === 1) {
            if (this.allFloatingWindows.has("100")) {
                this.floatingWindow = this.allFloatingWindows.get("100");
                this.allFloatingWindows.delete("100");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("100") && this.allFloatingWindows.has("101")) {
                this.floatingWindow = this.allFloatingWindows.get("101");
                this.allFloatingWindows.delete("101");
                return;
            }
        }
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

        afw.set("100", new FloatingWindow(p5, null, "{white:The game begins here. Try to save as much resource}\\{white:as you could, to make it through later stages!}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new FloatingWindow(p5, null, "{red:Multiple tornadoes alert:}\\{white:top left area...}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        this.allFloatingWindows = afw;
    }
}