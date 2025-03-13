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
import {Lava, VolcanicBomb, Volcano} from "../../items/Volcano.js";
import {enemyTypes, terrainTypes} from "../../items/ItemTypes.js";
import {plantEnemyInteractions} from "../../items/PlantEnemyInter.js";

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

        this.gameState.inventory.pushItem2Inventory(p5, "FireHerb", 5);
        this.gameState.inventory.pushItem2Inventory(p5, "FireHerbSeed", 5);
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

        this.boardObjects.setCell(8, 8, new PlayerBase(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
    }

    nextTurnItems(p5) {
        this.generateRandomVolBomb(p5);
        this.generateVolBomb(p5, 8, 8);

        if (this.turn === 2) {
            this.generateLava(p5, 3, 3);
            this.generateLava(p5, 3, 2);
            this.generateLava(p5, 3, 1);
            this.generateLava(p5, 3, 0);
            this.generateLava(p5, 2, 3);
            this.generateLava(p5, 1, 3);
            this.generateLava(p5, 0, 3);
        }else{
            this.expandLava(p5);
        }
    }

    generateLava(p5, i, j) {
        let cell = this.boardObjects.getCell(i, j);
        let lava = new Lava(p5);
        lava.cell = cell;
        cell.terrain = lava;

        // kill plant and store its seed
        if (cell.plant !== null) {
            lava.storeSeed(p5, cell.plant);
            cell.removePlant();
        } else if (cell.seed !== null) {
            lava.storeSeed(p5, cell.seed);
            cell.removeSeed();
        }

        // kill bandit on this cell
        if (cell.enemy !== null && cell.enemy.enemyType === enemyTypes.BANDIT) {
            cell.enemy.status = false;
            plantEnemyInteractions.findMovableAndDelete(this, cell.enemy);
        }
    }

    expandLava(p5){
        // find all lava
        let cells = [];
        for(let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                if(cell.terrain.terrainType === terrainTypes.LAVA && cell.terrain.name === "Lava"){
                    cells.push(cell);
                }
            }
        }

        // expand them
        for (let cell of cells) {
            for (let adCell of this.boardObjects.getAdjacent4Cells(cell.x, cell.y)) {
                // if the cell is in ecosystem with 'rejectLava', skip.
                if(adCell.ecosystem !== null && adCell.ecosystem.rejectLava) continue;
                // if expands to player base, game over.
                if (adCell.terrain.terrainType === terrainTypes.BASE) {
                    myutil.gameOver(this);
                    return;
                }
                // it expands to normal terrain.
                if(adCell.terrain.terrainType === terrainTypes.STEPPE){
                    this.generateLava(p5, adCell.x, adCell.y);
                }
            }
        }

        // solidify lava
        for (let cell of cells) {
            cell.terrain.solidify(p5);
        }

    }

    generateRandomVolBomb(p5) {
        let i1 = Math.floor(Math.random() * 3);
        let j1 = Math.floor(Math.random() * 3);
        let i2 = Math.floor(Math.random() * (this.gridSize - 3)) + 3;
        let j2 = Math.floor(Math.random() * (this.gridSize - 3)) + 3;
        while (i1 - j1 === i2 - j2) {
            i1 = Math.floor(Math.random() * 3);
            j1 = Math.floor(Math.random() * 3);
        }
        let [x1, y1] = myutil.cellIndex2Pos(p5, this, i1, j1, p5.CENTER);
        let [x2, y2] = myutil.cellIndex2Pos(p5, this, i2, j2, p5.CENTER);
        let bomb = new VolcanicBomb(p5, i1, j1, i2, j2, x1, y1, x2, y2);
        this.movables.push(bomb);
    }

    generateVolBomb(p5, i, j) {
        let i1 = Math.floor(Math.random() * 3);
        let j1 = Math.floor(Math.random() * 3);
        while (i1 - j1 === i - j) {
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
        if (this.turn === 1) {
            if (this.allFloatingWindows.has("100")) {
                this.floatingWindow = this.allFloatingWindows.get("100");
                this.allFloatingWindows.delete("100");
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

        afw.set("100", new FloatingWindow(p5, "rc", "{white:You have more than 6 kind of items in your inventory. Scroll}\\{red:mouse wheel}{white: when your mouse is hovering over the inventory.}", {
            x: myutil.relative2absolute(0.6, 0.15)[0],
            y: myutil.relative2absolute(0.6, 0.15)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        this.allFloatingWindows = afw;
    }
}
