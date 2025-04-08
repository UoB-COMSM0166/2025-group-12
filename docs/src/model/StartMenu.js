export class StartMenuModel {
    /**
     *
     * @param {typeof ScreenModel} superModel
     * @param gameState
     */
    constructor(superModel, gameState) {
        Object.assign(this, new superModel(gameState));
    }

    setup(p5, bundle) {
        let [buttonWidth, buttonHeight] = bundle.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = bundle.utilityClass.relative2absolute(0.2, 0.6);
        let buttonInter = bundle.utilityClass.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new bundle.MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "New Game");
        newGameButton.onClick = () => bundle.gameState.setState(stateCode.STANDBY);

        let loadGameButton = new bundle.MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if (!bundle.GameSave.load(p5)) {
                StartMenuLogic.copyFloatingWindow(p5, "NoSaveData");
            }
        }

        this.buttons.push(newGameButton, loadGameButton);
    }
}

export class StartMenuRenderer{
    static setup(bundle){
        StartMenuRenderer.handleFloatingWindow = bundle.handleFloatingWindow;
        StartMenuRenderer.utilityClass = bundle.utilityClass;
    }

    static drawFloatingWindow(p5, screen) {
        // placeholder
    }

    static draw(p5, screen) {
        p5.background(50);
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.TOP);
        let [textX, textY] = StartMenuRenderer.utilityClass.relative2absolute(0.5, 0.1);
        p5.text('startMenu', textX, textY);

        for (let button of screen.buttons) {
            if (button.update) {
                button.update(p5);
            }
            button.draw(p5);
        }

        StartMenuRenderer.drawFloatingWindow(p5, screen);
    }

}

export class StartMenuLogic{
    static setup(bundle){
        StartMenuRenderer.utilityClass = bundle.utilityClass;
        StartMenuRenderer.FloatingWindow = bundle.FloatingWindow;
    }

    static handleClick(p5) {
        if (this.handleFloatingWindow()) {
            return;
        }
        for (let button of this.buttons) {
            button.mouseClick(p5);
        }
    }

    static changeNewToResume() {
        let newGameButton = this.buttons.find(button => button.text.startsWith("New Game"));
        if (newGameButton !== null && newGameButton !== undefined) {
            newGameButton.text = "Resume Game";
        }
    }

    static setFloatingWindow(p5) {
    }

    static copyFloatingWindow(p5, str) {
        this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get(str));
    }

    static initAllFloatingWindows(p5) {
        let afw = new Map();

        StartMenuRenderer.utilityClass.commonFloatingWindows(p5, afw);

        this.allFloatingWindows = afw;
    }
}