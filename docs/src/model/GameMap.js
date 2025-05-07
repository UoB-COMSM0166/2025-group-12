/**
 * @implements ScreenLike
 */
class GameMapModel {
    static setup(bundle) {
        GameMapModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        GameMapModel.utilityClass = bundle.utilityClass;
        GameMapModel.stateCode = bundle.stateCode;
        GameMapModel.stageGroup = bundle.stageGroup;
        /** @type {typeof Button} */
        GameMapModel.Button = bundle.Button;
        /** @type {typeof MapButton} */
        GameMapModel.MapButton = bundle.MapButton;
        GameMapModel.FloatingWindow = bundle.FloatingWindow;
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

        this.selectedStageGroup = GameMapModel.stageGroup.NO_STAGE;

        // fade in fade out render
        this.fade = 0;
        this.isFading = false;
        this.isEntering = true;
        this.fadeIn = 255;

        this.init();
    }

    init() {
        const buttonConfigs = [
            {x: 0.52, y: 0.68, imageName: "TornadoIcon", group: GameMapModel.stageGroup.TORNADO},
            {x: 0.475, y: 0.475, imageName: "VolcanoIcon", group: GameMapModel.stageGroup.VOLCANO},
            {x: 0.65, y: 0.3, imageName: "EarthquakeIcon", group: GameMapModel.stageGroup.EARTHQUAKE},
            {x: 0.18, y: 0.65, imageName: "RainIcon", group: GameMapModel.stageGroup.BLIZZARD},
            {x: 0.36, y: 0.3, imageName: "TsunamiIcon", group: GameMapModel.stageGroup.TSUNAMI}
        ];

        this.buttons = buttonConfigs.map(cfg => this.createStageButton(cfg.x, cfg.y, cfg.imageName, cfg.group));

        this.initAllFloatingWindows();
    }

    createStageButton(xRatio, yRatio, imgName, group) {
        let p5 = GameMapModel.p5;
        let [x, y] = GameMapModel.utilityClass.relative2absolute(xRatio, yRatio);
        let size = GameMapModel.utilityClass.relative2absolute(0.05, 0.05)[0];
        let button = new GameMapModel.MapButton(x, y, size, imgName, group);
        button.onClick = () => {
            if(!p5.loadedAll) {
                GameMapLogic.copyFloatingWindow(p5, "loading", this);
                return;
            }

            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (button.isLocked) {
                    if (button.isCleared) {
                        GameMapLogic.copyFloatingWindow(p5, "clear", this);
                    } else {
                        GameMapLogic.copyFloatingWindow(p5, "lock", this);
                    }
                    this.selectedStageGroup = GameMapModel.stageGroup.NO_STAGE;
                    return;
                }
            }
            if (this.selectedStageGroup === group) {
                button.circle = null;
                this.selectedStageGroup = GameMapModel.stageGroup.NO_STAGE;
                GameMapLogic.clickedStageButton(p5, group, this);
            } else {
                this.selectedStageGroup = group;
                button.createNewCircle(p5);
            }
        };
        return button;
    }

    initAllFloatingWindows() {
        let afw = new Map();

        afw.set("clear", new GameMapModel.FloatingWindow(GameMapModel.p5, null, "{white:This stage has been cleared.}", {
            x: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("lock", new GameMapModel.FloatingWindow(GameMapModel.p5, null, "{white:This stage is locked.}", {
            x: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("moreTutorial", new GameMapModel.FloatingWindow(GameMapModel.p5, null, "{white:Click 'Tornado' again to continue tutorial.}", {
            x: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("loading", new GameMapModel.FloatingWindow(GameMapModel.p5, null, "{white:Loading...}", {
            x: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: GameMapLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        this.allFloatingWindows = afw;
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.buttons.forEach(button => {
            button.mode = "gamepad";
        });
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.buttons.forEach(button => {
            button.mode = "mouse";
        });
    }
}

class GameMapRenderer {

    static setup(bundle) {
        /** @type {typeof myUtil} */
        GameMapRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof InventoryRenderer} */
        GameMapRenderer.InventoryRenderer = bundle.InventoryRenderer;
        GameMapRenderer.stageGroup = bundle.stageGroup;
        /** @type {typeof ScreenRenderer} */
        GameMapRenderer.ScreenRenderer = bundle.ScreenRenderer;
    }

    /**
     *
     * @param p5
     * @param {GameMapModel} gameMap
     */
    static draw(p5, gameMap) {
        let canvasSize = GameMapRenderer.utilityClass.relative2absolute(1, 1);
        if(gameMap.gameState.isStageCleared(GameMapRenderer.stageGroup.VOLCANO)){
            p5.image(GameMapModel.p5.images.get("GameMapBG2"), 0, 0, canvasSize[0], canvasSize[1]);
        }else if(gameMap.gameState.isStageCleared(GameMapRenderer.stageGroup.BLIZZARD)){
            p5.image(GameMapModel.p5.images.get("GameMapBG3"), 0, 0, canvasSize[0], canvasSize[1]);
        }else{
            p5.image(p5.images.get("GameMapBG1"), 0, 0, canvasSize[0], canvasSize[1]);
        }

        for (let button of gameMap.buttons) {
            button.unlock(gameMap.gameState);
            button.draw(p5);
        }

        GameMapRenderer.InventoryRenderer.draw(p5, gameMap.gameState.inventory);

        if (gameMap.selectedStageGroup !== GameMapRenderer.stageGroup.NO_STAGE) {
            GameMapRenderer.drawStageInfo(p5, gameMap.selectedStageGroup, gameMap);
        }

        GameMapRenderer.drawFloatingWindow(p5, gameMap);

        if(gameMap.floatingWindow && gameMap.floatingWindow.text.toLowerCase().includes("loading") && p5.loadedAll) {
            gameMap.floatingWindow = null;
        }

        if (gameMap.gameState.isFading) {
            GameMapRenderer.ScreenRenderer.playFadeOutAnimation(p5, gameMap);
        }
        if (gameMap.isEntering) {
            GameMapRenderer.ScreenRenderer.playFadeInAnimation(p5, gameMap);
        }

        if (gameMap.gameState.mode === "gamepad") {
            p5.fill('yellow');
            p5.stroke(0);
            p5.circle(p5.gamepadX, p5.gamepadY, 10);
        }
    }

    /**
     *
     * @param p5
     * @param {GameMapModel} gameMap
     */
    static drawFloatingWindow(p5, gameMap) {
        GameMapRenderer.ScreenRenderer.drawFloatingWindow(p5, gameMap, GameMapLogic.setFloatingWindow);
    }

    /**
     *
     * @param p5
     * @param selectedGroup
     * @param {GameMapModel} gameMap
     */
    static drawStageInfo(p5, selectedGroup, gameMap) {
        let [paddingX, paddingY] = GameMapRenderer.utilityClass.relative2absolute(1 / 128, 1 / 72);
        let boxWidth = GameMapRenderer.utilityClass.relative2absolute(0.15, 1 / 4)[0];
        let boxHeight = 10 * paddingY;
        let boxX = GameMapRenderer.utilityClass.relative2absolute(1, 1)[0] - boxWidth - paddingX;
        let boxY = GameMapRenderer.utilityClass.relative2absolute(1, 1)[1] - boxHeight - paddingY;

        p5.fill(100, 100, 100, 200);
        p5.noStroke();
        p5.rect(boxX, boxY, boxWidth, boxHeight, 10); // 10: corner roundness

        let progress = gameMap.gameState.clearedStages.get(selectedGroup) || 0;
        let total = gameMap.gameState.gsf.stageClasses[selectedGroup].length;

        let text = "";
        let enemy = "";
        switch (selectedGroup) {
            case GameMapRenderer.stageGroup.TORNADO:
                enemy = "tornado";
                text = "Calamitas Caeli";
                break;
            case GameMapRenderer.stageGroup.VOLCANO:
                enemy = "volcano";
                text = "Ira Ignis";
                break;
            case GameMapRenderer.stageGroup.EARTHQUAKE:
                enemy = "earthquake";
                text = "Locus Lapsus";
                break;
            case GameMapRenderer.stageGroup.BLIZZARD:
                enemy = "blizzard";
                text = "Nix Nefasta";
                break;
            case GameMapRenderer.stageGroup.TSUNAMI:
                enemy = "tsunami";
                text = "Ultima Unda";
                break;
        }

        p5.fill("rgb(255, 255, 128)");
        p5.textAlign(p5.CENTER, p5.TOP);

        let fontSizes = GameMapRenderer.utilityClass.getFontSize();
        p5.textSize(fontSizes.small)
        p5.text(`${enemy}`, boxX + boxWidth / 2, boxY + paddingY);
        p5.textSize(fontSizes.letter)
        p5.text(`"${text}"`, boxX + boxWidth / 2, boxY + 3 * paddingY);
        p5.textSize(fontSizes.small)
        p5.text(`progress:`, boxX + boxWidth / 2, boxY + 5 * paddingY);

        GameMapRenderer.utilityClass.drawHealthBar(p5, {
            health: progress,
            maxHealth: total
        }, boxX + 2 * paddingX, boxY + 8 * paddingY, boxWidth - 4 * paddingX, paddingY);

    }
}

class GameMapLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        GameMapLogic.utilityClass = bundle.utilityClass;
        GameMapLogic.FloatingWindow = bundle.FloatingWindow;
        GameMapLogic.stateCode = bundle.stateCode;
        GameMapLogic.stageGroup = bundle.stageGroup;
        /** @type {typeof ScreenLogic} */
        GameMapLogic.ScreenLogic = bundle.ScreenLogic;
    }

    /**
     *
     * @param {GameMapModel} gameMap
     */
    static cancel(gameMap) {
        gameMap.selectedStageGroup = GameMapLogic.stageGroup.NO_STAGE;
        gameMap.buttons.forEach(button => {
            button.circle = null;
        });
    }

    /**
     *
     * @param index
     * @param {GameMapModel} gameMap
     */
    static handleGamepad(index, gameMap) {
        switch (index) {
            case 1:
                GameMapLogic.cancel(gameMap);
                break;
            case 9:
                gameMap.gameState.togglePaused();
                break;
        }
    }

    /**
     *
     * @param axes
     * @param startMenu
     */
    static handleAnalogStickPressed(axes, startMenu) {

    }

    /**
     *
     * @param p5
     * @param axes
     * @param gameMap
     */
    static handleAnalogStick(p5, axes, gameMap) {
        if (gameMap.gameState.paused) return;
        if (Math.abs(axes[0]) > 0.2 || Math.abs(axes[1]) > 0.2) {
            // edges of the grid under old grid-centered coordinates
            let updateX = p5.gamepadX + axes[0] * p5.mouseSpeed;
            let updateY = p5.gamepadY + axes[1] * p5.mouseSpeed;

            updateX = updateX <= 0 ? 0 : updateX;
            updateY = updateY <= 0 ? 0 : updateY;
            updateX = updateX >= GameMapLogic.utilityClass.relative2absolute(1, 1)[0] ? GameMapLogic.utilityClass.relative2absolute(1, 1)[0] : updateX;
            updateY = updateY >= GameMapLogic.utilityClass.relative2absolute(1, 1)[1] ? GameMapLogic.utilityClass.relative2absolute(1, 1)[1] : updateY;
            p5.gamepadX = updateX;
            p5.gamepadY = updateY;
        }
    }

    /**
     *
     * @param {GameMapModel} gameMap
     */
    static handleFloatingWindow(gameMap) {
        return GameMapLogic.ScreenLogic.handleFloatingWindow(gameMap);
    }

    /**
     *
     * @param event
     * @param {GameMapModel} gameMap
     */
    static handleScroll(event, gameMap) {
        GameMapLogic.ScreenLogic.handleScroll(event, gameMap);
    }

    /**
     *
     * @param p5
     * @param {GameMapModel} gameMap
     */
    static handleClick(p5, gameMap) {
        // clear circles for every click
        gameMap.buttons.forEach(button => button.circle = null);

        if (GameMapLogic.handleFloatingWindow(gameMap)) {
            return;
        }

        for (let button of gameMap.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }

        // clear selected stage group. if a button is clicked, this line of code will not be reached
        gameMap.selectedStageGroup = GameMapLogic.stageGroup.NO_STAGE;
    }

    /**
     *
     * @param p5
     * @param newStageGroup
     * @param {GameMapModel} gameMap
     */
    static clickedStageButton(p5, newStageGroup, gameMap) {
        gameMap.gameState.isFading = true;
        gameMap.gameState.nextState = GameMapLogic.stateCode.PLAY;
        gameMap.gameState.currentStageGroup = newStageGroup;
    }

    /**
     *
     * @param p5
     * @param {String} str
     * @param {GameMapModel} gameMap
     */
    static copyFloatingWindow(p5, str, gameMap) {
        gameMap.floatingWindow = /** @type {FloatingWindow} */ GameMapLogic.FloatingWindow.copyOf(gameMap.allFloatingWindows.get(str));
    }

    /**
     *
     * @param p5
     * @param {GameMapModel} gameMap
     */
    static setFloatingWindow(p5, gameMap) {
        if (gameMap.allFloatingWindows.has("moreTutorial") && gameMap.gameState.clearedStages.get(GameMapLogic.stageGroup.TORNADO) === 1) {
            gameMap.floatingWindow = gameMap.allFloatingWindows.get("moreTutorial");
            gameMap.allFloatingWindows.delete("moreTutorial");
        }
    }

    static resize(gameMap) {
        let size = GameMapModel.utilityClass.relative2absolute(0.05, 0.05)[0];
        for (let i = 0; i < gameMap.buttons.length; i++) {
            let xRatio;
            let yRatio;
            switch (i) {
                case 0:
                    xRatio = 0.52;
                    yRatio = 0.68;
                    break;
                case 1:
                    xRatio = 0.475;
                    yRatio = 0.475;
                    break;
                case 2:
                    xRatio = 0.65;
                    yRatio = 0.3;
                    break;
                case 3:
                    xRatio = 0.18;
                    yRatio = 0.65;
                    break;
                case 4:
                    xRatio = 0.36;
                    yRatio = 0.3;
                    break;
            }
            let [x, y] = GameMapModel.utilityClass.relative2absolute(xRatio, yRatio);
            gameMap.buttons[i].x = x;
            gameMap.buttons[i].y = y;
            gameMap.buttons[i].size = size;
            gameMap.buttons[i].width = size;
            gameMap.buttons[i].height = size;
        }
    }
}

export {GameMapModel, GameMapLogic, GameMapRenderer};

if (typeof module !== 'undefined') {
    module.exports = {GameMapModel, GameMapLogic, GameMapRenderer};
}