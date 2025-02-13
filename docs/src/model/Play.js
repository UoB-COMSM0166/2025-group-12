import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {stateCode} from "./GameState.js";
import {BoardCells} from "./BoardCells.js";
import {Steppe} from "../items/Steppe.js";
import {PlayerBase} from "../items/PlayerBase.js";
import {Mountain} from "../items/Mountain.js";
import {Storm} from "../items/Storm.js";
import {plantEnemyInteractions} from "../items/PlantEnemyInter.js";

export class PlayBoard {

    constructor(gameState) {
        this.gameState = gameState;
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

        // board objects array and information block
        this.boardObjects = new BoardCells(this.gridSize);
        this.selectedCell = [];

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
        turnButton.onClick = () => {this.gameState.togglePlayerCanClick();}
        this.buttons.push(turnButton);

        // setup stage terrain
        this.setStageTerrain();
    }

    handleScroll(event) {
        this.gameState.inventory.handleScroll(event);
    }

    handleClick(p5) {
        // clicked inventory, then click a cell
        if (this.gameState.inventory.selectedItem !== null) {
            let index = this.pos2CellIndex(p5.mouseX, p5.mouseY);
            let clickedCell = false;
            // if a cell is clicked, update this.cellColors.
            if (index[0] !== -1) {
                let row = index[0];
                let col = index[1];
                if (this.boardObjects.getCell(row, col).plant !== null) {
                    return; // prevent repetitive planting one cell
                }
                if (this.boardObjects.plantCell(row, col, this.gameState.inventory.createItem(this.gameState.inventory.selectedItem))) {
                    console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${row}, col ${col}`);
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

        // draw stage grid
        this.drawGrid(p5);

        // all buttons
        for (let button of this.buttons) {
            button.draw(p5);
        }

        // left bottom corner info box
        if (this.selectedCell.length !== 0) {
            this.drawInfoBox(p5);
        }

        // placeholder
        // draw terrains before plants,
        // so plants are cascaded above terrain

        // draw all enemies according to this.enemy
        for (let enemy of this.enemies) {
            let img = this.gameState.images.get(`${enemy.name}`);
            let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
            enemy.width = imgSize;
            enemy.height = imgSize;
            p5.image(img, enemy.x - imgSize / 2, enemy.y - 2 * imgSize / 5, imgSize, imgSize);
            enemy.drawHealthBar(p5, enemy.x - 21, enemy.y - 25, 40, 5);
        }

        // draw plants according to board objects
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                let plant = cell.plant;
                if (plant !== null) {
                    let [avgX, avgY] = this.CellIndex2Pos(p5, i, j, p5.CENTER);
                    plant.x = avgX, plant.y = avgY;
                    let img = this.gameState.images.get(`${cell.plant.name}`);
                    let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
                    plant.width = imgSize, plant.height = imgSize;
                    p5.image(img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
                    plant.drawHealthBar(p5, avgX - 21, avgY - 42, 40, 5);
                    plant.checkCollision(this.enemies);
                }
            }
        }

        // draw inventory
        this.gameState.inventory.draw(p5, this.canvasWidth, this.canvasHeight);
    }

    /* below can be treated as black box */

    // set stage terrain at setup phase
    setStage() {
        this.gameState.inventory.pushItem2Inventory("Tree", 3);
        this.gameState.inventory.pushItem2Inventory("Bush", 3);
        this.gameState.inventory.pushItem2Inventory("Grass", 3);
        // update inventory height
        this.gameState.inventory.updateInventoryHeight();
    }

    // when clear or quit, invoke this function to reset board
    resetBoard() {
        // reset turn and button
        this.turn = 1;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();

        // reset inventory indicator
        this.selectedCell = [];

        // clear enemies
        this.enemies = [];

        // reset board cells
        this.boardObjects = new BoardCells(this.gridSize);
        this.setStageTerrain();

        // reset tmp inventory
        this.tmpInventoryItems = null;
    }

    setStageTerrain() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe());
            }
        }
        this.boardObjects.setCell(4, 4, new PlayerBase());
        this.boardObjects.setCell(4, 5, new Mountain());
        this.boardObjects.setCell(5, 5, new Mountain());
    }

    drawGrid(p5) {

        p5.stroke(0);
        p5.strokeWeight(2);

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {

                if (this.boardObjects.getCell(i, j).isEcoSphere) {
                    p5.fill("green");
                } else {
                    p5.fill(100);
                }

                let [x1, y1, x2, y2, x3, y3, x4, y4] = this.CellIndex2Pos(p5, i, j, p5.CORNERS);
                p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
            }
        }
    }

    clickCells(p5) {
        let index = this.pos2CellIndex(p5.mouseX, p5.mouseY);
        if (index[0] === -1) {
            this.selectedCell = [];
        } else {
            this.selectedCell = [index[0], index[1]];
        }
    }

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

    drawInfoBox(p5) {

        let [boxWidth, boxHeight] = myutil.relative2absolute(5 / 32, 5 / 36);
        let boxX = myutil.relative2absolute(1 / 128, 0)[0];
        let [paddingX, paddingY] = myutil.relative2absolute(1 / 128, 1 / 72);
        let boxY = this.canvasHeight - boxHeight - paddingY;

        p5.fill(50);
        p5.noStroke();
        p5.rect(boxX, boxY, boxWidth, boxHeight, 10); // 10: corner roundness

        p5.fill(255);
        p5.textSize(18);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        let info = this.boardObjects.getCellString(this.selectedCell[0], this.selectedCell[1]);
        p5.text(info, boxX + paddingX, boxY + paddingY, boxWidth - paddingX * 2);
    }

    enemyMovements(p5) {
        let updating = false;

        for (let enemy of this.enemies) {
            if (enemy.name === "Storm" && enemy.status === true) {
                if(enemy.isMoving === true){
                    updating = true;
                    let [dx, dy] = enemy.direction;
                    let oldX = this.oldCoorX(enemy.x, enemy.y) + 5*dx;
                    let oldY = this.oldCoorY(enemy.x, enemy.y) + 5*dy;
                    let newX = this.newCoorX(oldX, oldY);
                    let newY = this.newCoorY(oldX, oldY);
                    console.log(oldX, oldY, newX, newY);
                    enemy.x = newX;
                    enemy.y = newY;

                    // call interaction when storm overlays with plant (cell level)
                    let index = this.pos2CellIndex(enemy.x, enemy.y);

                    if(index[0] !== -1){
                        let cell = this.boardObjects.getCell(index[0], index[1]);
                        if(cell.plant !== null && cell.plant.status === true){
                            plantEnemyInteractions.plantAttackedByStorm(this, cell.plant, enemy);
                        }
                    }

                    // if the storm goes out of the grid, it dies anyway.
                    if(index[0] === -1){
                        enemy.status = false;
                        let index = this.enemies.findIndex(e => e===enemy);
                        this.enemies.splice(index, 1);
                    }
                    continue;
                }
                if (enemy.countdown > 0) {
                    enemy.countdown--;
                }
                if(enemy.countdown === 0){
                    // the storm blows!
                    if(enemy.cell){
                        enemy.cell.enemy = null;
                        enemy.cell = null;
                    }
                    enemy.isMoving = true;
                    updating = true;
                }
            }
        }

        // still updating?
        if(updating){
            return;
        }
        // if all enemies are updated:

        // 1. set new enemies according to turn counter
        if (this.turn === 1) {
            let [avgX, avgY] = this.CellIndex2Pos(p5, 1, 1, p5.CENTER);
            let storm = new Storm(avgX, avgY, 'd');
            this.enemies.push(storm);
            this.boardObjects.getCell(1, 1).enemy = storm;
            storm.cell = this.boardObjects.getCell(1, 1);
        }else if (this.turn === 2) {
            let [avgX, avgY] = this.CellIndex2Pos(p5, 2, 2, p5.CENTER);
            let storm = new Storm(avgX, avgY, 'u');
            this.enemies.push(storm);
            this.boardObjects.getCell(2, 2).enemy = storm;
            storm.cell = this.boardObjects.getCell(2, 2);
        }else if (this.turn === 3) {
            let [avgX, avgY] = this.CellIndex2Pos(p5, 3, 3, p5.CENTER);
            let storm = new Storm(avgX, avgY, 'r');
            this.enemies.push(storm);
            this.boardObjects.getCell(3, 3).enemy = storm;
            storm.cell = this.boardObjects.getCell(3, 3);
        }

        // 2. set status
        this.endTurnActivity(p5);
    }

    endTurnActivity(p5) {
        // a safe-lock to remove all dead plants
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            if (cell.plant.status === false) {
                this.boardObjects.removePlant(cell.x, cell.y);
            }
        }

        // set turn and counter
        this.turn++;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();
        if (this.turn === this.maxTurn) {
            this.gameState.setState(stateCode.FINISH);
        }

        // set action listener active
        this.gameState.togglePlayerCanClick();
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
