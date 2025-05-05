import {Container} from "./controller/Container.js";
import {loadEssentialImages, loadImages} from "./Preloader.js";
import {
    analogStickIdle,
    analogStickMoved, analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "./controller/GamepadHandler.js";

/** @type {Container} */
let container;

new p5((p) => {
    p.preload = () => {
        p.images = loadEssentialImages(p);
    };

    p.setup = () => {
        loadImages(p).then(() => p.loadedAll = true);

        document.querySelector(".loader").style.display = "none";
        container = new Container(p);

        let canvasSize = container.CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);

        p.gamepadX = container.CanvasSize.getSize()[0] / 2;
        p.gamepadY = container.CanvasSize.getSize()[1] / 2;
        p.mouseSpeed = 20;

        anyGamepadButtonPressed((index) => {
            if (container.controller && container.controller.gameState.mode !== "gamepad") {
                container.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(container.menus)) {
                    if (!value) continue;
                    value.shift2Gamepad(p);
                }
                container.controller.pauseMenu.shift2Gamepad(p);
                return;
            }
            if (index === 0) container.controller.clickListener(p);
            else container.controller.gamepadListener(index);
        });

        analogStickMoved((axes) => {
            container.controller.analogStickListener(p, axes);
        });

        analogStickPressed((axes) => {
            if(!p.loadedAll && container.gameState.getState() === container.stateCode.STANDBY) return;
            if (container.controller && container.controller.gameState.mode !== "gamepad") {
                container.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(container.controller.menus)) {
                    if (!value) continue;
                    value.shift2Gamepad(p);
                }
                container.controller.pauseMenu.shift2Gamepad(p);
                return;
            }
            container.controller.analogStickPressedListener(axes);
        });

        analogStickIdle((axes) => {
            container.controller.analogStickIdleListener(axes);
        });
    };

    p.windowResized = () => {
        if (!container || !container.controller) return;
        p.resizeCanvas(container.CanvasSize.getSize()[0], container.CanvasSize.getSize()[1]);
        container.controller.resize();
    };

    p.mouseWheel = (event) => {
        if (!container || !container.controller) return;
        container.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        if (!container || !container.controller) return;
        if(!p.loadedAll && container.gameState.getState() === container.stateCode.STANDBY) return;
        container.controller.clickListener(p);
    }

    p.mouseMoved = () => {
        if (!container || !container.controller) return;
        container.controller.mouseMoved(p);
    }

    p.draw = () => {
        pollGamepad(p, container.controller.menus[container.controller.gameState.getState()], container.controller.saveState);

        container.controller.mainLoopEntry(p);

        // rendering
        container.renderer.render(p);

        // keep a copy of current state
        container.controller.saveState = container.gameState.getState();
    };
});
