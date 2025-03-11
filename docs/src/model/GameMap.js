import {myutil} from "../../lib/myutil.js";
import {Button} from "../items/Button.js";
import {GameSave} from "./GameSave.js";
import {stageGroup, stateCode} from "./GameState.js";
import {Icon} from "../items/Icon.js";
import {CanvasSize} from "../CanvasSize.js";

export class GameMap {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvasWidth = CanvasSize.getSize()[0];
        this.canvasHeight = CanvasSize.getSize()[1];
        this.buttons = [];
        this.icons = [];
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.09, 0.16);
        let [buttonX, buttonY] = myutil.relative2absolute(0.35, 0.25);
        let buttonInter = myutil.relative2absolute(0.2, 0.2)[1];

        let level1Icon = new Icon(p5, buttonX, buttonY, buttonWidth, buttonHeight);
        console.log("level1Icon", level1Icon);
        level1Icon.onClick = () => {
            this.gameState.setState(stateCode.PLAY);
            this.gameState.currentStageGroup = stageGroup.TORNADO;
        }
        this.icons.push(level1Icon);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }

        for (let icon of this.icons) {
            if (icon.mouseClick(p5)) {
                return;
            }
        }
    }

    handleKey() {

    }

    draw(p5) {
        p5.image(p5.images.get("GameMap"), 0, 0, this.canvasWidth, this.canvasHeight);
        for (let button of this.buttons) {
            button.draw(p5);
        }

        for (let icon of this.icons) {
            icon.update();
            icon.draw(p5);
        }
    }

}