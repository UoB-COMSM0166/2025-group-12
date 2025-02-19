import { Button } from "../items/Button.js";
import { stateCode,stageCode } from "./GameState.js";
import { CanvasSize } from "../CanvasSize.js";
import { myutil } from "../../lib/myutil.js";

export class StandbyMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
    }

    setup(p5) {

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = myutil.relative2absolute(0.2, 0.2);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let stage1Button = new Button(buttonX, buttonY + buttonInter * 0, buttonWidth, buttonHeight, "Stage 1");
        stage1Button.onClick = () => {this.gameState.setState(stateCode.PLAY);this.gameState.currentStageCode = stageCode.STAGE1};

        let stage2Button = new Button(buttonX, buttonY + buttonInter * 1, buttonWidth, buttonHeight, "Stage 2");
        stage2Button.onClick = () => {this.gameState.setState(stateCode.PLAY);this.gameState.currentStageCode = stageCode.STAGE2};
        
        let stage3Button = new Button(buttonX, buttonY + buttonInter * 2, buttonWidth, buttonHeight, "Stage 3");
        stage3Button.onClick = () => {console.log("placeholder3")};

        let stage4Button = new Button(buttonX, buttonY + buttonInter * 3, buttonWidth, buttonHeight, "Stage 4");
        stage4Button.onClick = () => {console.log("placeholder4")};

        let stage5Button = new Button(buttonX, buttonY + buttonInter * 4, buttonWidth, buttonHeight, "Stage 5");
        stage5Button.onClick = () => {console.log("placeholder5")};

        this.buttons.push(stage1Button, stage2Button, stage3Button, stage4Button, stage5Button);
    }

    handleClick(p5) {
        for (let button of this.buttons) {
            button.mouseClick(p5);
        }
    }

    draw(p5) {
        p5.background(80);
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.TOP);
        let [textX, textY] = myutil.relative2absolute(0.5, 0.1);
        p5.text("Standby Menu", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }

        this.gameState.inventory.draw(p5, CanvasSize.getSize()[0], CanvasSize.getSize()[1]);
    }
}

