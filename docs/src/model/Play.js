import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {stateCode, stageGroup} from "./GameState.js";
import {BoardCells} from "./BoardCells.js";
import {Seed} from "../items/Seed.js";
import {Plant} from "../items/Plant.js";
import {InfoBox} from "./InfoBox.js";
import {PlantActive} from "../items/PlantActive.js";
import {enemyTypes, itemTypes, plantTypes} from "../items/ItemTypes.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {Screen} from "./Screen.js";
import {VolcanicBomb} from "../items/Volcano.js";

export class PlayBoard extends Screen {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.NO_STAGE;
        this.stageNumbering = "0-0";
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

        // store all movable objects including enemies
        // objects in this array MUST have boolean fields hasMoved and isMoving!!!!!
        this.movables = [];

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
        this.endTurn = false;
        // can place this number of plants every turn
        this.actionPoints = 3;
        this.maxActionPoints = 3;
        this.hasActionPoints = true;

        // to implement plant active skills.
        // I have a strong feeling that we need refactoring
        this.awaitCell = false;

        this.isGameOver = false;

        this.skip = false;
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
            this.movables.sort((a, b) => {
                if (a.enemyType !== undefined && b.enemyType !== undefined) {
                    return a.enemyType - b.enemyType;
                }
                if (a.enemyType !== undefined) return -1;
                if (b.enemyType !== undefined) return 1;
                return 0;
            });
            // set movable status
            for (let movable of this.movables) {
                movable.hasMoved = false;
            }
            // when game is not cleared, remember to deal with end turn stuff
            if (this.turn < this.maxTurn + 1) {
                this.endTurn = true;
            }
            // once player unable to click, controller will loop movables to check if there are anything has not moved
            this.gameState.setPlayerCanClick(false);
        }

        this.buttons.push(escapeButton, turnButton);

        // a keyboard shortcut to activate plant skill
        window.addEventListener("keyup", (event) => {
            // active skill
            if (event.key === "e" && this.infoBox.activateButton !== null) {
                this.infoBox.activateButton._onClick(p5);
            }
            // turn button
            if (event.key === " " && this.gameState.playerCanClick && this.floatingWindow === null) {
                this.buttons.find(b => b.text.startsWith("turn"))._onClick();
            }
            // to dev team: quick skip current stage
            if (event.key === "c" && !this.skip) {
                this.skip = true;
                this.stageClearSettings(p5);
                this.gameState.setState(stateCode.FINISH);
            }
            // info box arrows
            if (event.key === "a" && this.selectedCell.length !== 0) {
                this.infoBox.clickLeftArrow(p5);
            }
            if (event.key === "ArrowLeft" && this.selectedCell.length !== 0) {
                this.infoBox.clickLeftArrow(p5);
            }
            if (event.key === "d" && this.selectedCell.length !== 0) {
                this.infoBox.clickRightArrow(p5);
            }
            if (event.key === "ArrowRight" && this.selectedCell.length !== 0) {
                this.infoBox.clickRightArrow(p5);
            }
        });

        // setup stage terrain
        this.setStageTerrain(p5);

        // initialized all fw
        this.initAllFloatingWindows(p5);
    }

    handleScroll(event) {
        this.gameState.inventory.handleScroll(event);
    }

    handleClick(p5) {
        if (this.handleFloatingWindow()) {
            return;
        }

        this.handleActiveSkills(p5);

        // click any button
        for (let button of this.buttons) {
            if (button.mouseClick(p5) && button === this.infoBox.activateButton) {
                return;
            }
        }

        // clicked info box arrows when info box exists
        if (this.infoBox.handleClickArrow(p5, this)) {
            return;
        }

        // inventory item and planting
        this.handlePlanting(p5);

        // click any grid cell to display info box
        this.clickedCell(p5);
    }

    draw(p5) {
        p5.background(180);

        // set cursor style
        if (this.gameState.inventory.selectedItem !== null) {
            p5.cursor('grab');
        } else if (this.awaitCell) {
            p5.cursor('pointer');
        } else {
            p5.cursor(p5.ARROW);
        }

        // stage number text
        let [stageNumberingX, stageNumberingY] = myutil.relative2absolute(0.38, 0.04);
        p5.textSize(20);
        p5.fill('red');
        p5.noStroke();
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(this.stageNumbering, stageNumberingX, stageNumberingY);

        // draw stage grid
        this.drawGrid(p5);

        // left bottom corner info box
        if (this.selectedCell.length !== 0) {
            this.infoBox.draw(p5, this);
        }

        // draw plants according to board objects
        this.drawAllPlants(p5);

        // tornado arrows first
        for (let movable of this.movables) {
            if (!movable.isMoving && movable.type === itemTypes.ENEMY && movable.enemyType === enemyTypes.TORNADO) {
                let direction = movable.cell.enemy.direction;
                let x = movable.cell.enemy.x;
                let y = movable.cell.enemy.y;
                let angle;
                if (direction[0] === 0 && direction[1] === -1) {
                    angle = p5.radians(330); // Up-right
                } else if (direction[0] === 0 && direction[1] === 1) {
                    angle = p5.radians(150); // Down-left
                } else if (direction[0] === -1 && direction[1] === 0) {
                    angle = p5.radians(210); // Up-left
                } else if (direction[0] === 1 && direction[1] === 0) {
                    angle = p5.radians(30); // Down-right
                }
                let offset = 10;
                let dx = offset * Math.cos(angle);
                let dy = offset * Math.sin(angle);
                p5.push();
                p5.translate(x + dx, y + dy);
                p5.rotate(angle + p5.HALF_PI);
                p5.imageMode(p5.CENTER);
                p5.image(p5.images.get("alertArrow"), 0, 0, 30, 30);
                p5.pop();
            }
        }
        // draw all movables according to this.movables
        for (let movable of this.movables) {
            if (movable instanceof VolcanicBomb && !movable.isMoving) {
                movable.draw(p5);
                continue;
            }

            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            p5.image(movable.img, movable.x - imgSize / 2, movable.y - imgSize, imgSize, imgSize);
        }
        // health bar last
        for (let movable of this.movables) {
            if (movable.health !== undefined) {
                myutil.drawHealthBar(p5, movable, movable.x - 20, movable.y - 50, 40, 5);
            }
        }


        // draw inventory
        this.gameState.inventory.draw(p5, this.canvasWidth, this.canvasHeight);

        // draw action points
        myutil.drawActionPoints(p5, this);

        // all buttons
        // to cascade activate button above info box, place this loop after info box
        for (let button of this.buttons) {
            if (!(this.turn === this.maxTurn + 1 && button.text.startsWith("turn"))) {
                button.draw(p5);
            }
        }

        // if game over, set player can click to stop movables updating
        if (this.isGameOver && !this.gameState.playerCanClick) {
            this.gameState.setPlayerCanClick(true);
        }

        this.drawFloatingWindow(p5);
    }

    // ----------------------------------- //
    // ----------------------------------- //
    // ----------------------------------- //
    // ----------------------------------- //
    // below can be treated as black boxes //
    // ----------------------------------- //
    // ----------------------------------- //
    // ----------------------------------- //
    // ----------------------------------- //

    drawGrid(p5) {
        p5.stroke(0);
        p5.strokeWeight(2);
        let img;

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                img = p5.images.get(`${cell.terrain.name}`);
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

        // if skill is activated and awaiting target, set highlight on
        if (this.awaitCell) {
            for (let i = 0; i < this.boardObjects.size; i++) {
                for (let j = 0; j < this.boardObjects.size; j++) {
                    if (PlantActive.activeRange1(i, j, this.selectedCell[0], this.selectedCell[1])) {
                        let [x1, y1, x2, y2, x3, y3, x4, y4] = myutil.cellIndex2Pos(p5, this, i, j, p5.CORNERS);
                        p5.stroke('rgb(255,238,0)');
                        p5.strokeWeight(2);
                        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                    }
                }
            }
        }

        p5.strokeWeight(0);
    }

    drawAllPlants(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                if (cell.plant !== null) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(cell.plant.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                    myutil.drawHealthBar(p5, cell.plant, avgX - 21, avgY - 42, 40, 5);
                }
                if (cell.seed !== null) {
                    let [avgX, avgY] = myutil.cellIndex2Pos(p5, this, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(cell.seed.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                }
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

    handleActiveSkills(p5) {
        // when activate button is clicked, system awaits a cell input
        if (this.awaitCell) {
            let index = myutil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
            if (index[0] === -1) {
                this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get("050"));
            } else {
                let spellCaster = this.boardObjects.getCell(this.selectedCell[0], this.selectedCell[1]);
                let target = this.boardObjects.getCell(index[0], index[1]);
                if (spellCaster.plant.plantType === plantTypes.TREE) {
                    PlantActive.rechargeHP(this, spellCaster, target, 1);
                } else if (spellCaster.plant.plantType === plantTypes.GRASS) {
                    PlantActive.sendAnimalFriends(this, spellCaster, target);
                }
            }
            this.awaitCell = false;
        }

        // there might be other types of skill that does not wait one cell,
        // so separate this chunk of code for easier later refactor.
    }

    handlePlanting(p5) {
        let index = myutil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
        // clicked an item from inventory, then clicked a cell:
        if (this.gameState.inventory.selectedItem !== null && index[0] !== -1) {
            if (this.actionPoints > 0) {
                if (this.boardObjects.plantCell(this, index[0], index[1], this.gameState.inventory.createItem(p5, this.gameState.inventory.selectedItem))) {
                    console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${index[0]}, col ${index[1]}`);
                    if (this.hasActionPoints) {
                        this.actionPoints--;
                    }
                    // set plant's skill
                    this.reevaluatePlantSkills();

                    // remove item from inventory
                    this.gameState.inventory.itemDecrement();
                    return;
                }
            } else {
                if (this.hasActionPoints && this.actionPoints === 0) {
                    this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get("002"));
                    return;
                }
            }
        }

        // clicked item from inventory or clicked somewhere else:
        // handle inventory clicks later to prevent unintentional issues
        this.gameState.inventory.handleClick(p5);
    }

    // miscellaneous end turn settings
    endTurnActivity(p5) {
        // reset action points
        this.actionPoints = this.maxActionPoints;

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

        // reevaluate plants' skills, after seeds have grown up
        this.reevaluatePlantSkills();

        // also, reconstruct ecosystem
        this.boardObjects.reconstructEcosystem();

        // set turn and counter
        this.turn++;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();
        if (this.turn === this.maxTurn + 1) {
            this.stageClearSettings(p5);
            return;
        } else {
            this.endTurn = false;
        }

        // set next turn enemies and new inventory items
        this.nextTurnItems(p5);

        // set action listener active
        this.gameState.setPlayerCanClick(true);
    }

    stageClearSettings(p5) {
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
        console.error("nextTurnEnemies is not overridden!");
    }

    setFloatingWindow(p5) {
        console.error("setFloatingWindow is not overridden!");
    }

    initAllFloatingWindows(p5) {
        console.error("initAllFloatingWindows is not overridden!");
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        console.error("setStageInventory is not overridden!");
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        console.error("setStageTerrain is not overridden!");
    }

    getTurnButtonText() {
        return `turn ${this.turn} in ${this.maxTurn}`;
    }
}
