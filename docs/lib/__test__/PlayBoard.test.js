import {createMockP5, simulateKeyDown} from "./Persona5.js";
import { tick } from "./Tick.js";
import { Container } from "../../src/controller/Container.js";
// --------------------------------------
import { stateCode } from "../../src/model/GameState.js";
import { PlayBoardLogic, PlayBoardModel } from "../../src/model/PlayBoard.js";
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

test('test click cell', () => {
    expect(container.gameState.state).toBe(stateCode.PLAY);


});

test('', () => {

});

test('', () => {

});