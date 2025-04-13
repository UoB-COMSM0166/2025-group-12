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

        this.background = null;
        this.selectedStageGroup = GameMapModel.stageGroup.NO_STAGE;

        // fade in fade out render
        this.fade = 0;
        this.isStart = true;
        this.fadeIn = 255;

        this.init();
    }

    init() {
        this.background = GameMapModel.p5.images.get("GameMapBG");

        const buttonConfigs = [
            {x: 0.52, y: 0.68, imageName: "Tornado", group: GameMapModel.stageGroup.TORNADO},
            {x: 0.475, y: 0.475, imageName: "VolcanoLayer", group: GameMapModel.stageGroup.VOLCANO},
            {x: 0.65, y: 0.3, imageName: "Landslide", group: GameMapModel.stageGroup.EARTHQUAKE},
            {x: 0.18, y: 0.65, imageName: "Blizzard", group: GameMapModel.stageGroup.BLIZZARD},
            {x: 0.36, y: 0.3, imageName: "Tsunami", group: GameMapModel.stageGroup.TSUNAMI}
        ];

        this.buttons = buttonConfigs.map(cfg => this.createStageButton(cfg.x, cfg.y, cfg.imageName, cfg.group));

        this.initAllFloatingWindows();
    }

    createStageButton(xRatio, yRatio, imgName, group) {
        let p5 = GameMapModel.p5;
        let [x, y] = GameMapModel.utilityClass.relative2absolute(xRatio, yRatio);
        let [size] = GameMapModel.utilityClass.relative2absolute(0.05, 0.05);
        let button = new GameMapModel.MapButton(x, y, size, p5.images.get(imgName), group);
        button.onClick = () => {
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

        this.allFloatingWindows = afw;
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
        p5.image(gameMap.background, 0, 0, canvasSize[0], canvasSize[1]);

        for (let button of gameMap.buttons) {
            button.unlock(gameMap.gameState);
            button.draw(p5);
        }

        GameMapRenderer.InventoryRenderer.draw(p5, gameMap.gameState.inventory);

        if (gameMap.selectedStageGroup !== GameMapRenderer.stageGroup.NO_STAGE) {
            GameMapRenderer.drawStageInfo(p5, gameMap.selectedStageGroup, gameMap);
        }

        GameMapRenderer.drawFloatingWindow(p5, gameMap);

        if(gameMap.gameState.fading) GameMapRenderer.ScreenRenderer.playFadeOutAnimation(p5, gameMap);
        if(gameMap.isStart) GameMapRenderer.ScreenRenderer.playFadeInAnimation(p5, gameMap);
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
        p5.textSize(20);
        p5.text(`${enemy}`, boxX + boxWidth / 2, boxY + paddingY);
        p5.textSize(16);
        p5.text(`"${text}"`, boxX + boxWidth / 2, boxY + 3 * paddingY);
        p5.textSize(20);
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
        gameMap.gameState.fading = true;
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
        if (gameMap.allFloatingWindows.has("moreTutorial") && gameMap.gameState.isSpecificStageCleared(GameMapLogic.stageGroup.TORNADO, 1)) {
            gameMap.floatingWindow = gameMap.allFloatingWindows.get("moreTutorial");
            gameMap.allFloatingWindows.delete("moreTutorial");
        }
    }
}

export {GameMapModel, GameMapLogic, GameMapRenderer};

if (typeof module !== 'undefined') {
    module.exports = {GameMapModel, GameMapLogic, GameMapRenderer};
}