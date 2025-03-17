export class Screen {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        this.floatingWindow = null;
        this.allFloatingWindows = null;
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

}