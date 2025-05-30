/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Blizzard1PlayBoard {
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
        playBoard.stageGroup = this.PlayBoardModel.stageGroup.BLIZZARD;
        playBoard.stageNumbering = 1;
        // grid parameters
        playBoard.gridSize = 6;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(14 / 160, 14 / 90);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 6;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PLUM, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.FIRE_HERB, 2, playBoard.gameState.inventory);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.SNOWFIELD)(), playBoard.boardObjects);
                playBoard.snowfields.push([i, j]);
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(4, 4, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        playBoard.snowfields = playBoard.snowfields.filter(index => !(index[0] === 4 && index[1] === 4)); // remember to exclude cells with terrain
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        switch (playBoard.turn) {
            case 2:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 4, 0, 'r');
                break;
            case 3:
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 4, 3, 0);
                break;
            case 4:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 4, 'd');
                break;
            case 5:
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 3, 4, 0);
                break;
            case 6:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 4, 0, 'r');
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 4, 'd');
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

        playBoard.allFloatingWindows = afw;
    }
}

export {Blizzard1PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Blizzard1PlayBoard};
}