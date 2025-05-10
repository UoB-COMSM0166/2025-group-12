/**
 * @implements ScreenLike
 */
class StartMenuModel {
    static setup(bundle) {
        StartMenuModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        StartMenuModel.utilityClass = bundle.utilityClass;
        StartMenuModel.stateCode = bundle.stateCode;
        StartMenuModel.stageGroup = bundle.stageGroup;
        /** @type {typeof Button} */
        StartMenuModel.Button = bundle.Button;
        /** @type {typeof FloatingWindow} */
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

        // fade in fade out render
        this.fade = 0;
        this.isFading = false;
        this.isEntering = false;
        this.fadeIn = 255;

        // gamepad
        this.interactives = Array.from({length: 20},
            () => Array.from({length: 20}, () => null));
        this.row = 0;
        this.col = 0;
        this.x = StartMenuModel.utilityClass.relative2absolute(0.5, 0.5)[0];
        this.y = StartMenuModel.utilityClass.relative2absolute(0.5, 0.5)[1];
        this.index = 0;

        this.buttonWidth = StartMenuModel.utilityClass.relative2absolute(0.15, 0.07)[0];
        this.buttonHeight = StartMenuModel.utilityClass.relative2absolute(0.15, 0.07)[1];
        this.buttonX = StartMenuModel.utilityClass.relative2absolute(0.2, 0.55)[0];
        this.buttonY = StartMenuModel.utilityClass.relative2absolute(0.2, 0.55)[1];
        this.buttonInter = StartMenuModel.utilityClass.relative2absolute(0.1, 0.1)[1];

        this.init();
    }

    init() {
        let p5 = StartMenuModel.p5;

        let skipTutorialButton = new StartMenuModel.MenuItem(this.buttonX - this.buttonWidth / 2, this.buttonY, this.buttonWidth, this.buttonHeight, "New Game - Skip Tutorial");
        skipTutorialButton.onClick = () => {
            this.gameState.setStageCleared(StartMenuModel.stageGroup.TORNADO);
            this.gameState.setStageCleared(StartMenuModel.stageGroup.TORNADO);
            this.gameState.isFading = true;
            this.gameState.nextState = StartMenuModel.stateCode.STANDBY;
        }

        let newGameButton = new StartMenuModel.MenuItem(this.buttonX - this.buttonWidth / 2, this.buttonY + this.buttonInter, this.buttonWidth, this.buttonHeight, "New Game");
        newGameButton.onClick = () => {
            this.gameState.isFading = true;
            this.gameState.nextState = StartMenuModel.stateCode.STANDBY;
        }

        let loadGameButton = new StartMenuModel.MenuItem(this.buttonX - this.buttonWidth / 2, this.buttonY + 2 * this.buttonInter, this.buttonWidth, this.buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if(!p5.loadedAll) {
                StartMenuLogic.copyFloatingWindow(p5, "loading", this);
                return;
            }
            if (!StartMenuModel.GameSerializer.load()) {
                StartMenuLogic.copyFloatingWindow(StartMenuModel.p5, "NoSaveData", this);
            }
        }

        let optionButton = new StartMenuModel.MenuItem(this.buttonX - this.buttonWidth / 2, this.buttonY + 3 * this.buttonInter, this.buttonWidth, this.buttonHeight, "Options");
        optionButton.onClick = () => {
            this.gameState.showOptions = true;
        }

        this.buttons.push(skipTutorialButton, newGameButton, loadGameButton, optionButton);

        this.initAllFloatingWindows();
    }

    initAllFloatingWindows() {
        let afw = new Map();

        afw.set("loading", new StartMenuModel.FloatingWindow(StartMenuModel.p5, null, "{white:Loading...}", {
            x: StartMenuModel.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: StartMenuModel.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        StartMenuModel.utilityClass.commonFloatingWindows(StartMenuModel.p5, afw);

        this.allFloatingWindows = afw;
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.index = 0;
        this.buttons.forEach(button => {
            button.mode = "gamepad";
            button.isSelected = false;
        });
        if (!this.gameState.showOptions) this.buttons[0].isSelected = true;
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.buttons.forEach(button => {
            button.mode = "mouse";
            button.isSelected = false;
        });
    }

}

class StartMenuRenderer {
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
        let canvasSize = StartMenuRenderer.utilityClass.relative2absolute(1, 1);
        let titleImg = p5.images.get("TitleBackground");
        p5.image(p5.images.get("TitleBackground"), 0, 0, canvasSize[0], canvasSize[1]);
        let ratio = titleImg.height / titleImg.width;
        let titlePos = StartMenuRenderer.utilityClass.relative2absolute(0.5, 0.4);
        let targetWidth = StartMenuRenderer.utilityClass.relative2absolute(0.7, 0.4)[0];
        let targetHeight = ratio * targetWidth;
        p5.image(p5.images.get("TitleBanner"), titlePos[0] - targetWidth / 2, titlePos[1] - targetHeight / 2, targetWidth, targetHeight);
        p5.fill(255);

        for (let button of startMenu.buttons) {
            if (button.update) {
                button.update(p5);
            }
            button.draw(p5);
        }

        StartMenuRenderer.drawFloatingWindow(p5, startMenu);

        if(startMenu.floatingWindow && startMenu.floatingWindow.text.toLowerCase().includes("loading") && p5.loadedAll) {
            startMenu.floatingWindow = null;
        }

        if (startMenu.gameState.isFading) {
            StartMenuRenderer.ScreenRenderer.playFadeOutAnimation(p5, startMenu);
        }
        if (startMenu.isEntering) {
            StartMenuRenderer.ScreenRenderer.playFadeInAnimation(p5, startMenu);
        }
    }
}

class StartMenuLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        StartMenuLogic.utilityClass = bundle.utilityClass;
        StartMenuLogic.FloatingWindow = bundle.FloatingWindow;
        StartMenuLogic.stateCode = bundle.stateCode;
        /** @type {typeof ScreenLogic} */
        StartMenuLogic.ScreenLogic = bundle.ScreenLogic;
    }

    static cancel(startMenu) {

    }

    /**
     *
     * @param index
     * @param {StartMenuModel} startMenu
     */
    static handleGamepad(index, startMenu) {
        switch (index) {
            case 1:
                StartMenuLogic.cancel(startMenu);
                break;
            case 12:
                startMenu.buttons[startMenu.index].isSelected = false;
                if (startMenu.index === 0) startMenu.index = startMenu.buttons.length - 1;
                else startMenu.index--;
                startMenu.buttons[startMenu.index].isSelected = true;
                break;
            case 13:
                startMenu.buttons[startMenu.index].isSelected = false;
                if (startMenu.index === startMenu.buttons.length - 1) startMenu.index = 0;
                else startMenu.index++;
                startMenu.buttons[startMenu.index].isSelected = true;
                break;
        }

    }

    static handleAnalogStick(p5, axes, startMenu) {

    }

    /**
     *
     * @param axes
     * @param startMenu
     */
    static handleAnalogStickPressed(axes, startMenu) {
        if (axes[1] < 0) {
            startMenu.buttons[startMenu.index].isSelected = false;
            if (startMenu.index === 0) startMenu.index = startMenu.buttons.length - 1;
            else startMenu.index--;
            startMenu.buttons[startMenu.index].isSelected = true;
        } else {
            startMenu.buttons[startMenu.index].isSelected = false;
            if (startMenu.index === startMenu.buttons.length - 1) startMenu.index = 0;
            else startMenu.index++;
            startMenu.buttons[startMenu.index].isSelected = true;
        }
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
        startMenu.buttons = startMenu.buttons.filter(button => !button.text.startsWith("New Game - Skip Tutorial"));
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
        startMenu.floatingWindow = /** @type {FloatingWindow} */ StartMenuLogic.FloatingWindow.copyOf(startMenu.allFloatingWindows.get(str));
    }

    static resize(startMenu) {
        let newGame = startMenu.buttons.find(button => button.text.toLowerCase().startsWith("new game"));
        if (!newGame) newGame = startMenu.buttons.find(button => button.text.toLowerCase().startsWith("resume"));
        let skip = startMenu.buttons.find(button => button.text.toLowerCase().startsWith("new game - skip"));
        let loadGame = startMenu.buttons.find(button => button.text.toLowerCase().startsWith("load"));
        let option = startMenu.buttons.find(button => button.text.toLowerCase().startsWith("opt"));

        if (skip) {
            skip.x = startMenu.buttonX - startMenu.buttonWidth / 2;
            skip.defaultX = startMenu.buttonX - startMenu.buttonWidth / 2;
            skip.targetX = newGame.x + StartMenuLogic.utilityClass.relative2absolute(0.01, 0.07)[0];
            skip.y = startMenu.buttonY;
            skip.width = startMenu.buttonWidth;
            skip.height = startMenu.buttonHeight;
        }

        newGame.x = startMenu.buttonX - startMenu.buttonWidth / 2;
        newGame.defaultX = startMenu.buttonX - startMenu.buttonWidth / 2;
        newGame.targetX = newGame.x + StartMenuLogic.utilityClass.relative2absolute(0.01, 0.07)[0];
        newGame.y = startMenu.buttonY + startMenu.buttonInter;
        newGame.width = startMenu.buttonWidth;
        newGame.height = startMenu.buttonHeight;

        loadGame.x = startMenu.buttonX - startMenu.buttonWidth / 2;
        loadGame.defaultX = startMenu.buttonX - startMenu.buttonWidth / 2;
        loadGame.targetX = startMenu.buttons[0].x + StartMenuLogic.utilityClass.relative2absolute(0.01, 0.07)[0];
        loadGame.y = startMenu.buttonY + 2 * startMenu.buttonInter;
        loadGame.width = startMenu.buttonWidth;
        loadGame.height = startMenu.buttonHeight;

        option.x = startMenu.buttonX - startMenu.buttonWidth / 2;
        option.defaultX = startMenu.buttonX - startMenu.buttonWidth / 2;
        option.targetX = startMenu.buttons[0].x + StartMenuLogic.utilityClass.relative2absolute(0.01, 0.07)[0];
        option.y = startMenu.buttonY + 3 * startMenu.buttonInter;
        option.width = startMenu.buttonWidth;
        option.height = startMenu.buttonHeight;
    }

}

export {StartMenuModel, StartMenuLogic, StartMenuRenderer};

if (typeof module !== 'undefined') {
    module.exports = {StartMenuModel, StartMenuLogic, StartMenuRenderer};
}