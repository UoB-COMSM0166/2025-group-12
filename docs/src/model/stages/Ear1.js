/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Earthquake1PlayBoard {
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
        playBoard.stageGroup = this.PlayBoardModel.stageGroup.EARTHQUAKE;
        playBoard.stageNumbering = 1;
        // grid parameters
        playBoard.gridSize = 8;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(3 / 32, 3 / 18);

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
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 2, playBoard.gameState.inventory);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let j = 0; j < playBoard.gridSize; j++) {
            for (let i = 0; i < playBoard.gridSize; i++) {
                if (i <= 1) {
                    if (i === 0) {
                        let hill = this.terrainFactory.get(this.terrainTypes.HILL)();
                        hill.setCanSlide(true);
                        this.PlayBoardLogic.BoardLogic.setCell(i, j, hill, playBoard.boardObjects);
                    } else {
                        this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.HILL)(), playBoard.boardObjects);
                    }
                } else {
                    this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.DESERT)(), playBoard.boardObjects);
                }
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(3, 3, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 3, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(3, 4, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 4, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
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
        if (code === "bamboo") {
            playBoard.floatingWindow = playBoard.allFloatingWindows.get("bamboo");
            playBoard.allFloatingWindows.delete("bamboo");
            this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.BAMBOO, 1, playBoard.gameState.inventory);
        }
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

        afw.set("bamboo", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:A bamboo is added to your inventory.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        playBoard.allFloatingWindows = afw;
    }
}

export {Earthquake1PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Earthquake1PlayBoard};
}