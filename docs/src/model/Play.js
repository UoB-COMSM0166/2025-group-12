import {CanvasSize} from "../CanvasSize.js";
import {Button} from "../items/Button.js";
import {stateCode} from "./GameState.js";
import {BoardCells} from "./BoardCells.js";
import {Steppe} from "../items/Steppe.js";
import {PlayerBase} from "../items/PlayerBase.js";
import {Mountain} from "../items/Mountain.js";

export class PlayBoard {

    constructor(gameState) {
        this.gameState = gameState;
        this.canvasX = CanvasSize.getSize()[0];
        this.canvasY = CanvasSize.getSize()[1];

        // transformation parameters
        this.Sx = 0.5;
        this.Sy = 0.5;
        this.rot = Math.PI/6;
        this.span = 2*Math.PI/3;
        this.Hy = 1;

        // grid parameters
        this.gridSize = 8;
        this.cellWidth = 80;
        this.cellHeight = 80;

        this.buttons = [];

        // board objects array and information block
        this.boardObjects = new BoardCells(this.gridSize);
        this.selectedCell = [];

        // to store the items at the start of each stage,
        // so when you quit we can reset inventory
        this.tmpInventoryItems = new Map();

        // round counter
        this.round = 1;
        this.maxRound = 10;
    }

    /* public methods */

    setup(p5) {
        let escapeButton = new Button(10, 10, 100, 50, "Escape");
        escapeButton.onClick = () => {this.gameState.setState(stateCode.STANDBY);};
        this.buttons.push(escapeButton);

        // round button
        let roundButton = new Button(this.canvasX/2 - 100, 10, 200, 50, this.getRoundButtonText());
        roundButton.onClick = () => {
            this.round++;
            roundButton.text = this.getRoundButtonText();
            if(this.round === this.maxRound){
                this.gameState.setState(stateCode.STANDBY);
            }
        }
        this.buttons.push(roundButton);

        // setup stage terrain
        this.setStageTerrain();
    }

    handleScroll(event) {
        this.gameState.inventory.handleScroll(event);
    }

    handleClick(p5) {
        // clicked inventory, then click a cell
        if(this.gameState.inventory.selectedItem !== null){
            let index = this.mouse2CellIndex(p5);
            let clickedCell = false;
            // if a cell is clicked, update this.cellColors.
            if (index[0] !== -1) {
                let row = index[0];
                let col = index[1];
                if(this.boardObjects.plantCell(row, col, this.gameState.inventory.createItem(this.gameState.inventory.selectedItem))){
                    console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${row}, col ${col}`);
                    clickedCell = true;
                }
            }
            // clear inventory's selected item
            if(clickedCell){
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

        // draw plants according to board objects
        for(let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.boardObjects.getCell(i, j);
                let plant = cell.plant;
                if(plant !== null){
                    let x = -(this.gridSize * this.cellWidth / 2) + cell.y * this.cellWidth;
                    let y = -(this.gridSize * this.cellHeight / 2) + cell.x * this.cellHeight;
                    // Transform four corners of the cell
                    let x1 = this.newCoorX(x, y) + this.canvasX/2;
                    let y1 = this.newCoorY(x, y) + this.canvasY/2;
                    let x2 = this.newCoorX(x + this.cellWidth, y) + this.canvasX/2;
                    let y2 = this.newCoorY(x + this.cellWidth, y) + this.canvasY/2;
                    let x3 = this.newCoorX(x + this.cellWidth, y + this.cellHeight) + this.canvasX/2;
                    let y3 = this.newCoorY(x + this.cellWidth, y + this.cellHeight) + this.canvasY/2;
                    let x4 = this.newCoorX(x, y + this.cellHeight) + this.canvasX/2;
                    let y4 = this.newCoorY(x, y + this.cellHeight) + this.canvasY/2;
                    p5.fill(plant.color);
                    p5.noStroke();
                    p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                }
            }
        }

        // draw inventory
        this.gameState.inventory.draw(p5, this.canvasX, this.canvasY);
    }

    // set stage terrain at setup phase
    setStage(){
        this.gameState.inventory.pushItem2Inventory("Tree", 2);
        this.gameState.inventory.pushItem2Inventory("Bush", 1);
        this.gameState.inventory.pushItem2Inventory("Grass", 3);
        // update inventory height
        this.gameState.inventory.updateInventoryHeight();
    }

    // when clear or quit, invoke this function to reset board
    resetBoard(){
        // reset round and button
        this.round = 1;
        for (let button of this.buttons) {
            if (button.text.startsWith("round")) {
                button.text = this.getRoundButtonText();
                break;
            }
        }

        // reset inventory indicator
        this.selectedCell = [];

        // reset board cells
        this.boardObjects = new BoardCells(this.gridSize);
        this.setStageTerrain();

        // reset tmp inventory
        this.tmpInventoryItems = null;
    }

    /* below can be treated as black box */

    drawGrid(p5){
        p5.stroke(0);
        p5.strokeWeight(2);

        for (let i = 0; i <= this.gridSize; i++) {
            let x = -(this.gridSize * this.cellWidth / 2) + i * this.cellWidth;
            let y = -(this.gridSize * this.cellHeight / 2) + i * this.cellHeight;

            // transformed top end of vertical line
            let x1 = this.newCoorX(x, -this.gridSize * this.cellHeight / 2);
            let y1 = this.newCoorY(x, -this.gridSize * this.cellHeight / 2);
            // transformed bottom end of vertical line
            let x2 = this.newCoorX(x, this.gridSize * this.cellHeight / 2);
            let y2 = this.newCoorY(x, this.gridSize * this.cellHeight / 2);
            // transformed left end of horizontal line
            let x3 = this.newCoorX(-this.gridSize * this.cellWidth / 2, y);
            let y3 = this.newCoorY(-this.gridSize * this.cellWidth / 2, y);
            // transformed right end of horizontal line
            let x4 = this.newCoorX(this.gridSize * this.cellWidth / 2, y);
            let y4 = this.newCoorY(this.gridSize * this.cellWidth / 2, y);

            // center the grid cells
            x1 += this.canvasX / 2;
            y1 += this.canvasY / 2;
            x2 += this.canvasX / 2;
            y2 += this.canvasY / 2;
            x3 += this.canvasX / 2;
            y3 += this.canvasY / 2;
            x4 += this.canvasX / 2;
            y4 += this.canvasY / 2;

            p5.line(x1, y1, x2, y2);
            p5.line(x3, y3, x4, y4);
        }
    }

    clickCells(p5) {
        let index = this.mouse2CellIndex(p5);
        if(index[0] === -1){
            this.selectedCell = [];
        }else{
            this.selectedCell = [index[0], index[1]];
        }
    }

    mouse2CellIndex(p5){
        // edges of the grid under old grid-centered coordinates
        let leftEdge   =-(this.gridSize * this.cellWidth) / 2;
        let rightEdge  = (this.gridSize * this.cellWidth) / 2;
        let topEdge    =-(this.gridSize * this.cellHeight) / 2;
        let bottomEdge = (this.gridSize * this.cellHeight) / 2;

        // mouse position under old grid-centered coordinates
        let oldMouseX = this.oldCoorX(p5.mouseX - this.canvasX / 2, p5.mouseY - this.canvasY / 2);
        let oldMouseY = this.oldCoorY(p5.mouseX - this.canvasX / 2, p5.mouseY - this.canvasY / 2);

        // Check if click is within the grid
        if (oldMouseX >= leftEdge && oldMouseX <= rightEdge
            && oldMouseY >= topEdge && oldMouseY <= bottomEdge) {
            let row = this.gridSize - 1 - Math.floor((oldMouseX + (this.gridSize * this.cellWidth) / 2) / this.cellWidth);
            let col = this.gridSize - 1 - Math.floor((oldMouseY + (this.gridSize * this.cellHeight) / 2) / this.cellHeight);
            return [row, col];
        }else{
            return [-1];
        }
    }

    drawInfoBox(p5) {
        let boxWidth = 200;
        let boxHeight = 100;
        let boxX = 10;
        let boxY = this.canvasY - boxHeight - 10;

        p5.fill(50);
        p5.noStroke();
        p5.rect(boxX, boxY, boxWidth, boxHeight, 10);

        p5.fill(255);
        p5.textSize(18);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        let info = this.boardObjects.getCellString(this.selectedCell[0], this.selectedCell[1]);
        p5.text(info, boxX + 10, boxY + 10, boxWidth - 20);
    }

    // the coordinate transformation is
    // (x')   ( Sx * cos(rot)  Sy * cos(rot+span) )   ( x )
    // (  ) = (                                   ) = (   )
    // (y')   ( Sx * sin(rot)  Sy * sin(rot+span) )   ( y )

    newCoorX(x, y) {
        return x * this.Sx * Math.cos(this.rot) + y * this.Sy * Math.cos(this.span + this.rot);
    }

    newCoorY(x, y) {
        return this.Hy * (x * this.Sx * Math.sin(this.rot) + y * this.Sy * Math.sin(this.span + this.rot));
    }

    oldCoorX(newX, newY) {
        return (newX * Math.cos(this.rot) - (newY / this.Hy) * Math.sin(this.rot)) / this.Sx;
    }

    oldCoorY(newX, newY) {
        return ((newX * Math.cos(this.span + this.rot)) - (newY / this.Hy) * Math.sin(this.span + this.rot)) / this.Sy;
    }

    getRoundButtonText() {
        return `round ${this.round} in ${this.maxRound}`;
    }

    setStageTerrain(){
        for(let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe());
            }
        }

        this.boardObjects.setCell(4,4, new PlayerBase());
        this.boardObjects.setCell(4,5, new Mountain());
        this.boardObjects.setCell(5,5, new Mountain());
    }

}
