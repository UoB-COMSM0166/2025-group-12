import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {stateCode, stageCode} from "./GameState.js";
import {BoardCells} from "./BoardCells.js";
import {Seed} from "../items/Seed.js";
import {Plant} from "../items/Plant.js";
import {InfoBox} from "./InfoBox.js";
import {PlantActive} from "../items/PlantActive.js";
import {plantTypes} from "../items/ItemTypes.js";

export class PlayBoard {
    constructor(gameState) {
        this.gameState = gameState;
        this.stageCode = stageCode.NO_STAGE;
        this.canvasWidth = CanvasSize.getSize()[0];
        this.canvasHeight = CanvasSize.getSize()[1];

        // transformation parameters
        this.Sx = 0.5;
        this.Sy = 0.5;
        this.rot = Math.PI / 6;
        this.span = 2 * Math.PI / 3;
        this.Hy = 1;

        // grid parameters
        this.gridSize = 8;
        this.cellWidth = myutil.relative2absolute(1 / 16, 1 / 9)[0];
        this.cellHeight = myutil.relative2absolute(1 / 16, 1 / 9)[1];

        this.buttons = [];

        // store all enemies
        this.enemies = [];

        // board objects array and information box
        this.boardObjects = new BoardCells(this.gridSize);
        this.selectedCell = [];
        this.infoBox = new InfoBox(this);

        // to store the items at the start of each stage,
        // so when you quit we can reset inventory
        this.tmpInventoryItems = new Map();

        // turn counter
        this.turn = 1;
        this.maxTurn = 10;

        // to implement plant active skills.
        // I have a strong feeling that we need refactoring
        this.awaitCell = false;

        this.floatingWindow = null;
        this.allFloatingWindows = null;

        this.isGameOver = false;
    }

    /* public methods */

    setup(p5) {
        // escape button
        let [escX, escY] = myutil.relative2absolute(0.01, 0.01);
        let [escWidth, escHeight] = myutil.relative2absolute(0.09, 0.07);
        let escapeButton = new Button(escX, escY, escWidth, escHeight, "Escape");
        escapeButton.onClick = () => {
            this.gameState.setState(stateCode.STANDBY);
        };

        // turn button
        let [turnWidth, turnHeight] = myutil.relative2absolute(5 / 32, 0.07);
        let [turnX, turnY] = myutil.relative2absolute(0.5, 0.01);
        let turnButton = new Button(turnX - turnWidth / 2, turnY, turnWidth, turnHeight, this.getTurnButtonText());
        turnButton.onClick = () => {
            this.enemies.sort((a, b) => a.enemyType - b.enemyType);
            this.gameState.setPlayerCanClick(false);
        }

        this.buttons.push(escapeButton, turnButton);

        // a keyboard shortcut to activate plant skill
        window.addEventListener("keyup", (event) => {
            if (event.key === "e" && this.infoBox.activateButton !== null) {
                this.infoBox.activateButton._onClick(p5);
            }
        })

        // setup stage terrain
        this.setStageTerrain(p5);

        // initialized all fw
        this.initAllFloatingWindows(p5);
    }

    handleScroll(event) {
        this.gameState.inventory.handleScroll(event);
    }

    // a hodgepodge.
    // handles clicks, or refuse to handle a click, according to priority:
    // 1. floating window
    // 2. plant active skill target
    // 3. buttons
    // 4. info box arrow
    // 5. inventory items
    handleClick(p5) {

        if (this.handleFloatingWindow()) {
            return;
        }

        // when activate button is clicked, system awaits a cell input
        if (this.awaitCell) {
            let index = myutil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
            if (index[0] === -1) {
                console.log("invalid target.");
            } else {
                let spellCaster = this.boardObjects.getCell(this.selectedCell[0], this.selectedCell[1]);
                let target = this.boardObjects.getCell(index[0], index[1]);
                if (spellCaster.plant.plantType === plantTypes.TREE) {
                    PlantActive.rechargeHP(spellCaster, target, 1);
                } else if (spellCaster.plant.plantType === plantTypes.GRASS) {
                    PlantActive.sendAnimalFriends(spellCaster, target, this);
                }
            }
            this.awaitCell = false;
        }

        // click any button
        for (let button of this.buttons) {
            if (button.mouseClick(p5) && button === this.infoBox.activateButton) {
                return;
            }
        }

        // clicked info box arrows when info box exists
        if(this.infoBox.handleClickArrow(p5, this)){return;}

        // inventory and planting
        this.handlePlanting(p5);

        // click any grid cell to display info box
        this.clickedCell(p5);
    }

    draw(p5) {
        p5.background(180);

        if (this.gameState.inventory.selectedItem !== null) {
            p5.cursor('grab');
        } else if (this.awaitCell) {
            p5.cursor('pointer');
        } else {
            p5.cursor(p5.ARROW);
        }

        // draw stage grid
        this.drawGrid(p5);

        // left bottom corner info box
        if (this.selectedCell.length !== 0) {
            this.infoBox.draw(p5, this);
        }

        // draw plants according to board objects
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                let plant = cell.plant;
                let seed = cell.seed;
                if (plant !== null) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(plant.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                    myutil.drawHealthBar(p5, plant, avgX - 21, avgY - 42, 40, 5);
                }
                if (seed !== null) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(seed.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                }
            }
        }

        // draw all enemies according to this.enemies
        for (let enemy of this.enemies) {
            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            p5.image(enemy.img, enemy.x - imgSize / 2, enemy.y - imgSize, imgSize, imgSize);
            myutil.drawHealthBar(p5, enemy, enemy.x - 20, enemy.y - 50, 40, 5);
        }

        // draw inventory
        this.gameState.inventory.draw(p5, this.canvasWidth, this.canvasHeight);

        // all buttons
        // to cascade activate button above info box, place this loop after info box
        for (let button of this.buttons) {
            if (!(this.turn === this.maxTurn + 1 && button.text.startsWith("turn"))) {
                button.draw(p5);
            }
        }

        // draw floating window
        this.setFloatingWindow(p5);
        if (this.floatingWindow !== null) {
            if (this.floatingWindow.isFading) {
                this.floatingWindow.fadeOut();
                if (this.floatingWindow.hasFadedOut()) {
                    this.floatingWindow = null;
                } else {
                    this.floatingWindow.draw();
                }
            } else {
                this.floatingWindow.draw();
            }
        }
    }

    /* ----------------------------------- */
    /* ----------------------------------- */
    /* ----------------------------------- */
    /* ----------------------------------- */
    /* below can be treated as black boxes */
    /* ----------------------------------- */
    /* ----------------------------------- */
    /* ----------------------------------- */
    /* ----------------------------------- */

    drawGrid(p5) {
        p5.stroke(0);
        p5.strokeWeight(2);
        let img = p5.images.get("ground");

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let [x1, y1, x2, y2, x3, y3, x4, y4] = myutil.cellIndex2Pos(p5, this, i, j, p5.CORNERS);
                p5.image(img, x1 - this.cellWidth / 2, y1, this.cellWidth, this.cellHeight);

                if (this.boardObjects.getCell(i, j).isEcoSphere) {
                    p5.fill('rgba(0%, 0%, 100%, 0.5)');
                } else {
                    p5.fill(0, 0, 0, 0);
                }
                p5.stroke(0);
                p5.strokeWeight(2);
                p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
            }
        }
        p5.strokeWeight(0);

        // terrain images
        for (let i = this.gridSize - 1; i >= 0; i--) {
            for (let j = this.gridSize - 1; j >= 0; j--) {
                let cell = this.boardObjects.getCell(i, j);
                if (cell.terrain.name === "Steppe") continue;
                let [x1, y1] = myutil.cellIndex2Pos(p5, this, i, j, p5.CORNER);
                p5.image(cell.terrain.img, x1 - this.cellWidth / 4, y1, this.cellWidth / 2, this.cellHeight / 2);
            }
        }
    }

    // set the clicked cell to draw info box
    clickedCell(p5) {
        let index = myutil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
        if (index[0] === -1) {
            this.selectedCell = [];
        } else {
            this.selectedCell = [index[0], index[1]];
            // a shortcut to direct to plant active skill page
            let cell = this.boardObjects.getCell(index[0], index[1]);
            if (cell.plant !== null && cell.plant.hasActive) {
                this.infoBox.setStatus(p5, 'a');
            }
        }
    }

    // when floating window is on, click anywhere to disable it.
    handleFloatingWindow() {
        if (this.floatingWindow !== null) {
            // game over
            if (!this.allFloatingWindows.has("001")) {
                this.gameState.setState(stateCode.STANDBY);
                return true;
            }
            // game clear
            if (!this.allFloatingWindows.has("000")) {
                this.gameState.setState(stateCode.FINISH);
                return true;
            }
            // common floating windows
            if (!this.floatingWindow.isFading) {
                this.floatingWindow.isFading = true;
            }
            if (!this.floatingWindow.playerCanClick) {
                return true;
            }
        }
        return false;
    }

    handlePlanting(p5) {
        let index = myutil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
        // clicked an item from inventory, then clicked a cell:
        if (this.gameState.inventory.selectedItem !== null && index[0] !== -1) {
            if (this.boardObjects.plantCell(index[0], index[1], this.gameState.inventory.createItem(p5, this.gameState.inventory.selectedItem))) {
                console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${index[0]}, col ${index[1]}`);

                // set plant's skill
                this.reevaluatePlantSkills();

                // remove item from inventory
                this.gameState.inventory.itemDecrement();
                return;
            }
        }

        // clicked item from inventory or clicked somewhere else:
        // handle inventory clicks later to prevent unintentional issues
        this.gameState.inventory.handleClick(p5);
    }

    // end turn enemy activities
    enemyMovements(p5) {
        // if game over, set player can click so controller stops handling movement
        if (this.isGameOver) {
            this.gameState.setPlayerCanClick(true);
            return;
        }
        for (let enemy of this.enemies) {
            if (enemy.enemyMovements(p5, this) === true) {
                return; // enemies will move one after one instead of moving simultaneously
            }
            // delete dead enemy, a safe-lock
            if (!enemy.status) {
                let index = this.enemies.indexOf(enemy);
                if (index !== -1) {
                    this.enemies.splice(index, 1);
                }
            }
        }
        // when game is not cleared, go to end turn stuff
        if (this.turn < this.maxTurn + 1) {
            this.endTurnActivity(p5);
        }
    }

    // miscellaneous end turn settings
    endTurnActivity(p5) {

        // remove dead plants and reset plant skill
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            // a safe-lock to remove all dead plants
            if (cell.plant.status === false) {
                this.boardObjects.removePlant(cell.x, cell.y);
            }
            // reset active skill status
            if (cell.plant.hasActive) {
                cell.plant.useLeft = cell.plant.maxUse;
            }
        }

        // reevaluate plants' skills
        this.reevaluatePlantSkills();

        // update seed status
        let cellsWithSeed = this.boardObjects.getAllCellsWithSeed();
        for (let cws of cellsWithSeed) {
            let grown = cws.seed.grow(p5);
            if (grown instanceof Seed) {
                cws.seed = grown;
            } else if (grown instanceof Plant) {
                cws.removeSeed();
                cws.plant = grown;
            }
        }

        // set turn and counter
        this.turn++;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();
        if (this.turn === this.maxTurn + 1) {

            // when a stage is cleared:
            // 1. store all living plants, this comes after seeds have grown
            let cellsWithPlant = this.boardObjects.getAllCellsWithPlant();
            for (let cws of cellsWithPlant) {
                this.gameState.inventory.pushItem2Inventory(p5, cws.plant.name, 1);
            }

            // 2. remove all seeds from inventory
            this.gameState.inventory.removeAllSeeds();

            // 3. set current stage cleared
            this.gameState.setStageCleared(this);

            // 4. reset action listener
            this.gameState.setPlayerCanClick(true);

            return;
        }

        // reset enemy status
        for (let enemy of this.enemies) {
            if (enemy.name === 'Mob') {
                enemy.moved = false;
                enemy.chosen = false;
            }
            if (enemy.hasMoved !== undefined) {
                enemy.hasMoved = false;
            }
        }

        // set next turn enemies and new inventory items
        this.nextTurnItems(p5);

        // set action listener active
        this.gameState.setPlayerCanClick(true);
    }

    // when a new plant is placed or removed,
    // we need to verify all plant's skill status.
    reevaluatePlantSkills() {
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            cell.plant.reevaluateSkills(this, cell);
        }
    }

    // this does not activate skill immediately, but go to awaiting status
    activatePlantSkill(p5) {
        let spellCaster = this.boardObjects.getCell(this.selectedCell[0], this.selectedCell[1]);
        if (spellCaster.plant.type === plantTypes.TREE || spellCaster.plant.type === plantTypes.GRASS) {
            this.awaitCell = true;
        }
    }

    nextTurnItems(p5) {
        console.log("nextTurnEnemies is not overridden!");
    }

    setFloatingWindow(p5) {
        console.log("setFloatingWindow is not overridden!");
    }

    initAllFloatingWindows(p5) {
        console.log("initAllFloatingWindows is not overridden!");
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        console.log("setStageInventory is not overridden!");
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        console.log("setStageTerrain is not overridden!");
    }

    getTurnButtonText() {
        return `turn ${this.turn} in ${this.maxTurn}`;
    }
}
