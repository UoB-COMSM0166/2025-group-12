import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {GameSave} from "./GameSave.js";
import {stageGroup, stateCode} from "./GameState.js";

export class LevelSelection {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.09, 0.16);
        let [buttonX, buttonY] = myutil.relative2absolute(0.4, 0.3);
        let buttonInter = myutil.relative2absolute(0.2, 0.2)[1];

        let level1Button = new Button(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "1-1");
        level1Button.onClick = () => {
            this.gameState.setState(stateCode.PLAY);
            this.gameState.currentStageGroup = stageGroup.TORNADO;
        }
        let level2Button = new Button(buttonX - buttonWidth / 2 + buttonInter, buttonY, buttonWidth, buttonHeight, "1-2");
        let level3Button = new Button(buttonX - buttonWidth / 2 + 2 * buttonInter, buttonY, buttonWidth, buttonHeight, "1-3");
        let level4Button = new Button(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "1-4");
        let level5Button = new Button(buttonX - buttonWidth / 2 + buttonInter , buttonY + buttonInter, buttonWidth, buttonHeight, "1-5");
        this.buttons.push(level1Button, level2Button, level3Button, level4Button, level5Button);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }
    }

    handleKey() {

    }

    draw(p5) {
        p5.background(0, 0, 0, 80);
        for (let button of this.buttons) {
            button.draw(p5);
        }
    }

}