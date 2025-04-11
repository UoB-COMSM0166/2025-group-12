export class PauseMenuModel {
    static setup(bundle){}

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
    }

    init(bundle) {
        let [buttonWidth, buttonHeight] = bundle.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = bundle.utilityClass.relative2absolute(0.5, 0.3);
        let buttonInter = bundle.utilityClass.relative2absolute(0.1, 0.1)[1];

        let continueButton = new bundle.Button(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "Continue");
        continueButton.onClick = () => {
            this.gameState.togglePaused();
        }

        let loadGameButton = new bundle.Button(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            bundle.gameSerializer.load(p5);
            this.gameState.togglePaused();
        }

        let saveGameButton = new bundle.Button(buttonX - buttonWidth / 2, buttonY + 2 * buttonInter, buttonWidth, buttonHeight, "Save Game");
        saveGameButton.onClick = () => {
            bundle.gameSerializer.save(p5);
            this.gameState.togglePaused();
        }

        let escapeText = this.gameState.state === bundle.stateCode.PLAY ? 'Quit' : 'Back';
        let escapeButton = new bundle.Button(buttonX - buttonWidth / 2, buttonY + 3 * buttonInter, buttonWidth, buttonHeight, escapeText);
        escapeButton.onClick = () => {
            this.gameState.togglePaused();
            if (this.gameState.state === bundle.stateCode.PLAY) {
                this.gameState.setState(bundle.stateCode.STANDBY);
            } else {
                this.gameState.setState(bundle.stateCode.MENU);
            }
            this.gameState.setPlayerCanClick(true);
        };
        this.buttons.push(continueButton, loadGameButton, saveGameButton, escapeButton);
    }
}

export class PauseMenuLogic{
    static setup(bundle){}

    /**
     *
     * @param p5
     * @param {PauseMenuModel} pauseMenu
     */
    static handleClick(p5, pauseMenu) {
        for (let button of pauseMenu.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }
        pauseMenu.gameState.togglePaused();
    }
}

export class PauseMenuRenderer{
    static setup(bundle){
        PauseMenuRenderer.utilityClass = bundle.utilityClass;
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
    }
}

