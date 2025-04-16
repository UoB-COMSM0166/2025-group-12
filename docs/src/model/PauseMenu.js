// @ts-nocheck
import { CanvasSize } from "../CanvasSize.js"; // 修改部分

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

        this.index = 0;

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
                this.gameState.isFading = true;
                this.gameState.nextState = PauseMenuModel.stateCode.STANDBY;
            } else {
                this.gameState.isFading = true;
                this.gameState.nextState = PauseMenuModel.stateCode.MENU;
            }
            this.gameState.setPlayerCanClick(true);
        };
        this.buttons.push(continueButton, loadGameButton, saveGameButton, escapeButton);
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.buttons.forEach(button => {
            button.mode = "gamepad";
            button.isSelected = false;
        });
        this.buttons[0].isSelected = true;
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.buttons[this.index].isSelected = false;
        this.buttons.forEach(button => {
            button.mode = "mouse";
        });
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

        // p5.textSize(50);
        let fontSizes = CanvasSize.getFontSize();  // Get the font size based on the resolution
        p5.textSize(fontSizes.large)  // Adjust font parameters according to UI design

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
        PauseMenuRenderer.ScreenRenderer.drawFloatingWindow(p5, /** @type {ScreenLike} */pauseMenu, PauseMenuLogic.setFloatingWindow);
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
    static cancel(pauseMenu){
        pauseMenu.gameState.togglePaused();
    }

    /**
     *
     * @param index
     * @param {PauseMenuModel} pauseMenu
     */
    static handleGamepad(index, pauseMenu){
        switch (index) {
            case 1:
                PauseMenuLogic.cancel(pauseMenu);
                break;
            case 12:
                pauseMenu.buttons[pauseMenu.index].isSelected = false;
                if (pauseMenu.index === 0) pauseMenu.index = pauseMenu.buttons.length - 1;
                else pauseMenu.index--;
                pauseMenu.buttons[pauseMenu.index].isSelected = true;
                break;
            case 13:
                pauseMenu.buttons[pauseMenu.index].isSelected = false;
                if (pauseMenu.index === pauseMenu.buttons.length - 1) pauseMenu.index = 0;
                else pauseMenu.index++;
                pauseMenu.buttons[pauseMenu.index].isSelected = true;
                break;
        }

    }

    static handleAnalogStick(p5, axes, pauseMenu) {

    }

    /**
     *
     * @param axes
     * @param {PauseMenuModel} pauseMenu
     */
    static handleAnalogStickPressed(axes, pauseMenu) {
        if(axes[1] < 0){
            pauseMenu.buttons[pauseMenu.index].isSelected = false;
            if (pauseMenu.index === 0) pauseMenu.index = 3;
            else pauseMenu.index--;
            pauseMenu.buttons[pauseMenu.index].isSelected = true;
        }
        else{
            pauseMenu.buttons[pauseMenu.index].isSelected = false;
            if (pauseMenu.index === 3) pauseMenu.index = 0;
            else pauseMenu.index++;
            pauseMenu.buttons[pauseMenu.index].isSelected = true;
        }
    }

    /**
     *
     * @param {PauseMenuModel} pauseMenu
     */
    static handleFloatingWindow(pauseMenu) {
        return PauseMenuLogic.ScreenLogic.handleFloatingWindow(/** @type {ScreenLike} */pauseMenu);
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
        pauseMenu.floatingWindow = /** @type {FloatingWindow} */ PauseMenuLogic.FloatingWindow.copyOf(pauseMenu.allFloatingWindows.get(str));
    }
}

export {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer};

if (typeof module !== 'undefined') {
    module.exports = {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer};
}