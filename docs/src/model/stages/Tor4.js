/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Tornado4PlayBoard {
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
        playBoard.stageGroup = this.PlayBoardModel.stageGroup.TORNADO;
        playBoard.stageNumbering = 4;
        // grid parameters
        playBoard.gridSize = 8;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(3 / 32, 3 / 18);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 10;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PINE, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.CORN, 3, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.ORCHID, 3, playBoard.gameState.inventory);
    }


    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.DESERT)(), playBoard.boardObjects);
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(4, 4, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(4, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(1, 1, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(7, 7, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
    }


    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        switch (playBoard.turn) {
            case 2:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 1, 2);
                break;
            case 4:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 1, 2);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 4, 'd', 1);
                break;
            case 5:
                break;
            case 6:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 6, 7);
                break;
            case 7:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 7, 6);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 7, 7);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 7, 4, 'u', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 2, 4, 'd', 1);
                break;
            case 8:
                break;
            case 9:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 4, 2, 'r', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 7, 4, 'u', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 2, 4, 'd', 1);
                break;
            case 10:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 2);
                break;
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

        this.allFloatingWindows = afw;
    }
}

export {Tornado4PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Tornado4PlayBoard};
}