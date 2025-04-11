import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {loadImages, loadSounds} from "./Preloader.js";
import {
    analogStickMoved, analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "./model/Gamepad.js";



new p5((p) => {

    p.preload = () => {
        p.images = loadImages(p);
        p.soundFormats('mp3');
        p.mySounds = loadSounds(p);
        p.gamepadX = CanvasSize.getSize()[0]/2;
        p.gamepadY = CanvasSize.getSize()[1]/2;
        p.mouseSpeed = 20;
    };

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        p.controller = new Controller(p);
        p.controller.setup(p);

        anyGamepadButtonPressed( (index) => {
            if(p.controller && p.controller.gameState.mode !== "gamepad") {
                p.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(p.controller.menus)) {
                    if(!value) continue;
                    value.setupGamepad(p);
                }
                p.controller.pauseMenu.setupGamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            if(index === 0) p.controller.clickListener(p);
            else p.controller.gamepadListener(index);
        });

        analogStickMoved((axes) => {
           p.controller.analogStickListener(axes, p);
        });

        analogStickPressed((axes) => {
            if(p.controller && p.controller.gameState.mode !== "gamepad") {
                p.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(p.controller.menus)) {
                    if(!value) continue;
                    value.setupGamepad(p);
                }
                p.controller.pauseMenu.setupGamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            p.controller.analogStickPressedListener(axes);
        })

    };

    p.mouseWheel = (event) => {
        if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
            return;
        }
        p.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
            return;
        }
        p.controller.clickListener(p);
    }



    p.mouseMoved = () => {
        if(p.controller && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
        }
    }
    p.draw = () => {
        p.background(100);

        pollGamepad(p, p.controller.menus[p.controller.gameState.getState()], p.controller.saveState);

        // create play stage
        p.controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        p.controller.setData(p, p.controller.gameState.getState());

        // replace following tmp view handling later
        p.controller.view(p);

        // keep a copy of current state
        p.controller.saveState = p.controller.gameState.getState();

    };
});
