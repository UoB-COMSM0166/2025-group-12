import {stateCode, stageGroup} from "./GameState.js";
import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {Screen} from "./Screen.js";
import {MapButton} from "../items/MapButton.js";

export class StandbyMenu extends Screen {
    constructor(gameState) {
        super(gameState);
        this.background = null;
        this.selectedStageGroup = stageGroup.NO_STAGE;
    }

    setup(p5) {
        this.background = p5.images.get("GameMapBG");

        this.initAllFloatingWindows(p5);

        const buttonConfigs = [
            {x: 0.52, y: 0.68, image: "TornadoIcon", group: stageGroup.TORNADO},
            {x: 0.475, y: 0.475, image: "VolcanoIcon", group: stageGroup.VOLCANO},
            {x: 0.65, y: 0.3, image: "EarthquakeIcon", group: stageGroup.EARTHQUAKE},
            {x: 0.18, y: 0.65, image: "RainIcon", group: stageGroup.BLIZZARD},
            {x: 0.36, y: 0.3, image: "TsunamiIcon", group: stageGroup.TSUNAMI}
        ];

        this.buttons = buttonConfigs.map(cfg => this.createStageButton(p5, cfg.x, cfg.y, cfg.image, cfg.group));
        this.isStart = true;
    }

    createStageButton(p5, xRatio, yRatio, imgName, group) {
        let [x, y] = myutil.relative2absolute(xRatio, yRatio);
        let [size] = myutil.relative2absolute(0.05, 0.05);
        let button = new MapButton(x, y, size, p5.images.get(imgName), group);
        button.onClick = () => {
            if (!p5.keyIsPressed || p5.key !== 'v') {
                if (button.isLocked) {
                    if (button.isCleared) {
                        this.copyFloatingWindow(p5, "clear");
                    } else {
                        this.copyFloatingWindow(p5, "lock");
                    }
                    this.selectedStageGroup = stageGroup.NO_STAGE;
                    return;
                }
            }
            if (this.selectedStageGroup === group) {
                button.circle = null;
                this.selectedStageGroup = stageGroup.NO_STAGE;
                this.clickedStageButton(p5, group);
            } else {
                this.selectedStageGroup = group;
                button.createNewCircle(p5);
            }
        };
        return button;
    }

    handleClick(p5) {
        // clear circles for every click
        this.buttons.forEach(button => button.circle = null);

        if (this.handleFloatingWindow()) {
            console.log("sholud invoke");
            return;
        }

        for (let button of this.buttons) {
            if (button.mouseClick(p5)) {
                return;
            }
        }

        // clear selected stage group. if a button is clicked, this line of code will not be reached
        this.selectedStageGroup = stageGroup.NO_STAGE;
    }

    handleGamepad(index){
        switch (index){
            case 1:
                this.cancel();
                break;
        }
    }

    handleAnalogStick(axes, p5) {
        if (Math.abs(axes[0]) > 0.2 || Math.abs(axes[1]) > 0.2) {
            // edges of the grid under old grid-centered coordinates
            let updateX = p5.gamepadX + axes[0] * p5.mouseSpeed;
            let updateY = p5.gamepadY + axes[1] * p5.mouseSpeed;

            updateX = updateX <= 0 ? 0 : updateX;
            updateY = updateY <= 0 ? 0 : updateY;
            updateX = updateX >= CanvasSize.getSize()[0] ? CanvasSize.getSize()[0] : updateX;
            updateY = updateY >= CanvasSize.getSize()[1] ? CanvasSize.getSize()[1] : updateY;
            p5.gamepadX = updateX;
            p5.gamepadY = updateY;
        }
    }

    draw(p5) {
        let canvasSize = CanvasSize.getSize();
        p5.image(this.background, 0, 0, canvasSize[0], canvasSize[1]);

        for (let button of this.buttons) {
            button.unlock(this.gameState);
            button.draw(p5);
        }

        this.gameState.inventory.draw(p5, myutil.relative2absolute(1, 1)[0], myutil.relative2absolute(1, 1)[1]);

        if (this.selectedStageGroup !== stageGroup.NO_STAGE) {
            this.drawStageInfo(p5, this.selectedStageGroup);
        }

        this.drawFloatingWindow(p5);

        if(this.gameState.mode === "gamepad") {
            p5.fill('yellow');
            p5.circle(p5.gamepadX, p5.gamepadY, 10);
        }
        if(this.gameState.fading) this.playFadeOutAnimation(p5);
        if(this.isStart) this.playFadeInAnimation(p5);
    }

    drawStageInfo(p5, group) {
        let [paddingX, paddingY] = myutil.relative2absolute(1 / 128, 1 / 72);
        let boxWidth = myutil.relative2absolute(0.15, 1 / 4)[0];
        let boxHeight = 10 * paddingY;
        let boxX = myutil.relative2absolute(1, 1)[0] - boxWidth - paddingX;
        let boxY = myutil.relative2absolute(1, 1)[1] - boxHeight - paddingY;

        p5.fill(100, 100, 100, 200);
        p5.noStroke();
        p5.rect(boxX, boxY, boxWidth, boxHeight, 10); // 10: corner roundness

        let progress = this.gameState.clearedStages.get(group) || 0;
        let total = this.gameState.gsf.stageClasses[group].length;

        let text = "";
        let enemy = "";
        switch (group) {
            case stageGroup.TORNADO:
                enemy = "tornado";
                text = "Calamitas Caeli";
                break;
            case stageGroup.VOLCANO:
                enemy = "volcano";
                text = "Ira Ignis";
                break;
            case stageGroup.EARTHQUAKE:
                enemy = "earthquake";
                text = "Locus Lapsus";
                break;
            case stageGroup.BLIZZARD:
                enemy = "blizzard";
                text = "Nix Nefasta";
                break;
            case stageGroup.TSUNAMI:
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

        myutil.drawHealthBar(p5, {
            health: progress,
            maxHealth: total
        }, boxX + 2 * paddingX, boxY + 8 * paddingY, boxWidth - 4 * paddingX, paddingY);

    }

    clickedStageButton(p5, stageGroup) {
        this.gameState.fading = true;
        this.gameState.nextState = stateCode.PLAY;
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

    setupGamepad(p5){
        p5.noCursor();
        this.buttons.forEach(button => {
            button.mode = "gamepad";
        });
    }

    setupMouse(p5) {
        p5.cursor();
        this.buttons.forEach(button => {
            button.mode = "mouse";
        });
    }

    cancel(){
        this.selectedStageGroup = stageGroup.NO_STAGE;
        this.buttons.forEach(button => {
            button.circle = null;
        });
    }

}