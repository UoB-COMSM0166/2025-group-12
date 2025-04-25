import {createMockP5, simulateKeyDown, simulateKeyPress, simulateKeyUp} from "./Persona5.js";
import {tick} from "./Tick.js";
import {Container} from "../../src/controller/Container.js";
// --------------------------------------
import {stageGroup, stateCode} from "../../src/model/GameState.js";
import {PlayBoardLogic, PlayBoardModel} from "../../src/model/PlayBoard.js";
import {InventoryLogic} from "../../src/model/Inventory.js";
import {movableTypes, plantTypes, seedTypes, terrainTypes} from "../../src/items/ItemTypes.js";
import {BoardLogic, BoardModel} from "../../src/model/BoardCells.js";
import {SlideLogic} from "../../src/items/SlideAnimation.js";
import {MovableModel} from "../../src/items/Movable.js";
import {Volcano1PlayBoard} from "../../src/model/stages/Vol1.js";

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
    container.gameState.state = stateCode.PLAY;
    container.gameState.currentStageGroup = stageGroup.TSUNAMI;

    let stagePackage = {
        concreteBoardInit: (playBoard) => {
            playBoard.stageGroup = stageGroup.TSUNAMI;
            playBoard.stageNumbering = 1;
            // grid parameters
            playBoard.gridSize = 16;
            [playBoard.cellWidth, playBoard.cellHeight] = container.utilityClass.relative2absolute(1 / 20, 4 / 45);

            // board objects array
            playBoard.boardObjects = new BoardModel(playBoard.gridSize);

            // turn counter
            playBoard.turn = 1;
            playBoard.maxTurn = 30;

            playBoard.fertilized = Array.from({length: playBoard.gridSize},
                () => Array.from({length: playBoard.gridSize}, () => false));

        },
        setStageInventory: (p5, playBoard) => {
            InventoryLogic.pushItem2Inventory(p5, plantTypes.PALM, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.PINE, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.CORN, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.ORCHID, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.FIRE_HERB, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.BAMBOO, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.PLUM, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, plantTypes.KIKU, 10, playBoard.gameState.inventory);

            InventoryLogic.pushItem2Inventory(p5, seedTypes.PALM, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.PINE, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.CORN, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.ORCHID, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.FIRE_HERB, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.BAMBOO, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.PLUM, 10, playBoard.gameState.inventory);
            InventoryLogic.pushItem2Inventory(p5, seedTypes.KIKU, 10, playBoard.gameState.inventory);
        },
        setStageTerrain: (p5, playBoard) => {
            for (let i = 0; i < playBoard.gridSize; i++) {
                for (let j = 0; j < playBoard.gridSize; j++) {
                    if (j >= 8) {
                        BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
                    } else {
                        BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.SEA)(), playBoard.boardObjects);
                    }
                }
            }
            BoardLogic.setCell(8, 15, container.terrainFactory.get(terrainTypes.BASE)(), playBoard.boardObjects);
            BoardLogic.setCell(7, 8, container.terrainFactory.get(terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
            BoardLogic.setCell(7, 9, container.terrainFactory.get(terrainTypes.BASE)(), playBoard.boardObjects);
        },
        nextTurnItems: (p5, playBoard) => {
        },
        modifyBoard: (p5, playBoard, code) => {
        },
        setFloatingWindow: (p5, playBoard) => {
        },
        initAllFloatingWindows: (p5, playBoard) => {
            let afw = new Map();
            container.utilityClass.commonFloatingWindows(p5, afw);
            playBoard.allFloatingWindows = afw;
        }
    }
    container.gameState.gsf.wiringUp(stagePackage, PlayBoardModel, PlayBoardLogic);
    let mockPlayBoard = new PlayBoardModel(p, container.gameState);
    container.gameState.currentStage = /** @type {PlayBoardLike} */ mockPlayBoard;
    controller.menus[stateCode.PLAY] = mockPlayBoard;

    tick(p, container, 10);
    playBoard = /** @type {PlayBoardModel} */ container.gameState.currentStage;
})

test('test blizzard movement', () => {
    container.movableFactory.get(movableTypes.BLIZZARD)(playBoard, 7, 9, 1);
    BoardLogic.getCell(8, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(7, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.CORN)();
    BoardLogic.getCell(8, 9, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.ORCHID)();
    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant.health).toBe(1);
    expect(playBoard.movables[0].countdown).toBe(1);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 100);

    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant.health).toBe(1);
    expect(playBoard.movables[0].countdown).toBe(0);

    controller.clickListener(p);
    tick(p, container, 100);

    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(1);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant).toBeFalsy();
    expect(playBoard.movables.length).toBe(0);

    container.movableFactory.get(movableTypes.BLIZZARD)(playBoard, 7, 9, 0);
    BoardLogic.plantCell(p, playBoard, 8, 9, container.plantFactory.get(plantTypes.FIRE_HERB)());
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).ecosystem.withstandSnow).toBe(true);
    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).ecosystem.withstandSnow).toBe(true);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).ecosystem.withstandSnow).toBe(true);
    controller.clickListener(p);
    tick(p, container, 100);

    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(1);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant.health).toBe(1);
})

test('test earthquake movement', () => {
    container.movableFactory.get(movableTypes.EARTHQUAKE)(playBoard);
    BoardLogic.getCell(8, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(7, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.CORN)();
    BoardLogic.getCell(8, 9, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.ORCHID)();
    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant.health).toBe(1);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());

    tick(p, container, 500);

    expect(BoardLogic.getCell(8, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(8, 9, playBoard.boardObjects).plant.health).toBe(1);
    expect(playBoard.movables.length).toBe(0);
})

test('test landslide movement', () => {
    BoardLogic.getCell(10, 10, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.HILL)();
    BoardLogic.getCell(10, 10, playBoard.boardObjects).terrain.canSlide = true;

    BoardLogic.getCell(10, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();
    BoardLogic.getCell(10, 11, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.PINE)();
    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 10, 12);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 10, 13, 'r', 3);

    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant.plantType).toBe(plantTypes.BAMBOO);
    expect(BoardLogic.getCell(10, 11, playBoard.boardObjects).seed.seedType).toBe(seedTypes.PINE);
    expect(BoardLogic.getCell(10, 12, playBoard.boardObjects).enemy.movableType).toBe(movableTypes.BANDIT);
    expect(BoardLogic.getCell(10, 13, playBoard.boardObjects).enemy.movableType).toBe(movableTypes.TORNADO);
    expect(BoardLogic.getCell(10, 14, playBoard.boardObjects).terrain.terrainType).toBe(terrainTypes.DESERT);
    expect(BoardLogic.getCell(10, 15, playBoard.boardObjects).terrain.terrainType).toBe(terrainTypes.DESERT);
    expect(playBoard.movables.length).toBe(2);

    SlideLogic.generateSlide(p, playBoard, MovableModel, 10, 14);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());

    tick(p, container, 500);

    expect(BoardLogic.getCell(10, 10, playBoard.boardObjects).plant).toBeFalsy();
    expect(BoardLogic.getCell(10, 11, playBoard.boardObjects).seed).toBeFalsy();
    expect(BoardLogic.getCell(10, 12, playBoard.boardObjects).enemy).toBeFalsy();
    expect(BoardLogic.getCell(10, 13, playBoard.boardObjects).enemy.movableType).toBe(movableTypes.TORNADO);
    expect(BoardLogic.getCell(10, 14, playBoard.boardObjects).terrain.terrainType).toBe(terrainTypes.LANDSLIDE);
    expect(BoardLogic.getCell(10, 15, playBoard.boardObjects).terrain.terrainType).toBe(terrainTypes.DESERT);
    expect(playBoard.movables.length).toBe(1);
})

test('test tsunami movement', () => {
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            if (j >= 8) {
                BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
            } else {
                BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.SEA)(), playBoard.boardObjects);
            }
        }
    }

    BoardLogic.getCell(0, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PALM)();
    BoardLogic.getCell(0, 9, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PALM)();
    BoardLogic.getCell(0, 10, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(1, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();
    BoardLogic.getCell(1, 9, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.ORCHID)();
    BoardLogic.getCell(1, 10, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.ORCHID)();
    BoardLogic.getCell(1, 11, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 2, 8);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 2, 9, 'r', 3);

    BoardLogic.getCell(3, 8, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.MOUNTAIN)();
    BoardLogic.getCell(3, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(4, 8, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.VOLCANO)();
    BoardLogic.getCell(4, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(5, 8, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.LUMBERING)();
    BoardLogic.getCell(5, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.LUMBERING)();
    BoardLogic.getCell(5, 11, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    container.movableFactory.get(movableTypes.TSUNAMI)(playBoard, 1, -1, 5);

    expect(playBoard.movables.length).toBe(3);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());

    tick(p, container, 500);

    // palm does not die
    expect(BoardLogic.getCell(0, 8, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(0, 9, playBoard.boardObjects).plant.health).toBe(2);
    // plant health offsets
    expect(BoardLogic.getCell(1, 8, playBoard.boardObjects).plant).toBeFalsy();
    expect(BoardLogic.getCell(1, 9, playBoard.boardObjects).plant).toBeFalsy();
    expect(BoardLogic.getCell(1, 10, playBoard.boardObjects).seed).toBeFalsy();
    // bandit dies
    expect(BoardLogic.getCell(2, 8, playBoard.boardObjects).enemy).toBeFalsy();
    expect(BoardLogic.getCell(2, 9, playBoard.boardObjects).enemy.movableType).toBe(movableTypes.TORNADO);
    // block by mountain or volcano

    // offset by lumbering

    expect(playBoard.movables.length).toBe(1);

    expect(playBoard.isGameOver).toBe(false);
})

test('test bomb movement', () => {
    BoardLogic.getCell(7, 10, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();

    BoardLogic.getCell(0, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PALM)();
    BoardLogic.getCell(0, 9, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.PALM)();

    BoardLogic.getCell(3, 9, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();

    Volcano1PlayBoard.generateVolBomb(p, 7, 9, playBoard);
    Volcano1PlayBoard.generateVolBomb(p, 0, 9, playBoard);
    Volcano1PlayBoard.generateVolBomb(p, 3, 9, playBoard);
    Volcano1PlayBoard.generateVolBomb(p, 5, 9, playBoard);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    tick(p, container, 500);
    expect(playBoard.turn).toBe(2);

    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 5, 9);
    expect(playBoard.movables.length).toBe(5);

    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());

    tick(p, container, 500);

    expect(playBoard.isGameOver).toBe(false);
    expect(playBoard.movables.length).toBe(1);
    expect(playBoard.movables.find(e => e.movableType === movableTypes.BANDIT).health).toBe(2);
    expect(BoardLogic.getCell(7, 10, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(0, 8, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(0, 9, playBoard.boardObjects).seed.health).toBe(1);
    expect(BoardLogic.getCell(3, 9, playBoard.boardObjects).plant.health).toBe(2);
})

test('test tornado movement', () => {
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            if (j >= 8) {
                BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
            } else {
                BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.SEA)(), playBoard.boardObjects);
            }
        }
    }

    BoardLogic.getCell(0, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(0, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(3, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(3, 7, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.CORN)();
    BoardLogic.getCell(2, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.KIKU)();
    BoardLogic.getCell(3, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(5, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();
    BoardLogic.getCell(5, 9, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    BoardLogic.getCell(6, 8, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.CORN)();
    BoardLogic.getCell(6, 9, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.CORN)();
    BoardLogic.getCell(6, 10, playBoard.boardObjects).terrain = container.terrainFactory.get(terrainTypes.BASE)();

    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 8, 8);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 0, 0, 'r', 0);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 3, 0, 'r', 0);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 5, 0, 'r', 0);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 6, 0, 'r', 0);
    container.movableFactory.get(movableTypes.TORNADO)(playBoard, 8, 0, 'r', 0);

    PlayBoardLogic.reevaluatePlantSkills(playBoard);

    expect(playBoard.movables.length).toBe(6);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 1000);

    expect(playBoard.movables.length).toBe(0);
    expect(playBoard.isGameOver).toBe(false);

    // hit PINE without extension
    expect(BoardLogic.getCell(0, 8, playBoard.boardObjects).plant.health).toBe(1);

    // hit PINE with extension
    expect(BoardLogic.getCell(3, 8, playBoard.boardObjects).plant.health).toBe(1);
    expect(BoardLogic.getCell(3, 7, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(2, 8, playBoard.boardObjects).plant.health).toBe(1);

    // hit other plants
    expect(BoardLogic.getCell(5, 8, playBoard.boardObjects).plant.health).toBe(1);
    expect(BoardLogic.getCell(6, 8, playBoard.boardObjects).plant).toBeFalsy();
    expect(BoardLogic.getCell(6, 9, playBoard.boardObjects).plant).toBeFalsy();
})

test('test bandit movement 1', () => {
    // if the bandit is at the same cell with a plant, it first tries to leave.
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
        }
    }

    BoardLogic.getCell(4, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 5, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(3, 4, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 4, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 4, 4);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 500);

    expect(BoardLogic.getCell(4, 3, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 5, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(3, 4, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).enemy).toBeFalsy();
    expect(BoardLogic.getCell(5, 4, playBoard.boardObjects).enemy.movableType).toBe(movableTypes.BANDIT);
})

test('test bandit movement 2', () => {
    // if no way out, the bandit dies of forest insects and animal attacks.
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
        }
    }

    BoardLogic.getCell(4, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 5, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(3, 4, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 4, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(5, 4, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 4, 4);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 500);

    expect(BoardLogic.getCell(4, 3, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 5, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(3, 4, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).plant.health).toBe(3);
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).enemy).toBeFalsy();
    expect(playBoard.movables.length).toBe(0);
})

test('test bandit movement 3', () => {
    // If adjacent to the target plant, attack instead of moving
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
        }
    }

    BoardLogic.getCell(4, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 0, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();
    BoardLogic.getCell(4, 6, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.PINE)();
    BoardLogic.getCell(3, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.ORCHID)();
    BoardLogic.getCell(2, 2, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.CORN)();
    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 4, 4);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 500);

    expect(BoardLogic.getCell(4, 3, playBoard.boardObjects).plant.health).toBe(2);
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).enemy).toBeTruthy();
})

test('test bandit movement 4', () => {
    // moving
    // reset terrain
    for (let i = 0; i < playBoard.gridSize; i++) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            BoardLogic.setCell(i, j, container.terrainFactory.get(terrainTypes.DESERT)(), playBoard.boardObjects);
        }
    }

    BoardLogic.getCell(4, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.PINE)();
    BoardLogic.getCell(4, 0, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.BAMBOO)();
    BoardLogic.getCell(4, 6, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.PINE)();
    BoardLogic.getCell(3, 3, playBoard.boardObjects).plant = container.plantFactory.get(plantTypes.ORCHID)();
    BoardLogic.getCell(2, 2, playBoard.boardObjects).seed = container.plantFactory.get(seedTypes.CORN)();
    container.movableFactory.get(movableTypes.BANDIT)(playBoard, 5, 4);

    let turn = playBoard.buttons.find(button => button.text.toLowerCase().includes("turn"));
    expect(turn).toBeTruthy();
    p.mouseX = turn.x + turn.width / 2;
    p.mouseY = turn.y + turn.height / 2;
    controller.clickListener(p);
    playBoard.movables.forEach(movable => expect(movable.hasMoved).toBeFalsy());
    tick(p, container, 500);

    expect(BoardLogic.getCell(5, 4, playBoard.boardObjects).enemy).toBeFalsy();
    expect(BoardLogic.getCell(4, 4, playBoard.boardObjects).enemy).toBeTruthy();
})