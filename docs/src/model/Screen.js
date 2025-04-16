/**
 * @typedef {Object} ScreenLike
 * @property {Array} buttons
 * @property {FloatingWindow} floatingWindow
 * @property {Map} allFloatingWindows
 * @property {GameState} gameState
 * @property {number} fade
 * @property {boolean} isFading
 * @property {boolean} isEntering
 * @property {number} fadeIn
 */

class ScreenModel {
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

        this.fade = 0;
        this.isEntering = true;
        this.fadeIn = 255;
    }
}

class ScreenRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        ScreenRenderer.utilityClass = bundle.utilityClass;
    }

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

    /**
     *
     * @param p5
     * @param {ScreenLike} screen
     */
    static playFadeInAnimation(p5, screen) {
        screen.fadeIn -= 10;
        p5.noStroke();
        p5.fill(0, screen.fadeIn);
        let [canvasWidth, canvasLength] = ScreenRenderer.utilityClass.relative2absolute(1, 1)
        p5.rect(0, 0, canvasWidth, canvasLength);
        if (screen.fadeIn <= 0) {
            screen.fadeIn = 255;
            screen.isEntering = false;
        }
    }

    /**
     *
     * @param p5
     * @param {ScreenLike} screen
     */
    static playFadeOutAnimation(p5, screen) {
        screen.fade += 10;
        p5.noStroke();
        p5.fill(0, screen.fade);
        let [canvasWidth, canvasLength] = ScreenRenderer.utilityClass.relative2absolute(1, 1)
        p5.rect(0, 0, canvasWidth, canvasLength);
    }
}

class ScreenLogic {
    static setup(bundle) {
        ScreenLogic.p5 = bundle.p5;
        /** @type {typeof InventoryLogic} */
        ScreenLogic.InventoryLogic = bundle.InventoryLogic;
    }

    /**
     *
     * @param p5
     * @param {ScreenLike} screen
     */
    static stateTransitionAtFading(p5, screen) {
        if (screen.fade >= 255) {
            screen.gameState.isFading = false;
            screen.fade = 0;
            screen.gameState.setState(screen.gameState.nextState);
            screen.isEntering = true;
        }
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
     * @param event
     * @param {ScreenLike} screen
     */
    static handleScroll(event, screen) {
        let p5 = ScreenLogic.p5;
        if (!screen.gameState) return;
        if (p5.mouseX >= screen.gameState.inventory.inventoryX
            && p5.mouseX <= screen.gameState.inventory.inventoryX + screen.gameState.inventory.inventoryWidth
            && p5.mouseY >= screen.gameState.inventory.inventoryY
            && p5.mouseY <= screen.gameState.inventory.inventoryY + screen.gameState.inventory.inventoryHeight) {
            ScreenLogic.InventoryLogic.handleScroll(event, screen.gameState.inventory);
        }
    }
}

export {ScreenModel, ScreenLogic, ScreenRenderer};

if (typeof module !== 'undefined') {
    module.exports = {ScreenModel, ScreenLogic, ScreenRenderer};
}