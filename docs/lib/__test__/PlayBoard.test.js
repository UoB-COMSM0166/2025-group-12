import {createMockP5, simulateKeyDown, simulateKeyPress, simulateKeyUp} from "./Persona5.js";
import {tick} from "./Tick.js";
import {Container} from "../../src/controller/Container.js";
// --------------------------------------
import {stateCode} from "../../src/model/GameState.js";
import {PlayBoardLogic, PlayBoardModel} from "../../src/model/PlayBoard.js";
import {InventoryLogic} from "../../src/model/Inventory.js";
import {plantTypes} from "../../src/items/ItemTypes.js";
import {BoardLogic} from "../../src/model/BoardCells.js";

let p;
beforeAll(() => {
    p = createMockP5();
});

/** @type {Container} */
let container;

/** @type {Controller} */
let controller;

/** @type {PlayBoardModel} */
let playBoard;

beforeEach(() => {
    container = new Container(p);
    controller = container.controller;

    // shift to game map
    let newGame = container.startMenu.buttons.find(button => button.text.toLowerCase().includes('new'));
    p.mouseX = newGame.x + newGame.width / 2;
    p.mouseY = newGame.y + newGame.height / 2;
    controller.clickListener(p);
    // next cycle - game menu change to game map
    tick(p, container, 50);

    // click once
    let tsunami = container.gameMap.buttons.find(button => button.stageGroup === PlayBoardLogic.stageGroup.TSUNAMI);
    p.mouseX = tsunami.x + tsunami.width / 2;
    p.mouseY = tsunami.y + tsunami.height / 2;
    p.keyIsPressed = true;
    p.key = 'v';
    controller.clickListener(p);

    // next cycle
    tick(p, container, 1);
    controller.clickListener(p);

    // next cycle - wait for fade in fade out
    tick(p, container, 50);
})

test('test click cell and inventory', () => {
    expect(container.gameState.state).toBe(stateCode.PLAY);
    playBoard = container.gameState.currentStage;

    // click a cell, displays info box
    expect(playBoard.infoBox.activateButton).toBeFalsy();
    expect(playBoard.infoBox.displayButton).toBeFalsy();
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 10, p.CENTER);
    controller.clickListener(p);

    // next cycle
    tick(p, container, 1);
    expect(playBoard.infoBox.activateButton).toBeFalsy();
    expect(playBoard.infoBox.displayButton).toBeTruthy();

    // click out of inventory bounds
    expect(playBoard.shadowPlant).toBeFalsy();
    let [x, y, width, height] = InventoryLogic.getItemPositionAndSize(container.inventory.maxVisibleItems, container.inventory);
    p.mouseX = x + width / 2;
    p.mouseY = y + height / 2;
    controller.clickListener(p);
    tick(p, container, 1);

    // click an inventory item then click a cell to plant
    expect(playBoard.shadowPlant).toBeFalsy();
    [x, y, width, height] = InventoryLogic.getItemPositionAndSize(0, container.inventory);
    p.mouseX = x + width / 2;
    p.mouseY = y + height / 2;
    controller.clickListener(p);
    tick(p, container, 1);

    expect(playBoard.shadowPlant).toBeTruthy();
    expect(playBoard.infoBox.activateButton).toBeFalsy();
    expect(playBoard.infoBox.displayButton).toBeFalsy();
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 10, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(playBoard.shadowPlant).toBeFalsy();
    expect(playBoard.infoBox.displayButton).toBeTruthy();
});

test('test inventory scroll', () => {
    let inventory = container.inventory;
    expect(inventory.scrollIndex).toBe(0);

    p.mouseX = inventory.inventoryX + inventory.inventoryWidth / 2;
    p.mouseY = inventory.inventoryY + inventory.inventoryHeight / 2;
    controller.scrollListener(p, {deltaY: 1});
    // next cycle - wait effect
    tick(p, container, 1);
    expect(inventory.scrollIndex).toBe(1);

    controller.scrollListener(p, {deltaY: 1});
    // next cycle - wait effect
    tick(p, container, 1);
    expect(inventory.scrollIndex).toBe(2);
});

test('test quit to game map', () => {
    expect(container.gameState.paused).toBe(false);
    simulateKeyDown('Escape');
    expect(container.gameState.paused).toBe(true);
    let quit = container.pauseMenu.buttons.find(button => button.text.toLowerCase().includes('back'));
    p.mouseX = quit.x + quit.width / 2;
    p.mouseY = quit.y + quit.height / 2;
    controller.clickListener(p);

    // next cycle - wait for fade in fade ouy
    tick(p, container, 50);

    expect(container.gameState.state).toBe(stateCode.STANDBY);
});

test('test planting 3 plants forming ecosystem, and activate button, then modify the board to test active skills working', () => {
    playBoard = container.gameState.currentStage;
    let inventory = container.inventory;

    expect(playBoard.actionPoints).toBe(playBoard.maxActionPoints);

    inventory.selectedItem = plantTypes.PINE;
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 10, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.plantType).toBe(plantTypes.PINE);

    inventory.selectedItem = plantTypes.CORN;
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 11, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(BoardLogic.getCell(10, 11, playBoard.boardObjects).plant.plantType).toBe(plantTypes.CORN);

    inventory.selectedItem = plantTypes.ORCHID;
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 11, 10, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(BoardLogic.getCell(11, 10, playBoard.boardObjects).plant.plantType).toBe(plantTypes.ORCHID);

    // check skill status
    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.hasActive).toBe(true);
    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.hasExtended).toBe(true);
    expect(BoardLogic.getCell(11, 10, playBoard.boardObjects).plant.hasActive).toBe(true);

    // check has activate button
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 10, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(playBoard.buttons.find(button => button.text.toLowerCase().includes('activate'))).toBeTruthy();

    // check action points
    expect(playBoard.actionPoints).toBe(0);

    // cannot plant after actions point zeros
    expect(playBoard.floatingWindow).toBeNull();
    inventory.selectedItem = plantTypes.PINE;
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 12, 12, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(BoardLogic.getCell(12, 12, playBoard.boardObjects).plant).toBeFalsy();
    expect(playBoard.floatingWindow).toBeTruthy();
    // click again to disable fw
    inventory.selectedItem = null;
    controller.clickListener(p);
    tick(p, container, 50);

    // hit the corn and heal it
    BoardLogic.getCell(10, 11, playBoard.boardObjects).plant.health -= 1;
    expect(BoardLogic.getCell(10, 11, playBoard.boardObjects).plant.health).toBe(1);
    tick(p, container, 1);
    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.useLeft).toBe(1);
    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 10, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(playBoard.buttons.find(button => button.text.toLowerCase().includes('activate'))).toBeTruthy();

    let activate = playBoard.buttons.find(button => button.text.toLowerCase().includes('activate'));
    p.mouseX = activate.x + activate.width / 2;
    p.mouseY = activate.y + activate.height / 2;
    controller.clickListener(p);
    tick(p, container, 1);
    expect(playBoard.awaitCell).toBe(true);

    [p.mouseX, p.mouseY] = container.utilityClass.cellIndex2Pos(p, playBoard, 10, 11, p.CENTER);
    controller.clickListener(p);
    tick(p, container, 1);
    expect(BoardLogic.getCell(10, 11, playBoard.boardObjects).plant.health).toBe(2);
    tick(p, container, 1);
    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.useLeft).toBe(0);

    // drop a bandit
    // activate orchid skill
});

test('test end turn button works', () => {

});

test('test undo works', () => {

});

test('test save and load', () => {

});