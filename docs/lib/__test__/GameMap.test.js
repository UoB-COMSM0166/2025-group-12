import {createMockP5} from "./Persona5.js";
import {tick} from "./Tick.js";
import {Container} from "../../src/controller/Container.js";
// --------------------------------------
import {stateCode} from "../../src/model/GameState.js";
import {GameMapLogic, GameMapModel} from "../../src/model/GameMap.js";

let p;
beforeAll(() => {
    p = createMockP5();
});

/** @type {Container} */
let container;

/** @type {Controller} */
let controller;

/** @type {GameMapModel} */
let gameMap;
beforeEach(() => {
    container = new Container(p);
    controller = container.controller;
    gameMap = container.gameMap;

    // shift to game map menu
    let newGame = container.startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    p.mouseX = newGame.x + newGame.width / 2;
    p.mouseY = newGame.y + newGame.height / 2;
    controller.clickListener(p);
    // next cycle - game menu change to game map
    tick(p, container, 50);
})

test('click a locked stage, then click somewhere else, then click unlocked stage, then click somewhere else', () => {
    expect(container.gameState.state).toBe(stateCode.STANDBY);
    let tornado = gameMap.buttons.find(button => button.stageGroup === GameMapModel.stageGroup.TORNADO);
    let volcano = gameMap.buttons.find(button => button.stageGroup === GameMapModel.stageGroup.VOLCANO);

    expect(gameMap.floatingWindow).toBeFalsy();
    expect(tornado.circle).toBeFalsy();
    p.mouseX = volcano.x + volcano.width / 2;
    p.mouseY = volcano.y + volcano.height / 2;
    controller.clickListener(p);
    expect(gameMap.floatingWindow).toBeTruthy();
    expect(gameMap.floatingWindow.text.toLowerCase().includes('lock'));
    expect(tornado.circle).toBeFalsy();

    p.mouseX = container.utilityClass.relative2absolute(0.5, 1)[0];
    p.mouseY = container.utilityClass.relative2absolute(0.5, 1)[1];
    controller.clickListener(p);

    // next cycle - wait for the floating window to fade
    tick(p, container, 50);

    expect(gameMap.floatingWindow).toBeFalsy();

    expect(tornado.circle).toBeFalsy();
    p.mouseX = tornado.x + tornado.width / 2;
    p.mouseY = tornado.y + tornado.height / 2;
    controller.clickListener(p);
    expect(container.gameState.state).toBe(stateCode.STANDBY);
    expect(tornado.circle).toBeTruthy();
});

test('click an unlocked stage twice to enter game', () => {

});

test('insert items to the inventory then test scroll', () => {

});