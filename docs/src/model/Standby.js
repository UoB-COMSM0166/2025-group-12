import {Button} from "../items/Button.js";
import {stateCode, stageCode} from "./GameState.js";
import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {FloatingWindow} from "./FloatingWindow.js";

export class StandbyMenu {
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];

        this.floatingWindow = null;
        this.allFloatingWindows = null;
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

        let stage1Button = new Button(buttonX, buttonY + buttonInter * 0, buttonWidth, buttonHeight, "Calamitas Caeli");
        stage1Button.onClick = () => {
            this.clickedStageButton(p5, stageCode.TORNADO);
        };

        let stage2Button = new Button(buttonX, buttonY + buttonInter * 1, buttonWidth, buttonHeight, "Ira Ignis");
        stage2Button.onClick = () => {
            this.clickedStageButton(p5, stageCode.VOLCANO);
        };

        let stage3Button = new Button(buttonX, buttonY + buttonInter * 2, buttonWidth, buttonHeight, "Locus Lapsus");
        stage3Button.onClick = () => {
            this.setFloatingWindow(p5, "lock");
        };

        let stage4Button = new Button(buttonX, buttonY + buttonInter * 3, buttonWidth, buttonHeight, "Stage 4");
        stage4Button.onClick = () => {
            this.setFloatingWindow(p5, "lock");
        };

        let stage5Button = new Button(buttonX, buttonY + buttonInter * 4, buttonWidth, buttonHeight, "Ultima Unda");
        stage5Button.onClick = () => {
            this.setFloatingWindow(p5, "lock");
        };

        this.buttons.push(escapeButton, stage1Button, stage2Button, stage3Button, stage4Button, stage5Button);
    }

    handleClick(p5) {
        if (this.floatingWindow !== null) {
            if (!this.floatingWindow.isFading) {
                this.floatingWindow.isFading = true;
                if (!this.floatingWindow.playerCanClick) {
                    return;
                }
            }
            if (!this.floatingWindow.playerCanClick) {
                return;
            }
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
        p5.text("Standby Menu", textX, textY);

        for (let button of this.buttons) {
            button.draw(p5);
        }

        this.gameState.inventory.draw(p5, CanvasSize.getSize()[0], CanvasSize.getSize()[1]);

        if (this.floatingWindow !== null) {
            if (this.floatingWindow.isFading) {
                this.floatingWindow.fadeOut();
                if (this.floatingWindow.hasFadedOut()) {
                    this.floatingWindow = null;
                } else {
                    this.floatingWindow.draw();
                }
            } else {
                this.floatingWindow.draw();
            }
        }
    }

    clickedStageButton(p5, stageCode) {
        if (this.gameState.isStageCleared(stageCode)) {
            this.setFloatingWindow(p5, "clear");
            return;
        }
        this.gameState.setState(stateCode.PLAY);
        this.gameState.currentStageCode = stageCode;
    }

    setFloatingWindow(p5, str) {
        this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get(str));
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

        this.allFloatingWindows = afw;
    }
}

