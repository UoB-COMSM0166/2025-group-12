import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";

export class InfoBox {
    constructor(playBoard) {
        this.infoStatus = 't'; // by default prints terrain & ( enemy | seed )
        this.recordStatus = 't'; // if record!='a' && status = 'a', init button, vice versa.
        this.activateButton = null;

        this.playBoard = playBoard;
        [this.boxWidth, this.boxHeight] = myutil.relative2absolute(0.18, 1 / 4);
        this.boxX = myutil.relative2absolute(1 / 128, 0)[0];
        [this.paddingX, this.paddingY] = myutil.relative2absolute(1 / 128, 1 / 72);
        this.boxY = this.playBoard.canvasHeight - this.boxHeight - this.paddingY;
    }

    // left bottom info box
    draw(p5) {
        p5.fill(50);
        p5.noStroke();
        p5.rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight, 10); // 10: corner roundness

        let title;
        let info;

        if (this.infoStatus === 't') {
            title = "General Info";
            info = this.playBoard.boardObjects.getCellString(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]);
        } else if (this.infoStatus === 'p') {
            title = "Plant Passive";
            info = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]).plant.getPassiveString();
        } else if (this.infoStatus === 'a') {
            title = "Plant Active";
            info = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]).plant.getActiveString();
        } else if (this.infoStatus === 'e') {
            title = "Ecosystem";
            info = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]).getEcoString();
        }

        p5.fill(255);
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text(title, this.boxX + this.boxWidth / 2, this.boxY + this.paddingY);

        p5.textSize(18);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        p5.text(info, this.boxX + this.paddingX, this.boxY + this.paddingY + 24, this.boxWidth - this.paddingX * 2);

        let arrowSize = myutil.relative2absolute(0.02)[0];
        p5.image(p5.images.get("leftarrow"), this.boxX + this.boxWidth / 3 - arrowSize / 2, this.boxY - arrowSize - this.paddingY, arrowSize, arrowSize);
        p5.image(p5.images.get("rightarrow"), this.boxX + 2 * this.boxWidth / 3 - arrowSize / 2, this.boxY - arrowSize - this.paddingY, arrowSize, arrowSize);

        // draw a box to highlight arrow
        if(this.boxX + this.boxWidth / 3 - arrowSize / 2 < p5.mouseX &&  p5.mouseX < this.boxX + this.boxWidth / 3 - arrowSize / 2 + arrowSize
        && this.boxY - arrowSize - this.paddingY < p5.mouseY && p5.mouseY < this.boxY - arrowSize - this.paddingY + arrowSize){
            p5.fill(0,0,0, 0);
            p5.stroke(100);
            p5.strokeWeight(2);
            p5.rect(this.boxX + this.boxWidth / 3 - arrowSize / 2, this.boxY - arrowSize - this.paddingY, arrowSize, arrowSize);
        }
        if(this.boxX + 2 * this.boxWidth / 3 - arrowSize / 2 < p5.mouseX &&  p5.mouseX < this.boxX + 2 * this.boxWidth / 3 - arrowSize / 2 + arrowSize
            && this.boxY - arrowSize - this.paddingY < p5.mouseY && p5.mouseY < this.boxY - arrowSize - this.paddingY + arrowSize){
            p5.fill(0,0,0, 0);
            p5.stroke(100);
            p5.strokeWeight(2);
            p5.rect(this.boxX + 2 * this.boxWidth / 3 - arrowSize / 2, this.boxY - arrowSize - this.paddingY, arrowSize, arrowSize);
        }

        // add a page indicator
        let cell = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]);
        let pages;
        let currentPage;
        if(cell.plant === null){
            pages = 2;
            switch (this.infoStatus){
                case 't': currentPage = 1; break;
                case 'e': currentPage = 2; break;
                default: currentPage = 1; break;
            }
        }else{
            pages = 4;
            switch (this.infoStatus){
                case 't': currentPage = 1; break;
                case 'p': currentPage = 2; break;
                case 'a': currentPage = 3; break;
                case 'e': currentPage = 4; break;
                default: currentPage = 1; break;
            }
        }
        p5.textSize(18);
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`${currentPage}/${pages}`,this.boxX +  this.boxWidth / 2 - arrowSize / 2, this.boxY - 2*arrowSize /3  - this.paddingY);
    }

    // clicked info box arrows when info box exists in play board
    handleClickArrow(p5, playBoard) {
        if (playBoard.selectedCell.length !== 0) {
            if (playBoard.infoBox.clickArrow(p5, this)) {
                return true;
            } else {
                // reset the info status to prevent unintentional bugs
                playBoard.infoBox.resetStatus();
                playBoard.infoBox.deleteActivateButton(p5, this);
                playBoard.infoBox.deleteDisplayButton(p5);
            }
        }
        return false;
    }

    clickArrow(p5) {
        // the parameters of arrows are hardcoded now, should refactor later.
        let leftArrowX = 74;
        let rightArrowX = 150.8;
        let arrowY = 494.4;
        let arrowSize = 25.6;
        if (p5.mouseX >= leftArrowX && p5.mouseX < leftArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            return this.clickLeftArrow(p5);
        }
        if (p5.mouseX >= rightArrowX && p5.mouseX < rightArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            return this.clickRightArrow(p5);
        }
        return false;
    }

    // separate the two functions to incorporate keyboard shortcut
    clickLeftArrow(p5){
        this.infoBoxFSM(p5, 'p');
        return true;
    }

    clickRightArrow(p5){
        this.infoBoxFSM(p5, 'n');
        return true;
    }

    // a finite state machine.
    infoBoxFSM(p5, nextOrPrev) {
        let cell = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]);

        // terrain & enemy
        if (this.infoStatus === 't') {
            if (nextOrPrev === 'n') {
                if (cell.plant !== null) {
                    this.setStatus(p5, 'p');
                } else {
                    this.setStatus(p5, 'e');
                }
            } else {
                this.setStatus(p5, 'e');
            }
        }

        // plant passive skill
        else if (this.infoStatus === 'p') {
            if (nextOrPrev === 'n') {
                this.setStatus(p5, 'a');
            } else {
                this.setStatus(p5, 't');
            }
        }

        // plant active skill
        else if (this.infoStatus === 'a') {
            if (nextOrPrev === 'n') {
                this.setStatus(p5, 'e');
            } else {
                this.setStatus(p5, 'p');
            }
        }

        // ecosystem
        else if (this.infoStatus === 'e') {
            if (nextOrPrev === 'n') {
                this.setStatus(p5, 't');
            } else {
                if (cell.plant !== null) {
                    this.setStatus(p5, 'a');
                } else {
                    this.setStatus(p5, 't');
                }
            }
        }

    }

    setStatus(p5, newStatus) {
        this.infoStatus = newStatus;
        let cell = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]);
        if (this.infoStatus === 'a' && this.recordStatus !== 'a' && cell.plant !== null && cell.plant.hasActive) {
            this.setActivateButton(p5);
        } else if (this.infoStatus !== 'a' && this.recordStatus === 'a') {
            this.deleteActivateButton(p5);
        }

        if(this.infoStatus === 'e') this.setEcoDisplayButton(p5);
        else this.deleteDisplayButton(p5);

        this.recordStatus = newStatus;
    }

    resetStatus() {
        this.infoStatus = 't';
        this.recordStatus = 't';
    }

    setActivateButton(p5) {
        let [buttonWidth, buttonHeight] = myutil.relative2absolute(5 / 64, 0.04);
        let buttonX = this.boxX + this.boxWidth / 2 - buttonWidth / 2;
        let buttonY = this.playBoard.canvasHeight - buttonHeight - 2 * this.paddingY;
        let activate = new Button(buttonX, buttonY, buttonWidth, buttonHeight, "activate");
        activate.onClick = () => {
            this.playBoard.activatePlantSkill(p5);
        };
        this.playBoard.buttons.push(activate);
        this.activateButton = activate;
    }

    deleteActivateButton(p5) {
        if (this.activateButton === null) {
            return;
        }
        let index = this.playBoard.buttons.findIndex(button => button === this.activateButton);
        if(index != -1){
            this.playBoard.buttons.splice(index, 1);
        }
        this.activateButton = null;
    }

    setEcoDisplayButton(p5){
        let [buttonWidth, buttonHeight] = myutil.relative2absolute(5 / 64, 0.04);
        let buttonX = this.boxX + this.boxWidth / 2 - buttonWidth / 2;
        let buttonY = this.playBoard.canvasHeight - buttonHeight - 2 * this.paddingY;
        let display = new Button(buttonX, buttonY, buttonWidth, buttonHeight, "display");
        display.onClick = () => {
            this.playBoard.ecoDisplay = !this.playBoard.ecoDisplay;
        };
        this.playBoard.buttons.push(display);
        this.displayButton = display;
    }

    deleteDisplayButton(p5){
        if(this.displayButton === null) return;
        
        let index = this.playBoard.buttons.findIndex(button => button === this.displayButton);
        if(index != -1){
            this.playBoard.buttons.splice(index, 1);
        }
        this.displayButton = null;
    }
}