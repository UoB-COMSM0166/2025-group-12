import {Button} from "../items/Button.js";
import {myutil} from "../../lib/myutil.js";
import {GameSave} from "./GameSave.js";
import {stateCode} from "./GameState.js";

export class PauseMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
    }

    setup(p5) {
        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = myutil.relative2absolute(0.5, 0.3);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let continueButton = new Button(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "Continue");
        continueButton.onClick = () => {
            this.gameState.togglePaused();
        }

        let loadGameButton = new Button(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            GameSave.load(p5);
            this.gameState.togglePaused();
        }

        let saveGameButton = new Button(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, buttonWidth, buttonHeight, "Save Game");
        saveGameButton.onClick = () => {
            GameSave.save(p5);
            this.gameState.togglePaused();
        }

        let escapeText = this.gameState.state === stateCode.PLAY ? 'Quit' : 'Back';
        let escapeButton = new Button(buttonX - buttonWidth / 2, buttonY + 3 * buttonInter, buttonWidth, buttonHeight, escapeText);
        escapeButton.onClick = () => {
            this.gameState.togglePaused();
            if (this.gameState.state === stateCode.PLAY) {
                this.gameState.setState(stateCode.STANDBY);
            }else{
                this.gameState.setState(stateCode.MENU);
            }
            this.gameState.setPlayerCanClick(true);
        };
        this.buttons.push(continueButton, loadGameButton, saveGameButton, escapeButton);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }
        this.gameState.togglePaused();
    }

    draw(p5) {
        p5.background(0, 0, 0, 80);
        p5.fill(255);
        p5.textSize(50);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let [textX, textY] = myutil.relative2absolute(0.5, 0.2);
        p5.text("PAUSE", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }
    }
}

