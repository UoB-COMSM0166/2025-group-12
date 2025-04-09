import {Button} from "../items/Button.js";
import {stateCode} from "./GameState.js";
import {myutil} from "../../lib/myutil.js";
import {GameSave} from "./GameSave.js";
import {LanguageManager} from "../LanguageManager.js";
import {MenuItem} from "../items/MenuItem.js";

export class StartMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        this.languageManager = this.gameState.languageManager;
        this.interactives = Array.from({length: 5},
            () => Array.from({length: 5}, () => null));
        this.row = 0;
        this.col = 0;
        this.x = 640;
        this.y = 360;
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = myutil.relative2absolute(0.2, 0.6);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, this.languageManager.getText('newGame'));
        newGameButton.onClick = () => this.gameState.setState(stateCode.STANDBY);


        let optionsButton = new MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, this.languageManager.getText('options'));
        optionsButton.onClick = () => {
            this.gameState.showOptions = !this.gameState.showOptions;
        }

        let continueButton = new MenuItem(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, buttonWidth, buttonHeight, "Other");

        this.buttons.push(newGameButton, optionsButton, continueButton);
        this.setupInteractive();
    }

    reset(p5) {
        this.buttons = [];
        this.setup(p5);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            button.mouseClick(p5);
        }
    }

    draw(p5) {
        p5.background(50);
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.TOP);
        let [textX, textY] = myutil.relative2absolute(0.5, 0.1);
        p5.text(this.languageManager.getText('startMenu'), textX, textY);

        for (let button of this.buttons) {
            if (button.update) {
                button.update(p5);
            }
            button.draw(p5);
        }

        p5.circle(this.x, this.y, 10);
    }

    changeNewToResume() {
        let newGameButton = this.buttons.find(button => button.text.startsWith("New Game"));
        if (newGameButton !== null && newGameButton !== undefined) {
            newGameButton.text = "Resume Game";
        }
    }

    updateText() {
        this.buttons[0].text = this.languageManager.getText('newGame');
        this.buttons[1].text = this.languageManager.getText('loadGame');
        this.buttons[2].text = this.languageManager.getText('options');
    }

    setupInteractive() {
        this.interactives[0][0] = this.buttons[0];
        this.interactives[1][0] = this.buttons[1];
        this.interactives[2][0] = this.buttons[2];
    }

    moveSelection(dRow, dCol) {
        let newRow = Math.max(0, Math.min(this.row + dRow, this.interactives.length - 1));
        let newCol = Math.max(0, Math.min(this.col + dCol, this.interactives[newRow].length - 1));

        if(this.interactives[newRow][newCol]){
            this.interactives[this.row][this.col].isSelected = false;
            this.row = newRow;
            this.col = newCol;
            this.interactives[newRow][newCol].isSelected = true;
        }
    }

}


