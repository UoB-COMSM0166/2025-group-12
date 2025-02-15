import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {stateCode, stageCode} from "./GameState.js";
import {BoardCells} from "./BoardCells.js";
import {Seed} from "../items/Seed.js";
import {Plant} from "../items/Plant.js";
import {InfoBox} from "./InfoBox.js";

export class PlayBoard {

    constructor(gameState) {
        this.gameState = gameState;
        this.stageCode = stageCode.NOSTAGE;
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
        [this.cellWidth, this.cellHeight] = myutil.relative2absolute(1 / 16, 1 / 9);

        this.buttons = [];

        // store all enemies
        this.enemies = [];

        // board objects array and information box
        this.boardObjects = new BoardCells(this.gridSize);
        this.selectedCell = [];
        this.infoBox = new InfoBox();

        // to store the items at the start of each stage,
        // so when you quit we can reset inventory
        this.tmpInventoryItems = new Map();

        // turn counter
        this.turn = 1;
        this.maxTurn = 10;
    }

    /* public methods */

    setup(p5) {
        let [escX, escY] = myutil.relative2absolute(0.01, 0.01);
        let [escWidth, escHeight] = myutil.relative2absolute(0.09, 0.07);
        let escapeButton = new Button(escX, escY, escWidth, escHeight, "Escape");
        escapeButton.onClick = () => {
            this.gameState.setState(stateCode.STANDBY);
        };
        this.buttons.push(escapeButton);

        // turn button
        let [turnWidth, turnHeight] = myutil.relative2absolute(5 / 32, 0.07);
        let [turnX, turnY] = myutil.relative2absolute(0.5, 0.01);
        let turnButton = new Button(turnX - turnWidth / 2, turnY, turnWidth, turnHeight, this.getTurnButtonText());
        turnButton.onClick = () => {
            this.gameState.togglePlayerCanClick();
            this.gameState.toggleEnemyCanMove();
        }
        this.buttons.push(turnButton);

        // setup stage terrain
        this.setStageTerrain();
    }

    handleScroll(event) {
        this.gameState.inventory.handleScroll(event);
    }

    handleClick(p5) {

        // clicked info box arrows when they exist
        if (this.selectedCell.length !== 0) {
            if (this.infoBox.clickArrow(p5, this)) {
                return;
            } else {
                // reset the info status to prevent unintentional bugs
                this.infoStatus = 't';
            }
        }

        // clicked inventory, then click a cell
        if (this.gameState.inventory.selectedItem !== null) {
            let index = this.pos2CellIndex(p5.mouseX, p5.mouseY);
            let clickedCell = false;

            if (index[0] !== -1) {
                let row = index[0];
                let col = index[1];
                if (this.boardObjects.getCell(row, col).plant !== null) {
                    return; // prevent repetitive planting one cell
                }
                if (this.boardObjects.plantCell(row, col, this.gameState.inventory.createItem(p5, this.gameState.inventory.selectedItem))) {
                    console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${row}, col ${col}`);

                    // set plant's skill
                    this.reevaluatePlantSkills(p5);

                    clickedCell = true;
                }
            }
            // clear inventory's selected item
            if (clickedCell) {
                this.gameState.inventory.itemDecrement();
                // update inventory height
                this.gameState.inventory.updateInventoryHeight();
                return;
            }
        }
        // handle inventory clicks later to prevent unintentional issues
        this.gameState.inventory.handleClick(p5);

        // click any button
        for (let button of this.buttons) {
            button.mouseClick(p5);
        }

        // click any grid cell to display info box
        this.clickCells(p5);
    }

    draw(p5) {
        p5.background(200);

        if (this.gameState.inventory.selectedItem !== null) {
            p5.cursor('grab');
        } else {
            p5.cursor(p5.ARROW);
        }

        // draw stage grid
        this.drawGrid(p5);

        // all buttons
        for (let button of this.buttons) {
            button.draw(p5);
        }

        // left bottom corner info box
        if (this.selectedCell.length !== 0) {
            this.infoBox.draw(p5, this);
        }

        // draw all enemies according to this.enemy
        for (let enemy of this.enemies) {
            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            p5.image(enemy.img, enemy.x - imgSize / 2, enemy.y - imgSize, imgSize, imgSize);
            enemy.drawHealthBar(p5, enemy.x - 20, enemy.y - 50, 40, 5);
        }

        // draw plants according to board objects
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                let plant = cell.plant;
                let seed = cell.seed;
                if (plant !== null) {
                    let [avgX, avgY] = this.CellIndex2Pos(p5, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(plant.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                    plant.drawHealthBar(p5, avgX - 21, avgY - 42, 40, 5);
                }
                if (seed !== null) {
                    let [avgX, avgY] = this.CellIndex2Pos(p5, i, j, p5.CENTER);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    p5.image(seed.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                }
            }
        }

        // draw inventory
        this.gameState.inventory.draw(p5, this.canvasWidth, this.canvasHeight);
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

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        console.log("setStageInventory is not overridden!");
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain() {
        console.log("setStageTerrain is not overridden!");
    }

    // when clear or quit, invoke this function to reset board
    // called by controller
    resetBoard() {
        // reset turn and button
        this.turn = 1;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();

        // reset inventory indicator
        this.selectedCell = [];

        // clear enemies
        this.enemies = [];

        // reset info box status
        this.infoBox.infoStatus = 't';

        // reset board cells
        this.boardObjects = new BoardCells(this.gridSize);

        // reset terrain
        this.setStageTerrain();

        // reset tmp inventory
        this.tmpInventoryItems = null;
    }

    drawGrid(p5) {
        p5.stroke(0);
        p5.strokeWeight(2);
        let img = p5.images.get("ground");

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let [x1, y1, x2, y2, x3, y3, x4, y4] = this.CellIndex2Pos(p5, i, j, p5.CORNERS);
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
    }

    // set the clicked cell to draw info box
    clickCells(p5) {
        let index = this.pos2CellIndex(p5.mouseX, p5.mouseY);
        if (index[0] === -1) {
            this.selectedCell = [];
        } else {
            this.selectedCell = [index[0], index[1]];
        }
    }

    // convert canvas position into cell index
    pos2CellIndex(x, y) {
        // edges of the grid under old grid-centered coordinates
        let leftEdge = -(this.gridSize * this.cellWidth) / 2;
        let rightEdge = (this.gridSize * this.cellWidth) / 2;
        let topEdge = -(this.gridSize * this.cellHeight) / 2;
        let bottomEdge = (this.gridSize * this.cellHeight) / 2;

        // mouse position under old grid-centered coordinates
        let oldX = this.oldCoorX(x - this.canvasWidth / 2, y - this.canvasHeight / 2);
        let oldY = this.oldCoorY(x - this.canvasWidth / 2, y - this.canvasHeight / 2);

        // Check if click is within the grid
        if (oldX >= leftEdge && oldX <= rightEdge
            && oldY >= topEdge && oldY <= bottomEdge) {
            let col = Math.floor((oldX + (this.gridSize * this.cellWidth) / 2) / this.cellWidth);
            let row = Math.floor((oldY + (this.gridSize * this.cellHeight) / 2) / this.cellHeight);
            return [row, col];
        } else {
            return [-1];
        }
    }

    // convert cell index into canvas position
    CellIndex2Pos(p5, i, j, mode) {
        let x = -(this.gridSize * this.cellWidth / 2) + j * this.cellWidth;
        let y = -(this.gridSize * this.cellHeight / 2) + i * this.cellHeight;

        let x1 = this.newCoorX(x, y) + this.canvasWidth / 2;
        let y1 = this.newCoorY(x, y) + this.canvasHeight / 2;

        if (mode === p5.CORNER) {
            return [x1, y1];
        }

        let x2 = this.newCoorX(x + this.cellWidth, y) + this.canvasWidth / 2;
        let y2 = this.newCoorY(x + this.cellWidth, y) + this.canvasHeight / 2;
        let x3 = this.newCoorX(x + this.cellWidth, y + this.cellHeight) + this.canvasWidth / 2;
        let y3 = this.newCoorY(x + this.cellWidth, y + this.cellHeight) + this.canvasHeight / 2;
        let x4 = this.newCoorX(x, y + this.cellHeight) + this.canvasWidth / 2;
        let y4 = this.newCoorY(x, y + this.cellHeight) + this.canvasHeight / 2;

        if (mode === p5.CORNERS) {
            return [x1, y1, x2, y2, x3, y3, x4, y4];
        }

        if (mode === p5.CENTER) {
            return [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
        }
    }

    // end turn enemy activities
    enemyMovements(p5) {
        for (let enemy of this.enemies) {
            if (enemy.enemyMovements(p5, this) === true) {
                return; // enemies will move one after one instead of moving simultaneously
            }
            // delete dead enemy
            if (!enemy.status) {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        }

        // if all enemies are updated:
        // 1. set new enemies according to turn counter
        this.nextTurnEnemies(p5);

        // 2. set status
        this.endTurnActivity(p5);
    }

    // miscellaneous end turn settings
    endTurnActivity(p5) {
        // a safe-lock to remove all dead plants
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            if (cell.plant.status === false) {
                this.boardObjects.removePlant(cell.x, cell.y);
            }
        }

        // reevaluate plants' skills
        this.reevaluatePlantSkills();

        // set turn and counter
        this.turn++;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();
        if (this.turn === this.maxTurn) {
            this.gameState.setState(stateCode.FINISH);
            // when a stage is cleared:
            // 1. store all living plants
            let cellsWithPlant = this.boardObjects.getAllCellsWithPlant();
            for (let cws of cellsWithPlant) {
                this.gameState.inventory.pushItem2Inventory(p5, cws.plant.name, 1);
            }

            // 2. remove all seeds
            this.gameState.inventory.removeAllSeeds();
            this.gameState.inventory.updateInventoryHeight();
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

        // set enemy back to can move
        for (let enemy of this.enemies) {
            if (enemy.name === 'Mob') {
                enemy.moved = false;
                enemy.chosen = false;
            }
        }

        // set action listener active
        this.gameState.togglePlayerCanClick();
        this.gameState.toggleEnemyCanMove();
    }

    nextTurnEnemies(p5) {
        console.log("nextTurnEnemies is not overridden!");
    }

    // when a new plant is placed, or at the end of a turn,
    // we need to verify all plant's skill status.
    reevaluatePlantSkills(p5) {
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            cell.plant.reevaluateSkills(this, cell);
        }
    }

    // the coordinate transformation is
    // (x')   ( Sx * cos(rot)  Sy * cos(rot+span) ) ( x )
    // (  ) = (                                   ) (   )
    // (y')   ( Sx * sin(rot)  Sy * sin(rot+span) ) ( y )

    newCoorX(x, y) {
        return x * this.Sx * Math.cos(this.rot) + y * this.Sy * Math.cos(this.span + this.rot);
    }

    newCoorY(x, y) {
        return this.Hy * (x * this.Sx * Math.sin(this.rot) + y * this.Sy * Math.sin(this.span + this.rot));
    }

    oldCoorX(newX, newY) {
        return (1 / (this.Sx * this.Sy * Math.sin(this.span))) * (this.Sy * Math.sin(this.rot + this.span) * newX - this.Sy * Math.cos(this.rot + this.span) * newY);
    }

    oldCoorY(newX, newY) {
        return -(1 / (this.Sx * this.Sy * Math.sin(this.span))) * (this.Sx * Math.sin(this.rot) * newX - this.Sx * Math.cos(this.rot) * newY);
    }

    getTurnButtonText() {
        return `turn ${this.turn} in ${this.maxTurn}`;
    }

}
