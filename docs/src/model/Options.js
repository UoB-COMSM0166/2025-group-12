import {Button} from "../items/Button.js";
import {myUtil} from "../../lib/myUtil.js";
import {GameState, stateCode} from "./GameState.js";
import {CanvasSize} from "../CanvasSize.js";
import {Checkbox} from "../items/Checkbox.js";

export class Options {
    constructor(controller) {
        this.controller = controller;
        this.buttons = [];
        this.languageManager = this.controller.gameState.languageManager;
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myUtil.relative2absolute(0.10, 0.05);
        let [buttonX, buttonY] = myUtil.relative2absolute(0.5, 0.3);
        let buttonInter = myUtil.relative2absolute(0.1, 0.1)[1];

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

        let [checkboxWidth, checkboxHeight] = myUtil.relative2absolute(0.001 * 9, 0.001 * 16);
        let fullScreenCheckbox = new Checkbox(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, checkboxWidth, checkboxHeight, 'Fullscreen');
        fullScreenCheckbox.onClick = () => {
            if (fullScreenCheckbox.isChecked) {
                myUtil.exitFullscreen();
                p5.resizeCanvas(1280, 720);
                CanvasSize.setSize(1280, 720);
                this.controller.reset(p5);
            } else {
                let screenWidth = window.screen.width;
                let screenHeight = window.screen.height;
                myUtil.enterFullscreen();
                p5.resizeCanvas(screenWidth, screenHeight);
                CanvasSize.setSize(screenWidth, screenHeight);
                this.controller.reset(p5);
            }
            fullScreenCheckbox.isChecked = !fullScreenCheckbox.isChecked;
        }
        this.buttons.push(englishButton, chineseButton, fullScreenCheckbox);
    }

    reset(p5) {

    }

    handleClick(p5) {
        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                // this.controller.gameState.showOptions = !this.controller.gameState.showOptions;
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
        let [textX, textY] = myUtil.relative2absolute(0.5, 0.2);
        p5.text("Options", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }
    }
}

