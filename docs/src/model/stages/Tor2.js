import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {Tornado} from "../../items/Tornado.js";
import {Bandit, Lumbering} from "../../items/Bandit.js";
import {FloatingWindow} from "../FloatingWindow.js";
import {plantTypes} from "../../items/ItemTypes.js";

export class Tornado2PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.TORNADO;
        this.stageNumbering = "1-2";
        // grid parameters
        this.gridSize = 6;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 5;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.setItemOfInventory(p5, "Tree", 1);
        this.gameState.inventory.pushItem2Inventory(p5, "Bush", 1);
        this.gameState.inventory.pushItem2Inventory(p5, "Grass", 1);
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

        this.boardObjects.setCell(0, 4, new Lumbering(p5));
    }

    nextTurnItems(p5) {}

    modifyBoard(p5, code) {
        if (code === 103) {
            Tornado.createNewTornado(p5, this, 1, 4, 'd');
            return;
        }
        if (code === 203) {
            this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 1);
            this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 1);
            this.gameState.inventory.pushItem2Inventory(p5, "GrassSeed", 1);
            return;
        }
        if (code === 204) {
            Bandit.createNewBandit(p5, this, 1, 4);
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
                let cell;
                for (let cwp of this.boardObjects.getAllCellsWithPlant()) {
                    if (cwp.plant.plantType === plantTypes.TREE) {
                        cell = cwp;
                        break;
                    }
                }
                if (!cell.plant.hasActive) return;
                this.floatingWindow = this.allFloatingWindows.get("200");
                this.allFloatingWindows.delete("200");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("200") && this.allFloatingWindows.has("201")) {
                this.floatingWindow = this.allFloatingWindows.get("201");
                this.allFloatingWindows.delete("201");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("201") && this.allFloatingWindows.has("202")) {
                let cell;
                for (let cwp of this.boardObjects.getAllCellsWithPlant()) {
                    if (cwp.plant.plantType === plantTypes.TREE) {
                        cell = cwp;
                        break;
                    }
                }
                if (!cell.plant.hasActive || cell.plant.useLeft === cell.plant.maxUse) return;
                this.floatingWindow = this.allFloatingWindows.get("202");
                this.allFloatingWindows.delete("202");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("202") && this.allFloatingWindows.has("203")) {
                this.modifyBoard(p5, 203);
                this.floatingWindow = this.allFloatingWindows.get("203");
                this.allFloatingWindows.delete("203");
                return;
            }
            if (this.floatingWindow === null && !this.allFloatingWindows.has("203") && this.allFloatingWindows.has("204")) {
                this.modifyBoard(p5, 204);
                this.floatingWindow = this.allFloatingWindows.get("204");
                this.allFloatingWindows.delete("204");
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

        afw.set("100", new FloatingWindow(p5, null, "{white:Hello again. In this stage we}\\ {white:explore more features of our game.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new FloatingWindow(p5, null, "{white:Remember: You may quit current game to start anytime.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("102", new FloatingWindow(p5, null, "{white:We have provided you with some new plants.}\\ {white:Plant them adjacent to make them stronger.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("103", new FloatingWindow(p5, null, "{white:Try transplant a tree first, then}\\ {white:a bush and a grass next to the tree.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("104", new FloatingWindow(p5, "ur", "{white:This is your action points. It means you can}\\ {white:transplant or sow up to 3 times every turn.}", {
            x: myutil.relative2absolute(0.85, 0.45)[0],
            y: myutil.relative2absolute(0.85, 0.45)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("200", new FloatingWindow(p5, null, "{white:Your plants are damaged. Click your tree.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("201", new FloatingWindow(p5, null, "{white:There is an activate button at bottom left box.}\\{white:Click it or press E, and then click your damaged plant.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("202", new FloatingWindow(p5, null, "{white:If you have transplanted your plants as expected, }\\ {white:they will form an ecosystem.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("203", new FloatingWindow(p5, null, "{white:Seeds sowed in the ecosystem grow faster.}\\ {white:Try to sow in and out the ecosystem.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("204", new FloatingWindow(p5, null, "{white:Now you have knowledge on the main features of our game.}\\ {white:Try to deal with that bandit who wants to chop your plants!}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("300", new FloatingWindow(p5, null, "{white:Only when different kind of plants are next to each other}\\ {white:then they get stronger! Try to figure out when will the skills emerge.}", {
            x: myutil.relative2absolute(1 / 2, 0.15)[0],
            y: myutil.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        this.allFloatingWindows = afw;
    }
}