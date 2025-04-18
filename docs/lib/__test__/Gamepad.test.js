import {tick} from "./Tick.js";
import {Container} from "../../src/controller/Container.js";
import {stateCode} from "../../src/model/GameState.js";

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
beforeEach(() => {
    container = new Container(p);
    controller = container.controller;
    startMenu = container.startMenu;
})

test('test new game button, entered game map then quit to menu', () => {
    let newGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    p.mouseX = newGame.x + newGame.width / 2;
    p.mouseY = newGame.y + newGame.height / 2;
    controller.clickListener(p);

    // next cycle - game menu change to game map
    tick(p, container, 50);

    expect(container.gameState.state).toBe(stateCode.STANDBY);

    // next cycle - game menu change to start menu
    container.gameState.setState(stateCode.MENU);
    tick(p, container, 50);

    expect(newGame.text.toLowerCase().includes('resume')).toBe(true);
});

test('test load game but no save data found', () => {
    let startMenu = container.startMenu;
    expect(startMenu.floatingWindow).toBeFalsy();
    let loadGame = startMenu.buttons.find(button => button.text.toLowerCase().includes('load'));
    p.mouseX = loadGame.x + loadGame.width / 2;
    p.mouseY = loadGame.y + loadGame.height / 2;
    controller.clickListener(p);
    expect(startMenu.floatingWindow).toBeTruthy();
    /** @type {FloatingWindow} */
    let fw = startMenu.floatingWindow;
    expect(fw.text.toLowerCase().includes('no') && fw.text.toLowerCase().includes('save') && fw.text.toLowerCase().includes('found')).toBe(true);
});

test("test pause menu does not respond", () => {
    expect(container.gameState.paused).toBe(false);
    simulateKeyDown('Escape');
    expect(container.gameState.paused).toBe(false);
});