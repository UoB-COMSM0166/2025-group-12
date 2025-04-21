import {createMockP5, simulateKeyDown, simulateKeyPress, simulateKeyUp} from "./Persona5.js";
import {tick} from "./Tick.js";
import {Container} from "../../src/controller/Container.js";
// --------------------------------------
import {stageGroup, stateCode} from "../../src/model/GameState.js";
import {PlayBoardLogic, PlayBoardModel} from "../../src/model/PlayBoard.js";
import {InventoryLogic} from "../../src/model/Inventory.js";
import {plantTypes, movableTypes, seedTypes, terrainTypes} from "../../src/items/ItemTypes.js";
import {BoardLogic, BoardModel} from "../../src/model/BoardCells.js";

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

beforeEach(()=>{
    container = new Container(p);
    controller = container.controller;
    container.gameState.state = stateCode.PLAY;
    container.gameState.currentStageGroup = stageGroup.TSUNAMI;

    let stagePackage ={
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
        nextTurnItems: (p5, playBoard) =>{},
        modifyBoard: (p5, playBoard, code) => {},
        setFloatingWindow: (p5, playBoard) =>{},
        initAllFloatingWindows: (p5, playBoard)=>{
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
})

test('test', () => {

})