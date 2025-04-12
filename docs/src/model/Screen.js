/**
 * @typedef {Object} ScreenLike
 * @property {Array} buttons
 * @property {FloatingWindow} floatingWindow
 * @property {Map} allFloatingWindows
 * @property {GameState} gameState
 */

export class ScreenModel {
    /**
     *
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        /** @type {FloatingWindow} */
        this.floatingWindow = null;
        /** @type {Map} */
        this.allFloatingWindows = null;
    }
}

export class ScreenRenderer{
    // general logic
    // remember to invoke this method in `draw()` to ensure logic.
    /**
     *
     * @param p5
     * @param {ScreenLike} screen
     * @param {function} setFloatingWindowFn
     */
    static drawFloatingWindow(p5, screen, setFloatingWindowFn) {
        setFloatingWindowFn(p5, screen);
        if (screen.floatingWindow !== null) {
            if (screen.floatingWindow.isFading) {
                screen.floatingWindow.fadeOut();
                if (screen.floatingWindow.hasFadedOut()) {
                    screen.floatingWindow = null;
                } else {
                    screen.floatingWindow.draw();
                }
            } else {
                screen.floatingWindow.draw();
            }
        }
    }
}

export class ScreenLogic {
    static setup(bundle){
        /** @type {typeof InventoryLogic} */
        ScreenLogic.InventoryLogic = bundle.InventoryLogic;
    }

    // general logic
    // remember to invoke this method in `handleClick()` to ensure logic.
    /**
     *
     * @param {ScreenLike} screen
     */
    static handleFloatingWindow(screen) {
        if (screen.floatingWindow !== null) {
            if (!screen.floatingWindow.isFading) {
                screen.floatingWindow.isFading = true;
                if (!screen.floatingWindow.playerCanClick) {
                    return true;
                }
            }
            if (!screen.floatingWindow.playerCanClick) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param p5
     * @param event
     * @param {ScreenLike} screen
     */
    static handleScroll(p5, event, screen) {
        if (!screen.gameState) return;
        if (p5.mouseX >= screen.gameState.inventory.inventoryX
            && p5.mouseX <= screen.gameState.inventory.inventoryX + screen.gameState.inventory.inventoryWidth
            && p5.mouseY >= screen.gameState.inventory.inventoryY
            && p5.mouseY <= screen.gameState.inventory.inventoryY + screen.gameState.inventory.inventoryHeight) {
            ScreenLogic.InventoryLogic.handleScroll(event, screen.gameState.inventory);
        }
    }
}
