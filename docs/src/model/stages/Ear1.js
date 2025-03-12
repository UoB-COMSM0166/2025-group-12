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
import {baseType, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Earthquake, Hill, Landslide} from "../../items/Earthquake.js";

export class Earthquake1PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.EARTHQUAKE;
        this.stageNumbering = "3-1";
        // grid parameters
        this.gridSize = 8;
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 15;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {

    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (j <= 1) {
                    this.boardObjects.setCell(i, j, new Hill(p5));
                } else {
                    this.boardObjects.setCell(i, j, new Steppe(p5));
                }
            }
        }
        this.boardObjects.setCell(3, 3, new PlayerBase(p5));
        this.boardObjects.setCell(4, 3, new PlayerBase(p5));
        this.boardObjects.setCell(3, 4, new PlayerBase(p5));
        this.boardObjects.setCell(4, 4, new PlayerBase(p5));

    }

    setAndResolveCounter(p5) {
        let cells = this.boardObjects.getAllCellsWithPlant();

        // increment counters.
        for (let cwp of cells) {
            if (cwp.plant.earthCounter === undefined) {
                cwp.plant.earthCounter = 1;
            } else {
                cwp.plant.earthCounter++;
            }
        }

        if (this.hasBamboo !== undefined && this.hasBamboo) return;

        // if a tree has a counter=10, insert bamboo into inventory.
        for (let cwp of cells) {
            if (cwp.plant.earthCounter >= 10 && baseType(cwp.plant) === plantTypes.TREE) {
                this.modifyBoard(p5, "bamboo");
                this.hasBamboo = true;
                break;
            }
        }
    }

    nextTurnItems(p5) {
        this.setAndResolveCounter(p5);

        if (this.turn === 2) {
            Earthquake.createNewEarthquake(p5, this);
        }

        if (this.turn === 3 || this.turn === 5 || this.turn === 7 || this.turn === 9 || this.turn === 11) {
            let r = Math.floor(Math.random() * this.boardObjects.size);
            this.slide(p5, this.boardObjects.getCell(r, 0), this.boardObjects.getCell(r, 3)).then();
        }
    }

    async slide(p5, cell, finalCell) {
        while (true) {
            // some terrain can block landslide
            if (cell instanceof Mountain) {
                return;
            }

            // kill plants and bandit on this cell:
            if (cell.plant !== null) cell.removePlant();
            else if (cell.seed !== null) cell.removeSeed();
            else if (cell.enemy instanceof Bandit) cell.enemy = null;

            // if cell is player base, game over.
            if (cell.terrain.terrainType === terrainTypes.BASE) {
                myutil.gameOver(this);
                return;
            }

            cell.terrain = new Landslide(p5);
            // place exit condition here to ensure final cell is included
            if (cell === finalCell) return;

            // find next cell
            let direction = [0, 0];
            if (finalCell.x - cell.x !== 0) {
                direction[0] = (finalCell.x - cell.x) / Math.abs(finalCell.x - cell.x);
            }
            if (finalCell.y - cell.y !== 0) {
                direction[1] = (finalCell.y - cell.y) / Math.abs(finalCell.y - cell.y);
            }
            if (direction[0] !== 0 && direction[1] !== 0) {
                direction[Math.floor(Math.random() * 2)] = 0;
            }
            cell = this.boardObjects.getCell(cell.x + direction[0], cell.y + direction[1]);

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    modifyBoard(p5, code) {
        if (code === "bamboo") {
            this.floatingWindow = this.allFloatingWindows.get("bamboo");
            this.allFloatingWindows.delete("bamboo");
            this.gameState.inventory.pushItem2Inventory(p5, "Bamboo", 1);
        }
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

        afw.set("bamboo", new FloatingWindow(p5, null, "{white:A bamboo is added to your inventory.}", {
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