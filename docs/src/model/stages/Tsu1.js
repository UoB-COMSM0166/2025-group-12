/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Tsunami1PlayBoard {
    static PlayBoardLogic;
    static PlayBoardModel;

    /**
     *
     * @param {typeof PlayBoardModel} PlayBoardModelInjection
     * @param {typeof PlayBoardLogic} PlayBoardLogicInjection
     */
    static setup(PlayBoardModelInjection, PlayBoardLogicInjection) {
        this.PlayBoardModel = PlayBoardModelInjection;
        this.PlayBoardLogic = PlayBoardLogicInjection;

        this.plantFactory = this.PlayBoardLogic.plantFactory;
        this.plantTypes = this.PlayBoardLogic.plantTypes;
        this.seedTypes = this.PlayBoardLogic.seedTypes;
        this.movableFactory = this.PlayBoardLogic.movableFactory;
        this.movableTypes = this.PlayBoardLogic.movableTypes;
        this.terrainFactory = this.PlayBoardLogic.terrainFactory;
        this.terrainTypes = this.PlayBoardLogic.terrainTypes;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static concreteBoardInit(playBoard) {
        playBoard.stageGroup = this.PlayBoardModel.stageGroup.TSUNAMI;
        playBoard.stageNumbering = 1;
        // grid parameters
        playBoard.gridSize = 16;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 20;

        playBoard.fertilized = Array.from({length: playBoard.gridSize},
            () => Array.from({length: playBoard.gridSize}, () => false));
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PALM, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.FIRE_HERB, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.BAMBOO, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PLUM, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.KIKU, 3, playBoard.gameState.inventory);

        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PALM, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PINE, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.CORN, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.ORCHID, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.FIRE_HERB, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.BAMBOO, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PLUM, 20, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.KIKU, 20, playBoard.gameState.inventory);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                if (j >= 8) {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.DESERT)(), playBoard.boardObjects);
                } else {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.SEA)(), playBoard.boardObjects);
                }
            }
        }
        for (let j = 0; j < playBoard.gridSize; j++) {
            for (let i = 0; i <= 1; i++) {
                if (this.PlayBoardLogic.BoardLogic.getCell(i, j, playBoard.boardObjects).terrain.terrainType === this.terrainTypes.SEA) continue;
                if (i === 0) {
                    let hill = this.terrainFactory.get(this.terrainTypes.HILL)();
                    hill.setCanSlide(true);
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, hill, playBoard.boardObjects);
                } else {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.HILL)(), playBoard.boardObjects);
                }
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(0, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(0, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(0, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(7, 11, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(7, 12, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);

        for (let i = 8; i < playBoard.gridSize; i++) {
            for (let j = 8; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.SNOWFIELD)(), playBoard.boardObjects);
                playBoard.snowfields.push([i, j]);
            }
        }

        this.PlayBoardLogic.BoardLogic.setCell(13, 14, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
        playBoard.snowfields = playBoard.snowfields.filter(index => !(index[0] === 13 && index[1] === 14));
        this.PlayBoardLogic.BoardLogic.setCell(3, 14, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);

    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        this.PlayBoardLogic.generateRandomVolBomb(p5, playBoard);
        this.PlayBoardLogic.generateRandomVolBomb(p5, playBoard);
        this.PlayBoardLogic.generateRandomVolBomb(p5, playBoard);
        this.PlayBoardLogic.generateRandomVolBomb(p5, playBoard);
        if (playBoard.turn % 2 === 0) {
            this.movableFactory.get(this.movableTypes.EARTHQUAKE)(playBoard);
            this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 12, 14);
            this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 4, 14);
        }

        if (playBoard.turn % 2 === 1) {
            this.movableFactory.get(this.movableTypes.TSUNAMI)(playBoard, 3 + Math.floor(Math.random() * 4), -1, 5);
            this.PlayBoardLogic.MovableLogic.generateSlide(p5, playBoard, 7);
        }
        let arr = [8, 9, 10, 11, 12, 13, 14, 15];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        let p1 = arr[0];
        let p2 = arr[1];
        if (playBoard.turn === 3 || playBoard.turn === 6 || playBoard.turn === 9 || playBoard.turn === 12 || playBoard.turn === 15 || playBoard.turn === 18) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 15, p1, 'u', 1);
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 15, p2, 'u', 1);
        }
        if (playBoard.turn === 4 || playBoard.turn === 7 || playBoard.turn === 10 || playBoard.turn === 13 || playBoard.turn === 16 || playBoard.turn === 19) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, p1, 'd', 1);
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, p2, 'd', 1);
        }

        // spread bamboo after generating slide
        for (let cwp of this.PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects)) {
            if (cwp.plant.plantType === this.plantTypes.BAMBOO) {
                this.PlayBoardLogic.PlantLogic.spreadBamboo(p5, playBoard, cwp);
            }
        }
    }

    /**
     *
     * @param p5
     * @param code
     * @param {PlayBoardLike} playBoard
     */
    static modifyBoard(p5, playBoard, code) {
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setFloatingWindow(p5, playBoard) {
        if (playBoard.turn === playBoard.maxTurn + 1) {
            if (playBoard.allFloatingWindows.has("000")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("000");
                playBoard.allFloatingWindows.delete("000");
                return;
            }
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static initAllFloatingWindows(p5, playBoard) {
        let afw = new Map();

        this.PlayBoardLogic.utilityClass.commonFloatingWindows(p5, afw);

        playBoard.allFloatingWindows = afw;
    }
}

export {Tsunami1PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Tsunami1PlayBoard};
}