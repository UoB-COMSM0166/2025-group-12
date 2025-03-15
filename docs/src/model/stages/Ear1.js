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
import {baseType, enemyTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Earthquake, Hill, Landslide} from "../../items/Earthquake.js";
import {plantEnemyInteractions} from "../../items/PlantEnemyInter.js";
import {Enemy} from "../../items/Enemy.js";
import {EarthquakePlayBoard} from "./EarthquakePlayboard.js";

export class Earthquake1PlayBoard extends EarthquakePlayBoard {
    constructor(gameState) {
        super(gameState);
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
                    if (j === 0) {
                        this.boardObjects.setCell(i, j, new Hill(p5, true));
                    } else {
                        this.boardObjects.setCell(i, j, new Hill(p5));
                    }
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

    nextTurnItems(p5) {
        this.setAndResolveCounter(p5);

        if (this.turn === 2 || this.turn === 4 || this.turn === 6 || this.turn === 8 || this.turn === 10) {
            Earthquake.createNewEarthquake(p5, this);
        }

        if (this.turn === 3 || this.turn === 5 || this.turn === 7 || this.turn === 9 || this.turn === 11) {
            this.generateSlide(p5);
        }

        // spread bamboo after generating slide
        for (let cwp of this.boardObjects.getAllCellsWithPlant()) {
            if(cwp.plant.plantType === plantTypes.BAMBOO){
                this.spreadBamboo(p5, cwp);
            }
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