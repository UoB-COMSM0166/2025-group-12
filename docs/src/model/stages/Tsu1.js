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
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(1 / 20, 4 / 45);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 30;

        playBoard.fertilized = Array.from({length: playBoard.gridSize},
            () => Array.from({length: playBoard.gridSize}, () => false));
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PALM, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.FIRE_HERB, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.BAMBOO, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PLUM, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.KIKU, 10, playBoard.gameState.inventory);

        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PALM, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PINE, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.CORN, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.ORCHID, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.FIRE_HERB, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.BAMBOO, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PLUM, 10, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.KIKU, 10, playBoard.gameState.inventory);
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
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.STEPPE)(), playBoard.boardObjects);
                } else {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.SEA)(), playBoard.boardObjects);
                }
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(8, 15, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(7, 8, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(7, 9, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        if (playBoard.turn === 2) {
            this.movableFactory.get(this.movableTypes.TSUNAMI)(playBoard, 1, -1, 5);
        }
        if (playBoard.turn === 3) {
            this.movableFactory.get(this.movableTypes.TSUNAMI)(playBoard, 2, -1, 5);
        }
        if (playBoard.turn === 4) {
            this.movableFactory.get(this.movableTypes.TSUNAMI)(playBoard, 3, -1, 5);
        }
        if (playBoard.turn === 5) {
            this.movableFactory.get(this.movableTypes.TSUNAMI)(playBoard, 4, -1, 5);
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