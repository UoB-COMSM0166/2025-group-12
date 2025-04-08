export class ScreenModel {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        this.floatingWindow = null;
        this.allFloatingWindows = null;
    }
}

export class ScreenRenderer{
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'ScreenRenderer',
            impl,
            methods: ['setup', 'draw','drawFloatingWindow']
        });
    }

    // general logic
    static drawFloatingWindow(p5, screen) {
        screen.setFloatingWindow(p5);
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
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'ScreenLogic',
            impl,
            methods: ['setup', 'handleClick', 'handleScroll',  'handleFloatingWindow', 'setFloatingWindow', 'initAllFloatingWindows']
        });
    }

    // general logic
    // remember to invoke this method in `draw()` to ensure logic.
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

    static handleScroll(p5, event, screen) {
        if (!screen.gameState) return;
        if (p5.mouseX >= screen.gameState.inventory.inventoryX
            && p5.mouseX <= screen.gameState.inventory.inventoryX + screen.gameState.inventory.inventoryWidth
            && p5.mouseY >= screen.gameState.inventory.inventoryY
            && p5.mouseY <= screen.gameState.inventory.inventoryY + screen.gameState.inventory.inventoryHeight) {
            screen.gameState.inventory.handleScroll(event);
        }
    }
}
