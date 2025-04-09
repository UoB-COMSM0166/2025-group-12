import {stateCode} from "./GameState.js";
import {myutil} from "../../lib/myutil.js";

export class ConsoleState {
    constructor(gameState) {
        this.gameState = gameState;
        this.gamepadButtonState = Array(16).fill(false);
        this.position;
        this.gamepad;
        this.gamepadButtonState = Array(16).fill(false);
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepad = e.gamepad;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            this.gamepad = null;
        });
        this.mouseSpeed = 20;
        this.index = 0;
    }

    updateGamepad(saveState, currentMenu, p5) {
        if (this.gamepad) {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.gamepad.index];
            const axisX = gamepad.axes[0];
            const axisY = gamepad.axes[1];
            if (gamepad) {
                if (saveState === stateCode.MENU) {
                    if ((gamepad.buttons[12].pressed || axisY < -0.5) && !this.gamepadButtonState[12]) {
                        currentMenu.buttons[this.index].isSelected = false;
                        if(this.index === 0) this.index = 2;
                        else this.index--;
                        currentMenu.buttons[this.index].isSelected = true;
                        this.gamepadButtonState[12] = true;
                    }
                    if ((gamepad.buttons[13].pressed || axisY > 0.5) && !this.gamepadButtonState[13]) {
                        currentMenu.buttons[this.index].isSelected = false;
                        if(this.index === 2) this.index = 0;
                        else this.index++;
                        currentMenu.buttons[this.index].isSelected = true;
                        this.gamepadButtonState[13] = true;
                    }
                    if(gamepad.buttons[0].pressed && !this.gamepadButtonState[0]) {
                        currentMenu.buttons[this.index].onClick();
                    }
                }

                // simulate mousemove
                if (saveState === stateCode.PLAY) {
                    if (Math.abs(axisX) > 0.2 || Math.abs(axisY) > 0.2) {
                        // edges of the grid under old grid-centered coordinates
                        let leftEdge = -(currentMenu.gridSize * currentMenu.cellWidth) / 2;
                        let rightEdge = (currentMenu.gridSize * currentMenu.cellWidth) / 2;
                        let topEdge = -(currentMenu.gridSize * currentMenu.cellHeight) / 2;
                        let bottomEdge = (currentMenu.gridSize * currentMenu.cellHeight) / 2;


                        let updateX = currentMenu.x + axisX * this.mouseSpeed;
                        let updateY = currentMenu.y + axisY * this.mouseSpeed;

                        // mouse position under old grid-centered coordinates
                        let oldX = myutil.oldCoorX(currentMenu, updateX - currentMenu.canvasWidth / 2, updateY - currentMenu.canvasHeight / 2);
                        let oldY = myutil.oldCoorY(currentMenu, updateX - currentMenu.canvasWidth / 2, updateY - currentMenu.canvasHeight / 2);

                        oldX = oldX <= leftEdge ? leftEdge : oldX;
                        oldY = oldY <= topEdge ? topEdge : oldY;
                        oldX = oldX >= rightEdge ? rightEdge : oldX;
                        oldY = oldY >= bottomEdge ? bottomEdge : oldY;
                        currentMenu.x = myutil.newCoorX(currentMenu, oldX, oldY) + currentMenu.canvasWidth / 2;
                        currentMenu.y = myutil.newCoorY(currentMenu, oldX, oldY) + currentMenu.canvasHeight / 2;
                    }

                    if (gamepad.buttons[12].pressed && !this.gamepadButtonState[12]) {
                        this.gameState.inventory.index = Math.max(this.gameState.inventory.index - 1, 0);
                        this.gamepadButtonState[12] = true;

                    }

                    if (gamepad.buttons[13].pressed && !this.gamepadButtonState[13]) {
                        this.gameState.inventory.index++;
                        this.gamepadButtonState[13] = true;
                    }
                }

                gamepad.buttons.forEach((button, i) => {
                    if (!button.pressed && Math.abs(axisY) < 0.5 && Math.abs(axisX) < 0.5) {
                        this.gamepadButtonState[i] = false;
                    }
                });
            }
        }
    }

}