import {stageCode, stateCode} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {Tornado} from "../../items/Tornado.js";
import {Mob} from "../../items/Mob.js";
import {Bandit} from "../../items/Bandit.js";
import {FloatingWindow} from "../FloatingWindow.js";
import {Bush} from "../../items/Bush.js";
import {Grass} from "../../items/Grass.js";

export class Tornado1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageCode = stageCode.TORNADO;
        // grid parameters
        this.gridSize = 6;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 4;
        this.hasActionPoints = false;

        this.allFloatingWindows = null; // Map<int code, fw>
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {

    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe(p5));
            }
        }
        this.boardObjects.setCell(4, 4, new PlayerBase(p5));
        this.boardObjects.setCell(4, 3, new Mountain(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 3, new Mountain(p5));
        this.boardObjects.setCell(5, 4, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
    }

    nextTurnItems(p5) {
        if (this.turn === 1) {
        } else if (this.turn === 2) {
            Tornado.createNewTornado(p5, this, 0, 4, 'd');
        } else if (this.turn === 3) {
            Tornado.createNewTornado(p5, this, 3, 0, 'r');
        }
    }

    modifyBoard(p5, code) {
        if (this.turn === 1) {
            if (code === 102) {
                Tornado.createNewTornado(p5, this, 0, 4, 'd');
                return;
            }
            if (code === 103) {
                this.boardObjects.plantCell(2, 4, new Bush(p5));
                this.boardObjects.plantCell(3, 4, new Grass(p5));
                return;
            }
        } else if (this.turn === 2) {
            if (code === 201) {
                this.gameState.inventory.pushItem2Inventory(p5, "Tree", 1);
            }
        }
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
            if (this.floatingWindow === null && !this.allFloatingWindows.has("101") && this.allFloatingWindows.has("102")) {
                this.modifyBoard(p5, 102);
                this.floatingWindow = this.allFloatingWindows.get("102");
                this.allFloatingWindows.delete("102");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("102") && this.allFloatingWindows.has("103")) {
                this.modifyBoard(p5, 103);
                this.floatingWindow = this.allFloatingWindows.get("103");
                this.allFloatingWindows.delete("103");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("103") && this.allFloatingWindows.has("104")) {
                this.floatingWindow = this.allFloatingWindows.get("104");
                this.allFloatingWindows.delete("104");
                return;
            }

        }
        if (this.turn === 2) {
            if (this.allFloatingWindows.has("200")) {
                this.floatingWindow = this.allFloatingWindows.get("200");
                this.allFloatingWindows.delete("200");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("200") && this.allFloatingWindows.has("201")) {
                this.modifyBoard(p5, 201);
                this.floatingWindow = this.allFloatingWindows.get("201");
                this.allFloatingWindows.delete("201");
                return;
            }
            if (this.floatingWindow === null && this.gameState.inventory.selectedItem !== null && !this.allFloatingWindows.has("201") && this.allFloatingWindows.has("202")) {
                this.floatingWindow = this.allFloatingWindows.get("202");
                this.allFloatingWindows.delete("202");
                return;
            }
        }
        if (this.turn === 3) {
            if (this.allFloatingWindows.has("300")) {
                this.floatingWindow = this.allFloatingWindows.get("300");
                this.allFloatingWindows.delete("300");
                return;
            }
        }
        if (this.turn === 4) {
            if (this.allFloatingWindows.has("400")) {
                this.floatingWindow = this.allFloatingWindows.get("400");
                this.allFloatingWindows.delete("400");
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

        afw.set("100", new FloatingWindow(p5, null, "{white: Welcome to the game.}\\ {white: Your goal is to protect your house by growing plants.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new FloatingWindow(p5, "uc", "{white:There is your house. It will be destroyed by}\\ {white:natural disasters if you do nothing.}", {
            x: myutil.relative2absolute(1 / 2, 2 / 3 + 0.01)[0],
            y: myutil.relative2absolute(1 / 2, 2 / 3 + 0.01)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("102", new FloatingWindow(p5, "ld", "{white:A tornado!}", {
            x: myutil.relative2absolute(0.67, 0.45)[0],
            y: myutil.relative2absolute(0.67, 0.45)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("103", new FloatingWindow(p5, "lu", "{white:We have prepared some plants}\\{white:to block its way.}", {
            x: myutil.relative2absolute(0.69, 0.52)[0],
            y: myutil.relative2absolute(0.69, 0.52)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("104", new FloatingWindow(p5, "uc", "{white:click the turn button and}\\{white:let's see what happens next.}", {
            x: myutil.relative2absolute(0.5, 0.16)[0],
            y: myutil.relative2absolute(0.5, 0.16)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("200", new FloatingWindow(p5, null, "{white:Your plants sacrificed their}\\{white:life to protect your house.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("201", new FloatingWindow(p5, "ru", "{white:You've been rewarded a}{red:Tree}\\{white:since you made through last assault.}\\{white:Now click the}{red:Tree}{white:.}", {
            x: myutil.relative2absolute(0.76, 0.11)[0],
            y: myutil.relative2absolute(0.76, 0.11)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("202", new FloatingWindow(p5, "lu", "{white:Click this cell to transplant it.}", {
            x: myutil.relative2absolute(0.64, 0.56)[0],
            y: myutil.relative2absolute(0.64, 0.56)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("300", new FloatingWindow(p5, "lu", "{white:Click this cell to check}\\{white:relevant information.}", {
            x: myutil.relative2absolute(0.64, 0.56)[0],
            y: myutil.relative2absolute(0.64, 0.56)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("400", new FloatingWindow(p5, null, "{white:All plants on the field alive at the end of}\\{white:each stage will be added to your inventory}\\{white:and you can transplant them in later stages.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        this.allFloatingWindows = afw;
    }
}