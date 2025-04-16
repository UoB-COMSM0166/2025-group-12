// @ts-nocheck
// Import the Container module which manages the various sub-modules and game logic
import { Container } from "./controller/Container.js";
// Import the module that loads images
import { loadImages } from "./Preloader.js";
// Import functions for handling gamepad events such as analog stick movements and button presses
import {
    analogStickMoved, analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "./controller/GamepadHandler.js";

// Import CanvasSize and resolutions to set the canvas size according to the chosen resolution
import { CanvasSize, resolutions } from "./CanvasSize.js";

/** @type {Container} */
let container;

new p5((p) => {
    p.preload = () => {
        p.images = loadImages(p);
    };

    p.setup = () => {
        // Automatically detect the resolution based on current window size, 
        // then set CanvasSize accordingly
        let detectedRes = CanvasSize.detectResolution(p.windowWidth, p.windowHeight);
        CanvasSize.setSize(detectedRes);

        container = new Container(p);

        // Get the canvas size from CanvasSize and create the canvas accordingly
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);

        let centerPos = container.utilityClass.relative2absolute(0.5, 0.5);
        p.gamepadX = centerPos[0];
        p.gamepadY = centerPos[1];
        p.mouseSpeed = 20;

        anyGamepadButtonPressed((index) => {
            if (container.controller && container.controller.gameState.mode !== "gamepad") {
                container.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(container.menus)) {
                    if (!value) continue;
                    value.shift2Gamepad(p);
                }
                container.controller.pauseMenu.shift2Gamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            if (index === 0) container.controller.clickListener(p);
            else container.controller.gamepadListener(index);
        });

        analogStickMoved((axes) => {
            container.controller.analogStickListener(p, axes);
        });

        analogStickPressed((axes) => {
            if (container.controller && container.controller.gameState.mode !== "gamepad") {
                container.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(container.controller.menus)) {
                    if (!value) continue;
                    value.shift2Gamepad(p);
                }
                container.controller.pauseMenu.shift2Gamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            container.controller.analogStickPressedListener(axes);
        });
    };

    // When the window is resized, detect the new resolution and update the canvas size accordingly
    p.windowResized = () => {
        let newRes = CanvasSize.detectResolution(p.windowWidth, p.windowHeight);
        CanvasSize.setSize(newRes);
        let newSize = CanvasSize.getSize();
        p.resizeCanvas(newSize[0], newSize[1]);
        // 若需要，通知 container 與各模組重新計算相關 UI 參數（例如可呼叫 container.reset(p)）
    };

    p.mouseWheel = (event) => {
        if (!container || !container.controller) return;
        container.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        if (!container || !container.controller) return;
        container.controller.clickListener(p);
    }

    p.mouseMoved = () => {
        if (!container || !container.controller) return;
        container.controller.mouseMoved(p);
    }

    p.draw = () => {
        p.background(100);

        pollGamepad(p, container.controller.menus[container.controller.gameState.getState()], container.controller.saveState);

        container.controller.mainLoopEntry(p);

        // 渲染畫面
        container.renderer.render(p);

        // 儲存目前狀態
        container.controller.saveState = container.gameState.getState();
    };
});
