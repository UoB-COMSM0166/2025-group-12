class InfoBoxModel {
    static setup(bundle) {
        InfoBoxModel.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    constructor(playBoard) {
        this.activateButton = null;
        this.displayButton = null;

        this.playBoard = playBoard;
        this.boxWidth = InfoBoxModel.utilityClass.relative2absolute(0.2, 5 / 18)[0];
        this.boxHeight = InfoBoxModel.utilityClass.relative2absolute(0.2, 5 / 18)[1];
        this.paddingX = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 1 / 360)[0];
        this.paddingY = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 1 / 360)[1];
        this.boxLeftX = InfoBoxModel.utilityClass.relative2absolute(1 / 128, 0)[0];
        this.boxRightX = InfoBoxModel.utilityClass.relative2absolute(1, 1)[0] - this.boxLeftX - this.boxWidth;
        this.boxY = InfoBoxModel.utilityClass.relative2absolute(1, 1)[1] - this.boxHeight - this.paddingY;
    }
}

class InfoBoxRenderer {

    static setup(bundle) {
        /** @type {typeof myUtil} */
        InfoBoxRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof BoardLogic} */
        InfoBoxRenderer.BoardLogic = bundle.BoardLogic;
        /** @type {typeof BoardRenderer} */
        InfoBoxRenderer.BoardRenderer = bundle.BoardRenderer;
        /** @type {typeof CellRenderer} */
        InfoBoxRenderer.CellRenderer = bundle.CellRenderer;
    }

    /**
     *
     * @param p5
     * @param {InfoBoxModel} infoBox
     */
    static draw(p5, infoBox) {
        let GeneralInfo = InfoBoxRenderer.BoardRenderer.getCellString(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1], infoBox.playBoard.boardObjects);
        let EcoInfo = InfoBoxRenderer.CellRenderer.getEcoString(infoBox.playBoard.stageGroup, InfoBoxRenderer.BoardLogic.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1], infoBox.playBoard.boardObjects))
        let PassiveInfo = null;
        let ActiveInfo = null;
        let plantImg = null;
        let cell = InfoBoxRenderer.BoardLogic.getCell(infoBox.playBoard.selectedCell[0], infoBox.playBoard.selectedCell[1], infoBox.playBoard.boardObjects);
        let terrainLayer = null;
        if (cell.terrain.layer) terrainLayer = cell.terrain.layer;
        let terrainImg = cell.terrain.img;

        let imgSize = infoBox.boxWidth / 6;
        let textBoxWidth = infoBox.boxWidth - imgSize - 3 * infoBox.paddingX;
        let textBoxHeight = (infoBox.boxHeight - 3 * infoBox.paddingY) / 2;

        p5.noStroke();
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        let fontSizes = InfoBoxRenderer.utilityClass.getFontSize();
        p5.textSize(fontSizes.mini);
        // draw right bottom corner: general info + ecosystem
        // draw background box
        p5.fill(50);
        p5.rect(infoBox.boxRightX, infoBox.boxY, infoBox.boxWidth, infoBox.boxHeight, 10);
        // draw img
        p5.image(terrainImg, infoBox.boxRightX + infoBox.paddingX, infoBox.boxY + (infoBox.boxHeight - imgSize) / 2, imgSize, imgSize);
        if (terrainLayer) p5.image(terrainLayer, infoBox.boxRightX + infoBox.paddingX, infoBox.boxY + (infoBox.boxHeight - imgSize) / 2 - imgSize / 2, imgSize, imgSize);
        // draw general info
        p5.fill(100);
        p5.rect(infoBox.boxRightX + 2 * infoBox.paddingX + imgSize, infoBox.boxY + infoBox.paddingY, textBoxWidth, textBoxHeight, 10);
        p5.fill(255);
        p5.text(GeneralInfo, infoBox.boxRightX + 3 * infoBox.paddingX + imgSize, infoBox.boxY + 2 * infoBox.paddingY, textBoxWidth - 2 * infoBox.paddingX, textBoxHeight - 2 * infoBox.paddingY);
        // draw eco info
        p5.fill(100);
        p5.rect(infoBox.boxRightX + 2 * infoBox.paddingX + imgSize, infoBox.boxY + 2 * infoBox.paddingY + textBoxHeight, textBoxWidth, textBoxHeight, 10);
        p5.fill(255);
        p5.text(EcoInfo, infoBox.boxRightX + 3 * infoBox.paddingX + imgSize, infoBox.boxY + 3 * infoBox.paddingY + textBoxHeight, textBoxWidth - 2 * infoBox.paddingX, textBoxHeight - 2 * infoBox.paddingY);

        // draw left bottom corner: passive + active
        if (cell.plant) {
            PassiveInfo = cell.plant.getPassiveString();
            ActiveInfo = cell.plant.getActiveString();
            plantImg = cell.plant.img;

            // draw background box
            p5.fill(50);
            p5.rect(infoBox.boxLeftX, infoBox.boxY, infoBox.boxWidth, infoBox.boxHeight, 10);
            // draw img
            p5.image(plantImg, infoBox.boxLeftX + infoBox.paddingX, infoBox.boxY + (infoBox.boxHeight - imgSize) / 2, imgSize, imgSize);
            // draw general info
            p5.fill(100);
            p5.rect(infoBox.boxLeftX + 2 * infoBox.paddingX + imgSize, infoBox.boxY + infoBox.paddingY, textBoxWidth, textBoxHeight, 10);
            p5.fill(255);
            p5.text(ActiveInfo, infoBox.boxLeftX + 3 * infoBox.paddingX + imgSize, infoBox.boxY + 2 * infoBox.paddingY, textBoxWidth - 2 * infoBox.paddingX, textBoxHeight - 2 * infoBox.paddingY);
            // draw eco info
            p5.fill(100);
            p5.rect(infoBox.boxLeftX + 2 * infoBox.paddingX + imgSize, infoBox.boxY + 2 * infoBox.paddingY + textBoxHeight, textBoxWidth, textBoxHeight, 10);
            p5.fill(255);
            p5.text(PassiveInfo, infoBox.boxLeftX + 3 * infoBox.paddingX + imgSize, infoBox.boxY + 3 * infoBox.paddingY + textBoxHeight, textBoxWidth - 2 * infoBox.paddingX, textBoxHeight - 2 * infoBox.paddingY);
        }
    }
}

class InfoBoxLogic {
    static setup(bundle) {
        InfoBoxLogic.Button = bundle.Button;
        /** @type {typeof myUtil} */
        InfoBoxLogic.utilityClass = bundle.utilityClass;
        /** @type {typeof BoardLogic} */
        InfoBoxLogic.BoardLogic = bundle.BoardLogic;
        /** @type {Function} */
        InfoBoxLogic.activatePlantSkill = bundle.activatePlantSkill;
        InfoBoxLogic.gameState = bundle.gameState;
    }

    /**
     *
     * @param event
     * @param {InfoBoxModel} infoBox
     */
    static handleScroll(event, infoBox) {

    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static updateInfoBox(playBoard) {
        let selectedCell = playBoard.selectedCell;

        // not clicked a cell, remove buttons
        if (selectedCell.length === 0) {
            InfoBoxLogic.deleteActivateButton(playBoard.infoBox);
            InfoBoxLogic.deleteDisplayButton(playBoard.infoBox);
            return;
        }

        let cell = InfoBoxLogic.BoardLogic.getCell(selectedCell[0], selectedCell[1], playBoard.boardObjects);
        // set on display button
        InfoBoxLogic.setEcoDisplayButton(playBoard.infoBox);
        if (cell.plant && cell.plant.hasActive) {
            // set on activate button
            InfoBoxLogic.setActivateButton(playBoard.infoBox);
        } else {
            InfoBoxLogic.deleteActivateButton(playBoard.infoBox);
        }
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static setActivateButton(infoBox) {
        if (infoBox.activateButton !== null) return;

        let [buttonWidth, buttonHeight] = InfoBoxLogic.utilityClass.relative2absolute(5 / 64, 0.04);
        let buttonX = infoBox.boxLeftX + infoBox.boxWidth / 2 - buttonWidth / 2;
        let buttonY = infoBox.boxY - infoBox.paddingY - buttonHeight;
        let activate = new InfoBoxLogic.Button(buttonX, buttonY, buttonWidth, buttonHeight, "activate", "xbox_RT");
        activate.textSize = InfoBoxLogic.Button.CanvasSize.getFontSize().mini;
        display.mode = InfoBoxLogic.gameState.mode;
        activate.onClick = () => {
            InfoBoxLogic.activatePlantSkill(infoBox.playBoard);
        };
        infoBox.playBoard.buttons.push(activate);
        infoBox.activateButton = activate;
    }

    /**
     *
     * @param {InfoBoxModel} infoBox
     */
    static deleteActivateButton(infoBox) {
        if (infoBox.activateButton === null) return;

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
        if (infoBox.displayButton !== null) return;

        let [buttonWidth, buttonHeight] = InfoBoxLogic.utilityClass.relative2absolute(5 / 64, 0.04);
        let buttonX = infoBox.boxRightX + infoBox.boxWidth / 2 - buttonWidth / 2;
        let buttonY = infoBox.boxY - infoBox.paddingY - buttonHeight;

        let text = infoBox.playBoard.ecoDisplay ? "display off" : "display on";

        let display = new InfoBoxLogic.Button(buttonX, buttonY, buttonWidth, buttonHeight, text, "xbox_X");
        display.textSize = InfoBoxLogic.Button.CanvasSize.getFontSize().mini;
        display.mode = InfoBoxLogic.gameState.mode;
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

export {InfoBoxModel, InfoBoxLogic, InfoBoxRenderer};

if (typeof module !== 'undefined') {
    module.exports = {InfoBoxModel, InfoBoxLogic, InfoBoxRenderer};
}