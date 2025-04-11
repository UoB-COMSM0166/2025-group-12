export class StartMenuModel {
    static isScreen = true;

    static setup(bundle){}

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

    init(bundle) {
        let [buttonWidth, buttonHeight] = bundle.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = bundle.utilityClass.relative2absolute(0.2, 0.6);
        let buttonInter = bundle.utilityClass.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new bundle.MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "New Game");
        newGameButton.onClick = () => bundle.gameState.setState(bundle.stateCode.STANDBY);

        let loadGameButton = new bundle.MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if (!bundle.gameSerializer.load(bundle.p5)) {
                StartMenuLogic.copyFloatingWindow(bundle.p5, "NoSaveData", this);
            }
        }

        this.buttons.push(newGameButton, loadGameButton);

        this.initAllFloatingWindows(bundle);
    }

    initAllFloatingWindows(bundle) {
        let afw = new Map();

        bundle.utilityClass.commonFloatingWindows(bundle.p5, afw);

        this.allFloatingWindows = afw;
    }
}

export class StartMenuRenderer{
    static setup(bundle){
        StartMenuRenderer.utilityClass = bundle.utilityClass;
    }

    // placeholder, injected in container
    /**
     *
     * @param p5
     * @param {StartMenuModel} startMenu
     */
    static drawFloatingWindow(p5, startMenu) {}

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

export class StartMenuLogic{
    static setup(bundle){
        StartMenuLogic.utilityClass = bundle.utilityClass;
        StartMenuLogic.FloatingWindow = bundle.FloatingWindow;
    }

    // placeholder, injected in container
    /**
     *
     * @param {StartMenuModel} startMenu
     */
    static handleFloatingWindow(startMenu){}

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

    // placeholder, injected in container
    /**
     *
     * @param p5
     * @param event
     * @param {StartMenuModel} startMenu
     */
    static handleScroll(p5, event, startMenu){}

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