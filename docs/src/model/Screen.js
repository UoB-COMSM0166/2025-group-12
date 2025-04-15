import {CanvasSize} from "../CanvasSize.js";

export class Screen {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        this.floatingWindow = null;
        this.allFloatingWindows = null;
        this.fade = 0;
        this.isStart = true;
        this.fadeIn = 255;
    }

    // init buttons and keyboard listeners.
    setup(p5) {
        console.error("setup not implemented!");
    }

    reset(p5) {
        this.buttons = [];
        this.floatingWindow = null;
        this.allFloatingWindows = null;
        this.setup(p5);
    }

    handleClick(p5) {
        console.error("handleClick not implemented!");
    }

    handleScroll(p5, event) {
        if (!this.gameState) return;
        if (p5.mouseX >= this.gameState.inventory.inventoryX
            && p5.mouseX <= this.gameState.inventory.inventoryX + this.gameState.inventory.inventoryWidth
            && p5.mouseY >= this.gameState.inventory.inventoryY
            && p5.mouseY <= this.gameState.inventory.inventoryY + this.gameState.inventory.inventoryHeight) {
            this.gameState.inventory.handleScroll(event);
        }
    }

    draw(p5) {
        console.error("draw not implemented!");
    }

    // general logic
    // remember to invoke this method in the most above to ensure logic.
    handleFloatingWindow() {
        if (this.floatingWindow !== null) {
            if (!this.floatingWindow.isFading) {
                this.floatingWindow.isFading = true;
                if (!this.floatingWindow.playerCanClick) {
                    return true;
                }
            }
            if (!this.floatingWindow.playerCanClick) {
                return true;
            }
        }
        return false;
    }

    // general logic
    drawFloatingWindow(p5) {
        this.setFloatingWindow(p5);
        if (this.floatingWindow !== null) {
            if (this.floatingWindow.isFading) {
                this.floatingWindow.fadeOut();
                if (this.floatingWindow.hasFadedOut()) {
                    this.floatingWindow = null;
                } else {
                    this.floatingWindow.draw();
                }
            } else {
                this.floatingWindow.draw();
            }
        }
    }

    setFloatingWindow(p5) {
        console.error("setFloatingWindow not implemented!");
    }

    initAllFloatingWindows(p5) {
        console.error("initAllFloatingWindows not implemented!");
    }

    playFadeInAnimation(p5) {
        this.fadeIn -= 10;
        p5.noStroke();
        p5.fill(0, this.fadeIn);
        p5.rect(0, 0, CanvasSize.getSize()[0], CanvasSize.getSize()[1]);
        if(this.fadeIn <= 0){
            this.fadeIn = 255;
            this.isStart = false;
        }
    }

    playFadeOutAnimation(p5) {
        this.fade += 10;
        p5.noStroke();
        p5.fill(0, this.fade);
        p5.rect(0, 0, CanvasSize.getSize()[0], CanvasSize.getSize()[1]);
        if(this.fade >= 255) {
            this.gameState.fading = false;
            this.fade = 0;
            this.gameState.setState(this.gameState.nextState);
            this.isStart = true;
        }
    }

}