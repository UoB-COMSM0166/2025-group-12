import {Container} from "./controller/Container.js";
import {loadImages} from "./Preloader.js";
import {
    analogStickMoved, analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "./controller/GamepadHandler.js";

/** @type {Container} */
let container;

new p5((p) => {
    p.preload = () => {
        p.images = loadImages(p);
    };

    p.setup = () => {
        container = new Container(p);
        let canvasSize = container.utilityClass.relative2absolute(1, 1);
        p.createCanvas(canvasSize[0], canvasSize[1]);
        p.gamepadX = container.utilityClass.relative2absolute(0.5, 0.5)[0];
        p.gamepadY = container.utilityClass.relative2absolute(0.5, 0.5)[1];
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
        })
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

        // rendering
        container.renderer.render(p);

        // keep a copy of current state
        container.controller.saveState = container.gameState.getState();

    };
});

