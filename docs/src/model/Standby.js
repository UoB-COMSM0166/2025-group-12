import { Button } from "../items/Button.js";
import { stateCode } from "./GameState.js";

export class StandbyMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
    }

    setup(p5) {
        let stageButton = new Button(250, 200, 200, 50, "Select Stage");
        stageButton.onClick = () => this.gameState.setState(stateCode.PLAY);

        this.buttons.push(stageButton);
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
        p5.text("Standby Menu", p5.width / 2, 50);

        for (let button of this.buttons) {
            button.draw(p5);
        }
    }
}

