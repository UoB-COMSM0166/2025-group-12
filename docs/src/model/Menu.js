import { Button } from "../items/Button.js";
import { stateCode } from "./GameState.js";

export class StartMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
    }

    setup(p5) {
        let newGameButton = new Button(250, 150, 200, 50, "New Game");
        newGameButton.onClick = () => this.gameState.setState(stateCode.STANDBY);

        let loadGameButton = new Button(250, 250, 200, 50, "Load Game");
        loadGameButton.onClick = () => console.log("Load Game (placeholder)");

        this.buttons.push(newGameButton, loadGameButton);
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
        p5.text("Start Menu", p5.width / 2, 50);

        for (let button of this.buttons) {
            button.draw(p5);
        }
    }
}


