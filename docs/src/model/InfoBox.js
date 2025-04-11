export class InfoBoxModel {
    static setup(bundle) {
        InfoBoxModel.utilityClass = bundle.utilityClass;
    }

    constructor(playBoard) {
        this.infoStatus = 't'; // by default prints terrain & ( enemy | seed )
        this.recordStatus = 't'; // if record!='a' && status = 'a', init button, vice versa.
        this.activateButton = null;
        this.displayButton = null;

        this.playBoard = playBoard;
        this.boxWidth = InfoBoxModel.utilityClass.relative2absolute(0.18, 1 / 4)[0];
        this.boxHeight = InfoBoxModel.utilityClass.relative2absolute(0.18, 1 / 4)[1];
        this.boxX = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 0)[0];
        this.paddingX = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 1 / 72)[0];
        this.paddingY = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 1 / 72)[1];
        this.boxY = InfoBoxModel.utilityClass.relative2absolute(1, 1)[1] - this.boxHeight - this.paddingY;
    }
}

export class InfoBoxRenderer {

    static setup(bundle) {
        InfoBoxRenderer.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static draw(p5, infoBox) {
        p5.fill(50);
        p5.noStroke();
        p5.rect(infoBox.boxX, infoBox.boxY, infoBox.boxWidth, infoBox.boxHeight, 10); // 10: corner roundness

        let title;
        let info;

        if (infoBox.infoStatus === 't') {
            title = "General Info";
            info = infoBox.playBoard.boardObjects.getCellString(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]);
        } else if (infoBox.infoStatus === 'p') {
            title = "Plant Passive";
            info = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]).plant.getPassiveString();
        } else if (infoBox.infoStatus === 'a') {
            title = "Plant Active";
            info = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]).plant.getActiveString();
        } else if (infoBox.infoStatus === 'e') {
            title = "Ecosystem";
            info = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]).getEcoString(infoBox.playBoard);
        }

        p5.fill(255);
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text(title, infoBox.boxX + infoBox.boxWidth / 2, infoBox.boxY + infoBox.paddingY);

        p5.textSize(18);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        p5.text(info, infoBox.boxX + infoBox.paddingX, infoBox.boxY + infoBox.paddingY + 24, infoBox.boxWidth - infoBox.paddingX * 2);

        let arrowSize = InfoBoxRenderer.utilityClass.relative2absolute(0.02)[0];
        p5.image(p5.images.get("leftArrow"), infoBox.boxX + infoBox.boxWidth / 3 - arrowSize / 2, infoBox.boxY - arrowSize - infoBox.paddingY, arrowSize, arrowSize);
        p5.image(p5.images.get("rightArrow"), infoBox.boxX + 2 * infoBox.boxWidth / 3 - arrowSize / 2, infoBox.boxY - arrowSize - infoBox.paddingY, arrowSize, arrowSize);

        // draw a box to highlight arrow
        if (infoBox.boxX + infoBox.boxWidth / 3 - arrowSize / 2 < p5.mouseX && p5.mouseX < infoBox.boxX + infoBox.boxWidth / 3 - arrowSize / 2 + arrowSize
            && infoBox.boxY - arrowSize - infoBox.paddingY < p5.mouseY && p5.mouseY < infoBox.boxY - arrowSize - infoBox.paddingY + arrowSize) {
            p5.fill(0, 0, 0, 0);
            p5.stroke(100);
            p5.strokeWeight(2);
            p5.rect(infoBox.boxX + infoBox.boxWidth / 3 - arrowSize / 2, infoBox.boxY - arrowSize - infoBox.paddingY, arrowSize, arrowSize);
        }
        if (infoBox.boxX + 2 * infoBox.boxWidth / 3 - arrowSize / 2 < p5.mouseX && p5.mouseX < infoBox.boxX + 2 * infoBox.boxWidth / 3 - arrowSize / 2 + arrowSize
            && infoBox.boxY - arrowSize - infoBox.paddingY < p5.mouseY && p5.mouseY < infoBox.boxY - arrowSize - infoBox.paddingY + arrowSize) {
            p5.fill(0, 0, 0, 0);
            p5.stroke(100);
            p5.strokeWeight(2);
            p5.rect(infoBox.boxX + 2 * infoBox.boxWidth / 3 - arrowSize / 2, infoBox.boxY - arrowSize - infoBox.paddingY, arrowSize, arrowSize);
        }

        // add a page indicator
        let cell = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]);
        let pages;
        let currentPage;
        if (cell.plant === null) {
            pages = 2;
            switch (infoBox.infoStatus) {
                case 't':
                    currentPage = 1;
                    break;
                case 'e':
                    currentPage = 2;
                    break;
                default:
                    currentPage = 1;
                    break;
            }
        } else {
            pages = 4;
            switch (infoBox.infoStatus) {
                case 't':
                    currentPage = 1;
                    break;
                case 'p':
                    currentPage = 2;
                    break;
                case 'a':
                    currentPage = 3;
                    break;
                case 'e':
                    currentPage = 4;
                    break;
                default:
                    currentPage = 1;
                    break;
            }
        }
        p5.textSize(18);
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`${currentPage}/${pages}`, infoBox.boxX + infoBox.boxWidth / 2 - arrowSize / 2, infoBox.boxY - 2 * arrowSize / 3 - infoBox.paddingY);
    }
}

export class InfoBoxLogic {
    static setup(bundle) {
        InfoBoxLogic.Button = bundle.button;
        InfoBoxLogic.utilityClass = bundle.utilityClass;
    }

    // clicked info box arrows when info box exists in play board
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static handleClickArrow(p5, playBoard) {
        if (playBoard.selectedCell.length !== 0) {
            if (InfoBoxLogic.clickArrow(p5, playBoard.infoBox)) {
                return true;
            } else {
                // reset the info status to prevent unintentional bugs
                InfoBoxLogic.resetStatus(playBoard.infoBox);
                InfoBoxLogic.deleteActivateButton(playBoard.infoBox);
                InfoBoxLogic.deleteDisplayButton(playBoard.infoBox);
            }
        }
        return false;
    }

    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static clickArrow(p5, infoBox) {
        // the parameters of arrows are hardcoded now, should refactor later.
        let leftArrowX = 74;
        let rightArrowX = 150.8;
        let arrowY = 494.4;
        let arrowSize = 25.6;
        if (p5.mouseX >= leftArrowX && p5.mouseX < leftArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            return InfoBoxLogic.clickLeftArrow(p5, infoBox);
        }
        if (p5.mouseX >= rightArrowX && p5.mouseX < rightArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize) {
            return InfoBoxLogic.clickRightArrow(p5, infoBox);
        }
        return false;
    }

    // separate the two functions to incorporate keyboard shortcut
    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static clickLeftArrow(p5, infoBox) {
        InfoBoxLogic.infoBoxFSM(p5, 'p', infoBox);
        return true;
    }

    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static clickRightArrow(p5, infoBox) {
        InfoBoxLogic.infoBoxFSM(p5, 'n', infoBox);
        return true;
    }

    // a finite state machine.
    /**
     *
     * @param p5
     * @param nextOrPrev
     * @param {InfoBoxModel} infoBox
     */
    static infoBoxFSM(p5, nextOrPrev, infoBox) {
        let cell = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]);

        // terrain & enemy
        if (infoBox.infoStatus === 't') {
            if (nextOrPrev === 'n') {
                if (cell.plant !== null) {
                    InfoBoxLogic.setStatus(p5, 'p', infoBox);
                } else {
                    InfoBoxLogic.setStatus(p5, 'e', infoBox);
                }
            } else {
                InfoBoxLogic.setStatus(p5, 'e', infoBox);
            }
        }

        // plant passive skill
        else if (infoBox.infoStatus === 'p') {
            if (nextOrPrev === 'n') {
                InfoBoxLogic.setStatus(p5, 'a', infoBox);
            } else {
                InfoBoxLogic.setStatus(p5, 't', infoBox);
            }
        }

        // plant active skill
        else if (infoBox.infoStatus === 'a') {
            if (nextOrPrev === 'n') {
                InfoBoxLogic.setStatus(p5, 'e', infoBox);
            } else {
                InfoBoxLogic.setStatus(p5, 'p', infoBox);
            }
        }

        // ecosystem
        else if (infoBox.infoStatus === 'e') {
            if (nextOrPrev === 'n') {
                InfoBoxLogic.setStatus(p5, 't', infoBox);
            } else {
                if (cell.plant !== null) {
                    InfoBoxLogic.setStatus(p5, 'a', infoBox);
                } else {
                    InfoBoxLogic.setStatus(p5, 't', infoBox);
                }
            }
        }
    }

    /**
     *
     * @param p5
     * @param newStatus
     * @param {InfoBoxModel} infoBox
     */
    static setStatus(p5, newStatus, infoBox) {
        infoBox.infoStatus = newStatus;
        let cell = infoBox.playBoard.boardObjects.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1]);
        if (infoBox.infoStatus === 'a' && infoBox.recordStatus !== 'a' && cell.plant !== null && cell.plant.hasActive) {
            InfoBoxLogic.setActivateButton(p5, infoBox);
        } else if (infoBox.infoStatus !== 'a' && infoBox.recordStatus === 'a') {
            InfoBoxLogic.deleteActivateButton(p5);
        }

        if (infoBox.infoStatus === 'e') InfoBoxLogic.setEcoDisplayButton(p5);
        else InfoBoxLogic.deleteDisplayButton(p5);

        infoBox.recordStatus = newStatus;
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static resetStatus(infoBox) {
        infoBox.infoStatus = 't';
        infoBox.recordStatus = 't';
    }

    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static setActivateButton(p5, infoBox) {
        let [buttonWidth, buttonHeight] = InfoBoxLogic.utilityClass.relative2absolute(5 / 64, 0.04);
        let buttonX = infoBox.boxX + infoBox.boxWidth / 2 - buttonWidth / 2;
        let buttonY = infoBox.playBoard.canvasHeight - buttonHeight - 2 * infoBox.paddingY;
        let activate = new InfoBoxLogic.Button(buttonX, buttonY, buttonWidth, buttonHeight, "activate");
        activate.onClick = () => {
            infoBox.playBoard.activatePlantSkill(p5);
        };
        infoBox.playBoard.buttons.push(activate);
        infoBox.activateButton = activate;
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static deleteActivateButton(infoBox) {
        if (infoBox.activateButton === null) {
            return;
        }
        let index = infoBox.playBoard.buttons.findIndex(button => button === infoBox.activateButton);
        if (index !== -1) {
            infoBox.playBoard.buttons.splice(index, 1);
        }
        infoBox.activateButton = null;
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static setEcoDisplayButton(infoBox) {
        let [buttonWidth, buttonHeight] = InfoBoxLogic.utilityClass.relative2absolute(5 / 64, 0.04);
        let buttonX = infoBox.boxX + infoBox.boxWidth / 2 - buttonWidth / 2;
        let buttonY = infoBox.playBoard.canvasHeight - buttonHeight - 2 * infoBox.paddingY;

        let text = infoBox.playBoard.ecoDisplay ? "display off" : "display on";

        let display = new InfoBoxLogic.Button(buttonX, buttonY, buttonWidth, buttonHeight, text);
        display.onClick = () => {
            infoBox.playBoard.ecoDisplay = !infoBox.playBoard.ecoDisplay;
            InfoBoxLogic.toggleEcoDisplayButtonText(infoBox);
        };
        infoBox.playBoard.buttons.push(display);
        infoBox.displayButton = display;
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static toggleEcoDisplayButtonText(infoBox) {
        infoBox.displayButton.text = infoBox.playBoard.ecoDisplay ? "display off" : "display on";
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static deleteDisplayButton(infoBox) {
        if (infoBox.displayButton === null) return;

        let index = infoBox.playBoard.buttons.findIndex(button => button === infoBox.displayButton);
        if (index !== -1) {
            infoBox.playBoard.buttons.splice(index, 1);
        }
        infoBox.displayButton = null;
    }
}