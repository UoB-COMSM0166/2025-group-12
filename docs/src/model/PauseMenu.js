/**
 * @implements ScreenLike
 */
class PauseMenuModel {
    static setup(bundle) {
        PauseMenuModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        PauseMenuModel.utilityClass = bundle.utilityClass;
        PauseMenuModel.stateCode = bundle.stateCode;
        /** @type {typeof Button} */
        PauseMenuModel.Button = bundle.Button;
        /** @type {typeof GameSerializer} */
        PauseMenuModel.GameSerializer = bundle.GameSerializer;
    }

    /**
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        /** @type {FloatingWindow} */
        this.floatingWindow = null;
        /** @type {Map} */
        this.allFloatingWindows = null;

        this.init();
    }

    init() {
        let [buttonWidth, buttonHeight] = PauseMenuModel.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = PauseMenuModel.utilityClass.relative2absolute(0.5, 0.3);
        let buttonInter = PauseMenuModel.utilityClass.relative2absolute(0.1, 0.1)[1];

        let continueButton = new PauseMenuModel.Button(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "Continue");
        continueButton.onClick = () => {
            this.gameState.togglePaused();
        }

        let loadGameButton = new PauseMenuModel.Button(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if (!PauseMenuModel.GameSerializer.load()) {
                PauseMenuLogic.copyFloatingWindow(PauseMenuModel.p5, "NoSaveData", this);
            } else {
                this.gameState.togglePaused();
            }
        }

        let saveGameButton = new PauseMenuModel.Button(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, buttonWidth, buttonHeight, "Save Game");
        saveGameButton.onClick = () => {
            PauseMenuModel.GameSerializer.save();
            this.gameState.togglePaused();
        }

        let escapeText = this.gameState.state === PauseMenuModel.stateCode.PLAY ? 'Quit' : 'Back';
        let escapeButton = new PauseMenuModel.Button(buttonX - buttonWidth / 2, buttonY + 3 * buttonInter, buttonWidth, buttonHeight, escapeText);
        escapeButton.onClick = () => {
            this.gameState.togglePaused();
            if (this.gameState.state === PauseMenuModel.stateCode.PLAY) {
                this.gameState.fading = true;
                this.gameState.nextState = PauseMenuModel.stateCode.STANDBY;
            } else {
                this.gameState.fading = true;
                this.gameState.nextState = PauseMenuModel.stateCode.MENU;
            }
            this.gameState.setPlayerCanClick(true);
        };
        this.buttons.push(continueButton, loadGameButton, saveGameButton, escapeButton);
    }
}

class PauseMenuRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        PauseMenuRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof ScreenRenderer} */
        PauseMenuRenderer.ScreenRenderer = bundle.ScreenRenderer;
    }

    /**
     *
     * @param p5
     * @param {PauseMenuModel} pauseMenu
     */
    static draw(p5, pauseMenu) {
        p5.background(0, 0, 0, 80);
        p5.fill(255);
        p5.textSize(50);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let [textX, textY] = PauseMenuRenderer.utilityClass.relative2absolute(0.5, 0.2);
        p5.text("PAUSE", textX, textY);

        for (let button of pauseMenu.buttons) {
            button.draw(p5);
        }

        PauseMenuRenderer.drawFloatingWindow(p5, pauseMenu);
    }

    /**
     *
     * @param p5
     * @param {PauseMenuModel} pauseMenu
     */
    static drawFloatingWindow(p5, pauseMenu) {
        PauseMenuRenderer.ScreenRenderer.drawFloatingWindow(p5, pauseMenu, PauseMenuLogic.setFloatingWindow);
    }
}

class PauseMenuLogic {
    static setup(bundle) {
        /** @type {typeof ScreenLogic} */
        PauseMenuLogic.ScreenLogic = bundle.ScreenLogic;
        PauseMenuLogic.FloatingWindow = bundle.FloatingWindow;
    }

    /**
     *
     * @param {PauseMenuModel} pauseMenu
     */
    static handleFloatingWindow(pauseMenu) {
        return PauseMenuLogic.ScreenLogic.handleFloatingWindow(pauseMenu);
    }

    // placeholder - pause menu does not control inventory scrolling
    static handleScroll() {
    }

    /**
     *
     * @param p5
     * @param {PauseMenuModel} pauseMenu
     */
    static handleClick(p5, pauseMenu) {
        if (PauseMenuLogic.handleFloatingWindow(pauseMenu)) {
            return;
        }

        for (let button of pauseMenu.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }
    }

    /**
     *
     * @param p5
     * @param {PauseMenuModel} pauseMenu
     */
    static setFloatingWindow(p5, pauseMenu) {
        // if no save data found, copy a failed FW. refactor
    }

    /**
     *
     * @param p5
     * @param {String} str
     * @param {PauseMenuModel} pauseMenu
     */
    static copyFloatingWindow(p5, str, pauseMenu) {
        pauseMenu.floatingWindow = PauseMenuLogic.FloatingWindow.copyOf(pauseMenu.allFloatingWindows.get(str));
    }
}

export {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer};

if (typeof module !== 'undefined') {
    module.exports = {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer};
}