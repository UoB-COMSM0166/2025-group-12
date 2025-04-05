import {Button} from "../items/Button.js";
import {stateCode, stageGroup} from "./GameState.js";
import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {Screen} from "./Screen.js";
import {MapButton} from "../items/MapButton.js";

export class StandbyMenu extends Screen {
    constructor(gameState) {
        super(gameState);
    }

    setup(p5) {
        this.background = p5.images.get("GameMapBG");
        this.stage1 = p5.images.get("Tornado");
        this.stage2 = p5.images.get("VolcanoLayer");
        this.stage3 = p5.images.get("Landslide");
        this.stage4 = p5.images.get("Blizzard");
        this.stage5 = p5.images.get("Tsunami");

        this.initAllFloatingWindows(p5);

        let stage1Button = new MapButton(
            myutil.relative2absolute(0.52, 0.68)[0],
            myutil.relative2absolute(0.52, 0.68)[1],
            myutil.relative2absolute(0.05, 0.05)[0], this.stage1, stageGroup.TORNADO);
        stage1Button.onClick = () => {
            this.clickedStageButton(p5, stageGroup.TORNADO);
            stage1Button.createNewCircle(p5);
        }

        let stage2Button = new MapButton(
            myutil.relative2absolute(0.475, 0.475)[0],
            myutil.relative2absolute(0.475, 0.475)[1],
            myutil.relative2absolute(0.05, 0.05)[0], this.stage2, stageGroup.VOLCANO);
        stage2Button.onClick = () => {
            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (stage2Button.isLocked) {
                    this.copyFloatingWindow(p5, "lock");
                    return;
                }
            }
            this.clickedStageButton(p5, stageGroup.VOLCANO);
        };

        // earthquake + landslide
        let stage3Button = new MapButton(
            myutil.relative2absolute(0.65, 0.3)[0],
            myutil.relative2absolute(0.65, 0.3)[1],
            myutil.relative2absolute(0.05, 0.05)[0], this.stage3, stageGroup.EARTHQUAKE);
        stage3Button.onClick = () => {
            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (stage3Button.isLocked) {
                    this.copyFloatingWindow(p5, "lock");
                    return;
                }
            }
            this.clickedStageButton(p5, stageGroup.EARTHQUAKE);
        };

        let stage4Button = new MapButton(
            myutil.relative2absolute(0.15, 0.67)[0],
            myutil.relative2absolute(0.15, 0.67)[1],
            myutil.relative2absolute(0.05, 0.05)[0], this.stage4, stageGroup.BLIZZARD);
        stage4Button.onClick = () => {
            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (stage4Button.isLocked) {
                    this.copyFloatingWindow(p5, "lock");
                    return;
                }
            }
            this.clickedStageButton(p5, stageGroup.BLIZZARD);
        };

        let stage5Button = new MapButton(
            myutil.relative2absolute(0.41, 0.35)[0],
            myutil.relative2absolute(0.41, 0.35)[1],
            myutil.relative2absolute(0.05, 0.05)[0], this.stage5, stageGroup.TSUNAMI);
        stage5Button.onClick = () => {
            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (stage5Button.isLocked) {
                    this.copyFloatingWindow(p5, "lock");
                    return;
                }
            }
            this.clickedStageButton(p5, stageGroup.TSUNAMI);
        };

        this.buttons.push(stage1Button, stage2Button, stage3Button, stage4Button, stage5Button);
    }

    handleClick(p5) {
        if (this.handleFloatingWindow()) {
            return;
        }

        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }

        this.buttons.forEach(button => button.circle = null);
    }

    draw(p5) {
        let canvasSize = CanvasSize.getSize();
        p5.image(this.background, 0, 0, canvasSize[0], canvasSize[1]);

        for (let button of this.buttons) {
            if(button.unlock) button.unlock(this.gameState);
            button.draw(p5);
        }

        this.gameState.inventory.draw(p5, myutil.relative2absolute(1, 1)[0], myutil.relative2absolute(1, 1)[1]);

        this.drawFloatingWindow(p5);
    }

    clickedStageButton(p5, stageGroup) {
        if (this.gameState.isStageCleared(stageGroup)) {
            this.copyFloatingWindow(p5, "clear");
            return;
        }
        this.gameState.setState(stateCode.PLAY);
        this.gameState.currentStageGroup = stageGroup;
    }

    copyFloatingWindow(p5, str) {
        this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get(str));
    }

    setFloatingWindow(p5) {
        if (this.allFloatingWindows.has("moreTutorial") && this.gameState.isSpecificStageCleared(stageGroup.TORNADO, 1)) {
            this.floatingWindow = this.allFloatingWindows.get("moreTutorial");
            this.allFloatingWindows.delete("moreTutorial");
            return;
        }
    }

    initAllFloatingWindows(p5) {
        let afw = new Map();

        afw.set("clear", new FloatingWindow(p5, null, "{white:This stage has been cleared.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("lock", new FloatingWindow(p5, null, "{white:This stage is locked.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("moreTutorial", new FloatingWindow(p5, null, "{white:Click 'Tornado' again to continue tutorial.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        this.allFloatingWindows = afw;
    }
}