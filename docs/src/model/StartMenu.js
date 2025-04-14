/**
 * @implements ScreenLike
 */
class StartMenuModel {
    static setup(bundle) {
        StartMenuModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        StartMenuModel.utilityClass = bundle.utilityClass;
        StartMenuModel.stateCode = bundle.stateCode;
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

        this.init();
    }

    init() {
        let [buttonWidth, buttonHeight] = StartMenuModel.utilityClass.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = StartMenuModel.utilityClass.relative2absolute(0.2, 0.6);
        let buttonInter = StartMenuModel.utilityClass.relative2absolute(0.1, 0.1)[1];

        let newGameButton = new StartMenuModel.MenuItem(buttonX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "New Game");
        newGameButton.onClick = () => {
            this.gameState.isFading = true;
            this.gameState.nextState = StartMenuModel.stateCode.STANDBY;
        }

        let loadGameButton = new StartMenuModel.MenuItem(buttonX - buttonWidth / 2, buttonY + buttonInter, buttonWidth, buttonHeight, "Load Game");
        loadGameButton.onClick = () => {
            if (!StartMenuModel.GameSerializer.load()) {
                StartMenuLogic.copyFloatingWindow(StartMenuModel.p5, "NoSaveData", this);
            }
        }

        this.buttons.push(newGameButton, loadGameButton);

        this.setupInteractive();

        this.initAllFloatingWindows();
    }

    setupInteractive(){
        this.interactives[0][0] = this.buttons[0];
        this.interactives[1][0] = this.buttons[1];
        this.interactives[2][0] = this.buttons[2];
    }

    initAllFloatingWindows() {
        let afw = new Map();

        StartMenuModel.utilityClass.commonFloatingWindows(StartMenuModel.p5, afw);

        this.allFloatingWindows = afw;
    }

    shift2Gamepad(p5){
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

    static cancel(){}

    /**
     *
     * @param index
     * @param {StartMenuModel} startMenu
     */
    static handleGamepad(index, startMenu){
        switch (index) {
            case 12:
                startMenu.buttons[startMenu.index].isSelected = false;
                if (startMenu.index === 0) startMenu.index = 2;
                else startMenu.index--;
                startMenu.buttons[startMenu.index].isSelected = true;
                break;
            case 13:
                startMenu.buttons[startMenu.index].isSelected = false;
                if (startMenu.index === 2) startMenu.index = 0;
                else startMenu.index++;
                startMenu.buttons[startMenu.index].isSelected = true;
                break;
        }

    }

    static handleAnalogStick(axes, startMenu) {

    }

    /**
     *
     * @param axes
     * @param startMenu
     */
    static handleAnalogStickPressed(axes, startMenu) {
        if(axes[1] < 0){
            startMenu.buttons[startMenu.index].isSelected = false;
            if (startMenu.index === 0) startMenu.index = 2;
            else startMenu.index--;
            startMenu.buttons[startMenu.index].isSelected = true;
        }
        else{
            startMenu.buttons[startMenu.index].isSelected = false;
            if (startMenu.index === 2) startMenu.index = 0;
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

    /**
     *
     * @param dRow
     * @param dCol
     * @param {StartMenuModel} startMenu
     */
    moveSelection(dRow, dCol, startMenu) {
        let newRow = Math.max(0, Math.min(startMenu.row + dRow, startMenu.interactives.length - 1));
        let newCol = Math.max(0, Math.min(startMenu.col + dCol, startMenu.interactives[newRow].length - 1));

        if(startMenu.interactives[newRow][newCol]){
            startMenu.interactives[startMenu.row][startMenu.col].isSelected = false;
            startMenu.row = newRow;
            startMenu.col = newCol;
            startMenu.interactives[newRow][newCol].isSelected = true;
        }
    }
}

export {StartMenuModel, StartMenuLogic, StartMenuRenderer};

if (typeof module !== 'undefined') {
    module.exports = {StartMenuModel, StartMenuLogic, StartMenuRenderer};
}