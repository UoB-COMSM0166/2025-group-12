import {Button} from "../items/Button.js";
import {stateCode, stageGroup} from "./GameState.js";
import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {Screen} from "./Screen.js";

export class StandbyMenu extends Screen {
    constructor(gameState) {
        super(gameState);
    }

    setup(p5) {
        this.initAllFloatingWindows(p5);

        let [escX, escY] = myutil.relative2absolute(0.01, 0.01);
        let [escWidth, escHeight] = myutil.relative2absolute(0.09, 0.07);
        let escapeButton = new Button(escX, escY, escWidth, escHeight, "Escape");
        escapeButton.onClick = () => {
            this.gameState.setState(stateCode.MENU);
        };

        let [buttonWidth, buttonHeight] = myutil.relative2absolute(0.15, 0.07);
        let [buttonX, buttonY] = myutil.relative2absolute(0.2, 0.2);
        let buttonInter = myutil.relative2absolute(0.1, 0.1)[1];

        let stage1Button = new Button(buttonX, buttonY + buttonInter * 0, buttonWidth, buttonHeight, "Tornado");
        stage1Button.onClick = () => {
             this.clickedStageButton(p5, stageGroup.TORNADO);
        };

        let stage2Button = new Button(buttonX, buttonY + buttonInter * 1, buttonWidth, buttonHeight, "Volcano");
        stage2Button.onClick = () => {
            if(!this.gameState.isStageCleared(stageGroup.TORNADO)){
                this.copyFloatingWindow(p5, "lock");
                return;
            }
            this.clickedStageButton(p5, stageGroup.VOLCANO);
        };

        // earthquake + landslide
        let stage3Button = new Button(buttonX, buttonY + buttonInter * 2, buttonWidth, buttonHeight, "Earthquake");
        stage3Button.onClick = () => {
            this.copyFloatingWindow(p5, "lock");
        };

        // landslide + random lightning attack
        let stage4Button = new Button(buttonX, buttonY + buttonInter * 3, buttonWidth, buttonHeight, "Rainstorm");
        stage4Button.onClick = () => {
            this.copyFloatingWindow(p5, "lock");
        };

        // earthquake induced tsunami + rainstorm + landslide + random lighting + tornado
        let stage5Button = new Button(buttonX, buttonY + buttonInter * 4, buttonWidth, buttonHeight, "Tsunami");
        stage5Button.onClick = () => {
            this.gameState.setState(stateCode.MAP);
            // this.copyFloatingWindow(p5, "lock");
        };

        this.buttons.push(escapeButton, stage1Button, stage2Button, stage3Button, stage4Button, stage5Button);
    }

    handleClick(p5) {
        if (this.handleFloatingWindow()) {
            return;
        }

        for (let button of this.buttons) {
            button.mouseClick(p5);
        }
    }

    draw(p5) {
        p5.background(80);
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.TOP);
        let [textX, textY] = myutil.relative2absolute(0.5, 0.1);
        p5.text("Select Stage", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }

        this.gameState.inventory.draw(p5, CanvasSize.getSize()[0], CanvasSize.getSize()[1]);

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
            playerCanClick: false
        }));

        afw.set("lock", new FloatingWindow(p5, null, "{white:This stage is locked.}", {
            x: myutil.relative2absolute(1 / 2, 1 / 4)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("moreTutorial", new FloatingWindow(p5, null, "{white:Click 'Storm' again to continue tutorial.}", {
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

