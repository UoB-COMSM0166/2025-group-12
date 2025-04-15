import { createMockP5 } from "./Persona5.js";
import { tick } from "./Tick.js";
import { Container } from "../../src/controller/Container.js";
// --------------------------------------
import { stateCode } from "../../src/model/GameState.js";
import { GameMapLogic, GameMapModel } from "../../src/model/GameMap.js";
import { InventoryLogic } from "../../src/model/Inventory.js";
import { plantTypes } from "../../src/items/ItemTypes.js";

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
    expect(container.gameState.state).toBe(stateCode.STANDBY);
    let tornado = gameMap.buttons.find(button => button.stageGroup === GameMapModel.stageGroup.TORNADO);
    expect(gameMap.floatingWindow).toBeFalsy();
    expect(tornado.circle).toBeFalsy();

    p.mouseX = tornado.x + tornado.width / 2;
    p.mouseY = tornado.y + tornado.height / 2;
    controller.clickListener(p);

    // next cycle 
    tick(p, container, 1);

    expect(container.gameState.state).toBe(stateCode.STANDBY);
    expect(tornado.circle).toBeTruthy();
    expect(gameMap.floatingWindow).toBeFalsy();

    p.mouseX = tornado.x + tornado.width / 2;
    p.mouseY = tornado.y + tornado.height / 2;
    controller.clickListener(p);

    // next cycle - wait state transition fading
    tick(p, container, 50);

    expect(container.gameState.state).toBe(stateCode.PLAY);
    // remove the circle, even if we have moved to play board
    expect(tornado.circle).toBeFalsy();
});

test('insert items to the inventory then test scroll', () => {
    expect(container.gameState.state).toBe(stateCode.STANDBY);
    let inventory  = container.gameState.inventory;
    expect(inventory.scrollIndex).toBe(0);
    InventoryLogic.pushItem2Inventory(p, plantTypes.BAMBOO, 1, inventory);

    // scroll mouse both wihtin or out of the inventory box have no effect
    p.mouseX = 0;
    p.mouseY = 0;
    controller.scrollListener(p, {deltaY: 1});
    expect(inventory.scrollIndex).toBe(0);
    p.mouseX = inventory.inventoryX + inventory.inventoryWidth / 2;
    p.mouseY = inventory.inventoryY + inventory.inventoryHeight / 2;
    controller.scrollListener(p, {deltaY: 1});
    expect(inventory.scrollIndex).toBe(0);

    InventoryLogic.pushItem2Inventory(p, plantTypes.PINE, 1, inventory);
    InventoryLogic.pushItem2Inventory(p, plantTypes.PALM, 1, inventory);
    InventoryLogic.pushItem2Inventory(p, plantTypes.CORN, 1, inventory);
    InventoryLogic.pushItem2Inventory(p, plantTypes.FIRE_HERB, 1, inventory);
    InventoryLogic.pushItem2Inventory(p, plantTypes.ORCHID, 1, inventory);

    p.mouseX = 0;
    p.mouseY = 0;
    controller.scrollListener(p, {deltaY: 1});
    expect(inventory.scrollIndex).toBe(0);
    p.mouseX = inventory.inventoryX + inventory.inventoryWidth / 2;
    p.mouseY = inventory.inventoryY + inventory.inventoryHeight / 2;
    controller.scrollListener(p, {deltaY: 1});
    controller.scrollListener(p, {deltaY: 1});
    expect(inventory.scrollIndex).toBe(0);

    InventoryLogic.pushItem2Inventory(p, plantTypes.KIKU, 1, inventory);
    
    p.mouseX = 0;
    p.mouseY = 0;
    controller.scrollListener(p, {deltaY: 1});
    expect(inventory.scrollIndex).toBe(0);

    p.mouseX = inventory.inventoryX + inventory.inventoryWidth / 2;
    p.mouseY = inventory.inventoryY + inventory.inventoryHeight / 2;
    controller.scrollListener(p, {deltaY: 1});
    controller.scrollListener(p, {deltaY: 1});
    // next cycle - wait effect
    tick(p, container, 1);
    expect(inventory.scrollIndex).toBe(1);
});