import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {myutil} from "../../../lib/myutil.js";
import {BoardCells} from "../BoardCells.js";
import {Steppe} from "../../items/Steppe.js";
import {PlayerBase} from "../../items/PlayerBase.js";
import {Mountain} from "../../items/Mountain.js";
import {Tornado} from "../../items/Tornado.js";
import {Bandit} from "../../items/Bandit.js";
import {FloatingWindow} from "../FloatingWindow.js";
import {VolcanicBomb, Volcano} from "../../items/Volcano.js";

export class Volcano1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.VOLCANO;
        this.stageNumbering = "2-1";
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
        this.gameState.inventory.pushItem2Inventory(p5, "Tree", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "Bush", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "Grass", 2);
        this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 5);
        this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 5);
        this.gameState.inventory.pushItem2Inventory(p5, "GrassSeed", 5);
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe(p5));
            }
        }
        this.boardObjects.setCell(0, 0, new Volcano(p5));
        this.boardObjects.setCell(0, 1, new Volcano(p5));
        this.boardObjects.setCell(1, 0, new Volcano(p5));
        this.boardObjects.setCell(1, 1, new Volcano(p5));
        this.boardObjects.setCell(1, 2, new Volcano(p5));
        this.boardObjects.setCell(2, 1, new Volcano(p5));
        this.boardObjects.setCell(2, 2, new Volcano(p5));
        this.boardObjects.setCell(2, 0, new Volcano(p5));
        this.boardObjects.setCell(0, 2, new Volcano(p5));

        this.boardObjects.setCell(4, 4, new PlayerBase(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
    }

    nextTurnItems(p5) {
        //this.generateRandomVolBomb(p5);
        this.generateVolBomb(p5, 4,4);
        this.generateVolBomb(p5, 0,7);
    }

    generateRandomVolBomb(p5){
        let i1 = Math.floor(Math.random() * 3);
        let j1 = Math.floor(Math.random() * 3);
        let i2 = Math.floor(Math.random() * (this.gridSize - 3)) + 3;
        let j2 = Math.floor(Math.random() * (this.gridSize - 3)) + 3;
        while(i1-j1 === i2 - j2){
            i1 = Math.floor(Math.random() * 3);
            j1 = Math.floor(Math.random() * 3);
        }
        let [x1, y1] = myutil.cellIndex2Pos(p5, this, i1, j1, p5.CENTER);
        let [x2, y2] = myutil.cellIndex2Pos(p5, this, i2, j2, p5.CENTER);
        let bomb = new VolcanicBomb(p5, i1, j1, i2, j2, x1, y1, x2, y2);
        this.movables.push(bomb);
    }

    generateVolBomb(p5, i, j){
        let i1 = Math.floor(Math.random() * 3);
        let j1 = Math.floor(Math.random() * 3);
        while(i1-j1 === i - j){
            i1 = Math.floor(Math.random() * 3);
            j1 = Math.floor(Math.random() * 3);
        }
        let [x1, y1] = myutil.cellIndex2Pos(p5, this, i1, j1, p5.CENTER);
        let [x2, y2] = myutil.cellIndex2Pos(p5, this, i, j, p5.CENTER);
        let bomb = new VolcanicBomb(p5, i1, j1, i, j, x1, y1, x2, y2);
        this.movables.push(bomb);
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
