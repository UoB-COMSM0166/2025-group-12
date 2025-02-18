import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";

export class InfoBox {
    constructor(playBoard) {
        this.infoStatus = 't'; // by default prints terrain & ( enemy | seed )
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
    }

    clickArrow(p5) {
        // the parameters of arrows are hardcoded now, should refactor later.
        let leftArrowX = 74;
        let rightArrowX = 150.8;
        let arrowY = 494.4;
        let arrowSize = 25.6;
        if (p5.mouseX >= leftArrowX && p5.mouseX < leftArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            this.infoBoxFSM(p5, 'p');
            return true;
        }
        if (p5.mouseX >= rightArrowX && p5.mouseX < rightArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            this.infoBoxFSM(p5, 'n');
            return true;
        }
        return false;
    }

    // a finite state machine.
    infoBoxFSM(p5, nextOrPrev) {
        let cell = this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]);

        // terrain & enemy
        if (this.infoStatus === 't') {
            if (nextOrPrev === 'n') {
                if (cell.plant !== null) {
                    this.infoStatus = 'p';
                } else {
                    this.infoStatus = 'e';
                }
            } else {
                this.infoStatus = 'e';
            }
        }

        // plant passive skill
        else if (this.infoStatus === 'p') {
            if (nextOrPrev === 'n') {
                this.infoStatus = 'a';
            } else {
                this.infoStatus = 't';
            }
        }

        // plant active skill
        else if (this.infoStatus === 'a') {
            if (nextOrPrev === 'n') {
                this.infoStatus = 'e';
            } else {
                this.infoStatus = 'p';
            }
        }

        // ecosystem
        else if (this.infoStatus === 'e') {
            if (nextOrPrev === 'n') {
                this.infoStatus = 't';
            } else {
                if (cell.plant !== null) {
                    this.infoStatus = 'a';
                } else {
                    this.infoStatus = 't';
                }
            }
        }

        // set and reset activate button
        if (this.infoStatus === 'a' && this.playBoard.boardObjects.getCell(this.playBoard.selectedCell[0], this.playBoard.selectedCell[1]).plant.hasActive) {
            this.setActivateButton(p5);
        } else if (this.infoStatus !== 'a' && this.activateButton !== null) {
            this.deleteActivateButton(p5);
        }
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
        this.playBoard.buttons.splice(this.playBoard.buttons.findIndex(button => button === this.activateButton), 1);
        this.activateButton = null;
    }
}