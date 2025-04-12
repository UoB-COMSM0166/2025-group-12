/**
 * @implements ScreenLike
 */
export class StartMenuModel {
    static setup(bundle) {
        StartMenuModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        StartMenuModel.utilityClass = bundle.utilityClass;
        StartMenuModel.stateCode = bundle.stateCode;
        /** @type {typeof Button} */
        StartMenuModel.Button = bundle.Button;
        StartMenuModel.FloatingWindow = bundle.FloatingWindow;
        /** @type {typeof GameSerializer} */
        StartMenuModel.GameSerializer = bundle.GameSerializer;
        /** @type {typeof MenuItem} */
        StartMenuModel.MenuItem = bundle.MenuItem;
    }

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

    init() {
        let [buttonWidth, buttonHeight] = StartMenuModel.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = StartMenuModel.utilityClass.relative2absolute(0.2, 0.6);
        let buttonInter = StartMenuModel.utilityClass.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new StartMenuModel.MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "New Game");
        newGameButton.onClick = () => this.gameState.setState(StartMenuModel.stateCode.STANDBY);

        let loadGameButton = new StartMenuModel.MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if (!StartMenuModel.GameSerializer.load()) {
                StartMenuLogic.copyFloatingWindow(StartMenuModel.p5, "NoSaveData", this);
            }
        }

        this.buttons.push(newGameButton, loadGameButton);

        this.initAllFloatingWindows();
    }

    initAllFloatingWindows() {
        let afw = new Map();

        StartMenuModel.utilityClass.commonFloatingWindows(StartMenuModel.p5, afw);

        this.allFloatingWindows = afw;
    }
}

export class StartMenuRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        StartMenuRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof ScreenRenderer} */
        StartMenuRenderer.ScreenRenderer = bundle.ScreenRenderer;
    }

    /**
     *
     * @param p5
     * @param {StartMenuModel} startMenu
     */
    static drawFloatingWindow(p5, startMenu) {
        StartMenuRenderer.ScreenRenderer.drawFloatingWindow(p5, startMenu, StartMenuLogic.setFloatingWindow);
    }

    /**
     *
     * @param p5
     * @param {StartMenuModel} startMenu
     */
    static draw(p5, startMenu) {
        p5.background(50);
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.TOP);
        let [textX, textY] = StartMenuRenderer.utilityClass.relative2absolute(0.5, 0.1);
        p5.text('startMenu', textX, textY);

        for (let button of startMenu.buttons) {
            if (button.update) {
                button.update(p5);
            }
            button.draw(p5);
        }

        StartMenuRenderer.drawFloatingWindow(p5, startMenu);
    }
}

export class StartMenuLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        StartMenuLogic.utilityClass = bundle.utilityClass;
        StartMenuLogic.FloatingWindow = bundle.FloatingWindow;
        StartMenuLogic.stateCode = bundle.stateCode;
        /** @type {typeof ScreenLogic} */
        StartMenuLogic.ScreenLogic = bundle.ScreenLogic;
    }

    /**
     *
     * @param {StartMenuModel} startMenu
     */
    static handleFloatingWindow(startMenu) {
        return StartMenuLogic.ScreenLogic.handleFloatingWindow(startMenu);
    }

    /**
     *
     * @param p5
     * @param {StartMenuModel} startMenu
     */
    static handleClick(p5, startMenu) {
        if (StartMenuLogic.handleFloatingWindow(startMenu)) {
            return;
        }
        for (let button of startMenu.buttons) {
            button.mouseClick(p5);
        }
    }

    // placeholder - start menu does not contain inventory
    static handleScroll() {
    }

    /**
     *
     * @param {StartMenuModel} startMenu
     */
    static changeNewToResume(startMenu) {
        let newGameButton = startMenu.buttons.find(button => button.text.startsWith("New Game"));
        if (newGameButton !== null && newGameButton !== undefined) {
            newGameButton.text = "Resume Game";
        }
    }

    /**
     *
     * @param p5
     * @param {StartMenuModel} startMenu
     */
    static setFloatingWindow(p5, startMenu) {

    }

    /**
     *
     * @param p5
     * @param {String} str
     * @param {StartMenuModel} startMenu
     */
    static copyFloatingWindow(p5, str, startMenu) {
        startMenu.floatingWindow = StartMenuLogic.FloatingWindow.copyOf(startMenu.allFloatingWindows.get(str));
    }
}