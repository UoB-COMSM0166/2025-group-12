import {Button} from "../items/Button.js";
import {stageGroup, stateCode} from "./GameState.js";
import {myutil} from "../../lib/myutil.js";
import {GameSave} from "./GameSave.js";
import {LanguageManager} from "../LanguageManager.js";
import {MenuItem} from "../items/MenuItem.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {Screen} from "./Screen.js";

export class StartMenu extends Screen {
    constructor(gameState) {
        super(gameState);
        this.languageManager = this.gameState.languageManager;
    }

    setup(p5) {
        this.initAllFloatingWindows(p5);

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = myutil.relative2absolute(0.2, 0.6);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "New Game");
        newGameButton.onClick = () => this.gameState.setState(stateCode.STANDBY);

        let loadGameButton = new MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if(!GameSave.load(p5)){
                this.copyFloatingWindow(p5, "NoSaveData");
            }
        }

        let optionsButton = new MenuItem(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, buttonWidth, buttonHeight, "Options");
        optionsButton.onClick = () => {
            this.gameState.showOptions = !this.gameState.showOptions;
        }

        this.buttons.push(newGameButton, loadGameButton, optionsButton);
    }

    reset(p5) {
        this.buttons = [];
        this.setup(p5);
    }

    handleClick(p5) {
        if (this.handleFloatingWindow()) {
            return;
        }
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

        this.drawFloatingWindow(p5);
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

    copyFloatingWindow(p5, str) {
        this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get(str));
    }

    setFloatingWindow(p5) {
    }

    initAllFloatingWindows(p5) {
        let afw = new Map();

        myutil.commonFloatingWindows(p5, afw);

        this.allFloatingWindows = afw;
    }
}


