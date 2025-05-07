/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Blizzard2PlayBoard {
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
        playBoard.stageNumbering = 2;
        // grid parameters
        playBoard.gridSize = 10;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(14 / 160, 14 / 90);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 15;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PLUM, 4, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 5, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 5, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 5, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.FIRE_HERB, 5, playBoard.gameState.inventory);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            for (let i = 0; i <= 1; i++) {
                if (i === 0) {
                    let hill = this.terrainFactory.get(this.terrainTypes.HILL)();
                    hill.setCanSlide(true);
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, hill, playBoard.boardObjects);
                } else {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.HILL)(), playBoard.boardObjects);
                }
            }
        }
        for (let i = 2; i <= 5; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.DESERT)(), playBoard.boardObjects);
            }
        }
        for (let i = 6; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.SNOWFIELD)(), playBoard.boardObjects);
                playBoard.snowfields.push([i, j]);
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(5, 7, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 2, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(5, 1, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 1, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 8, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 8, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(2, 4, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 5, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        switch (playBoard.turn) {
            case 2:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 0, 'r', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 1, 9, 'l', 1);
                break;
            case 3:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 2, 'u', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 7, 'u', 1);
                break;
            case 4:
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 2, 0);
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 7, 0);
                break;
            case 5:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 3);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 6);
                break;
            case 6:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 0, 'r', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 1, 9, 'l', 1);
                break;
            case 7:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 2, 'u', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 7, 'u', 1);
                break;
            case 8:
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 2, 0);
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 7, 0);
                break;
            case 9:
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 3);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 2, 6);
                break;
            case 10:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 0, 'r', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 1, 9, 'l', 1);
                break;
            case 12:
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 2, 0);
                this.movableFactory.get(this.movableTypes.BLIZZARD)(playBoard, 7, 7, 0);
                break;
        }

        if (playBoard.turn === 2 || playBoard.turn === 4 || playBoard.turn === 6 || playBoard.turn === 8 || playBoard.turn === 10) {
            this.movableFactory.get(this.movableTypes.EARTHQUAKE)(playBoard);
        }

        if (playBoard.turn === 3 || playBoard.turn === 5 || playBoard.turn === 7 || playBoard.turn === 9 || playBoard.turn === 11) {
            this.PlayBoardLogic.MovableLogic.generateSlide(p5, playBoard);
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

export {Blizzard2PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Blizzard2PlayBoard};
}