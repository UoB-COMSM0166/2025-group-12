import {
    analogStickMoved,
    analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "../../src/controller/GamepadHandler.js";
import {createMockP5, simulateGamepad} from "./Persona5.js";
import {Container} from "../../src/controller/Container.js";
import {tick} from "./Tick.js";
import {stateCode} from "../../src/model/GameState.js";
import {GameMapModel} from "../../src/model/GameMap.js";

let p;
beforeAll(() => {
    p = createMockP5();
});

/** @type {Container} */
let container;

/** @type {Controller} */
let controller;

/** @type {StartMenuModel} */
let startMenu;

let gameMap;
beforeEach(() => {
    container = new Container(p);
    controller = container.controller;
    startMenu = container.startMenu;
    gameMap = container.gameMap;
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

});

test("anyGamepadButtonPressed game mode should change", () => {
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    expect(container.controller.gameState.mode).toEqual("gamepad");

});

test("gamepad conform button pressed is equal to a mouse click", () => {
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    // next cycle - game menu change to game map
    tick(p, container, 50);

    expect(container.gameState.state).toBe(stateCode.STANDBY);

    // next cycle - game menu change to start menu
    container.gameState.setState(stateCode.MENU);
    tick(p, container, 50);

    expect(newGame.text.toLowerCase().includes('resume')).toBe(true);
});

test("gamepad direction button in start menu", () => {
    let newGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    expect(newGame).toBeTruthy();
    let loadGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('load'));
    expect(newGame).toBeTruthy();
    let options = startMenu.buttons.find(button => button.text.toLowerCase().includes('options'));
    expect(newGame).toBeTruthy();
    simulateGamepad(12, true);
    simulateGamepad(12, false);
    expect(newGame.isSelected).toBe(true);
    simulateGamepad(12, true);
    simulateGamepad(12, false);
    expect(newGame.isSelected).toBe(false);
    expect(options.isSelected).toBe(true);
    simulateGamepad(12, true);
    simulateGamepad(12, false);
    expect(loadGame.isSelected).toBe(true);
    simulateGamepad(13, true);
    simulateGamepad(13, false);
    expect(options.isSelected).toBe(true);
    simulateGamepad(13, true);
    simulateGamepad(13, false);
    expect(newGame.isSelected).toBe(true);
});

test("gamepad analog stick in start menu", () => {
    let newGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    expect(newGame).toBeTruthy();
    let loadGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('load'));
    expect(newGame).toBeTruthy();
    let options = startMenu.buttons.find(button => button.text.toLowerCase().includes('options'));
    expect(newGame).toBeTruthy();
    simulateGamepad(0, false, [0, -0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(newGame.isSelected).toBe(true);
    simulateGamepad(0, false, [0, -0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(newGame.isSelected).toBe(false);
    expect(options.isSelected).toBe(true);
    simulateGamepad(0, false, [0, -0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(loadGame.isSelected).toBe(true);
    simulateGamepad(0, false, [0, 0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(options.isSelected).toBe(true);
    simulateGamepad(0, false, [0, 0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(newGame.isSelected).toBe(true);
});

test("gamepad button in game map", () => {
    // shift to game map menu
    let newGame = container.startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    expect(newGame).toBeTruthy();
    p.mouseX = newGame.x + newGame.width / 2;
    p.mouseY = newGame.y + newGame.height / 2;
    controller.clickListener(p);
    // next cycle - game menu change to game map
    tick(p, container, 50);

    expect(container.gameState.state).toBe(stateCode.STANDBY);
    let tornado = gameMap.buttons.find(button => button.stageGroup === GameMapModel.stageGroup.TORNADO);
    expect(tornado).toBeTruthy();
    let volcano = gameMap.buttons.find(button => button.stageGroup === GameMapModel.stageGroup.VOLCANO);
    expect(volcano).toBeTruthy();


    expect(gameMap.floatingWindow).toBeFalsy();
    expect(tornado.circle).toBeFalsy();
    p.gamepadX = volcano.x + volcano.width / 2;
    p.gamepadY = volcano.y + volcano.height / 2;
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    expect(gameMap.floatingWindow).toBeTruthy();
    expect(gameMap.floatingWindow.text.toLowerCase().includes('lock'));
    expect(tornado.circle).toBeFalsy();

    p.gamepadX = container.utilityClass.relative2absolute(0.5, 1)[0];
    p.gamepadY = container.utilityClass.relative2absolute(0.5, 1)[1];
    simulateGamepad(0, true);
    simulateGamepad(0, false);

    // next cycle - wait for the floating window to fade
    tick(p, container, 50);

    expect(gameMap.floatingWindow).toBeFalsy();

    expect(tornado.circle).toBeFalsy();
    p.gamepadX = tornado.x + tornado.width / 2;
    p.gamepadY = tornado.y + tornado.height / 2;
    simulateGamepad(0, true);
    simulateGamepad(0, false);
    expect(container.gameState.state).toBe(stateCode.STANDBY);
    expect(tornado.circle).toBeTruthy();
});

test("gamepad analog stick in game map", () => {
    // shift to game map menu
    let newGame = container.startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    expect(newGame).toBeTruthy();
    p.mouseX = newGame.x + newGame.width / 2;
    p.mouseY = newGame.y + newGame.height / 2;
    controller.clickListener(p);
    // next cycle - game menu change to game map
    tick(p, container, 50);
    expect(container.gameState.state).toBe(stateCode.STANDBY);

    p.gamepadX = 0;
    p.gamepadY = 0;
    simulateGamepad(0, false, [0, -0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    simulateGamepad(0, false, [0, -0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(p.gamepadY).toBe(0);
    simulateGamepad(0, false, [0, 0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(p.gamepadY).toBe(0.8 * p.mouseSpeed);
    simulateGamepad(0, false, [0.8, 0, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(p.gamepadX).toBe(0.8 * p.mouseSpeed);
    p.gamepadX = container.utilityClass.CanvasSize.getSize()[0];
    p.gamepadY = container.utilityClass.CanvasSize.getSize()[1];
    simulateGamepad(0, false, [0, 0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(p.gamepadY).toBe( container.utilityClass.CanvasSize.getSize()[1]);
    simulateGamepad(0, false, [0.8, 0.8, 0, 0]);
    simulateGamepad(0, false, [0, 0, 0, 0]);
    expect(p.gamepadX).toBe( container.utilityClass.CanvasSize.getSize()[0]);
});


