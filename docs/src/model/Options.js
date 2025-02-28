import {Button} from "../items/Button.js";
import {myutil} from "../../lib/myutil.js";
import {GameSave} from "./GameSave.js";
import {GameState, stateCode} from "./GameState.js";
import {LanguageManager} from "../LanguageManager.js";

export class Options {
    constructor(controller) {
        this.controller = controller;
        this.buttons = [];
        this.languageManager = this.controller.gameState.languageManager;
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.10, 0.05);
        let [buttonX, buttonY] = myutil.relative2absolute(0.5, 0.3);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let englishButton = new Button(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, 'English');
        englishButton.onClick = () => {
            this.languageManager.setLanguage('en');
            this.controller.menus[stateCode.MENU].updateText();
        }

        let chineseButton = new Button(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, '简体中文');
        chineseButton.onClick = () => {
            this.languageManager.setLanguage('zh');
            this.controller.menus[stateCode.MENU].updateText();
        }
        this.buttons.push(englishButton,chineseButton);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                this.controller.gameState.showOptions = !this.controller.gameState.showOptions;
                return;
            }
        }
        this.controller.gameState.showOptions = !this.controller.gameState.showOptions;
    }

    handleKey() {

    }

    draw(p5) {
        p5.background(0, 0, 0, 80);
        p5.fill(255);
        p5.textSize(50);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let [textX, textY] = myutil.relative2absolute(0.5, 0.2);
        p5.text("Options", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }
    }
}

