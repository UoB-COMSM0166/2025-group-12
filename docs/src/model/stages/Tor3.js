/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Tornado3PlayBoard {
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
        playBoard.stageNumbering = 3;
        // grid parameters
        playBoard.gridSize = 6;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9);

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
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.plantTypes.PINE, 1, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.plantTypes.CORN, 1, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.plantTypes.ORCHID, 1, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.seedTypes.PINE, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.seedTypes.CORN, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.seedTypes.ORCHID, 1, playBoard.gameState.inventory);
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

        this.PlayBoardLogic.BoardLogic.setCell(2, 2, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(3, 2, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(3, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 4, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(1, 1, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        if (playBoard.turn === 2) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 4, 'd', 1);
            this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 1, 2);
        }
        if (playBoard.turn === 3) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 5, 'd', 1);
        }
        if (playBoard.turn === 4) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 4, 0, 'r', 1);
        }
        if (playBoard.turn === 5) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 5, 'd', 1);
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
        if (playBoard.turn === 1) {
            if (playBoard.allFloatingWindows.has("100")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("100");
                playBoard.allFloatingWindows.delete("100");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("100") && playBoard.allFloatingWindows.has("101")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("101");
                playBoard.allFloatingWindows.delete("101");
                return;
            }
        }
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

        afw.set("100", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:The game begins here. Try to save as much resource}\\{white:as you could, to make it through later stages!}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new this.PlayBoardLogic.FloatingWindow(p5, null, "{red:Multiple tornadoes alert:}\\{white:top left area...}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        playBoard.allFloatingWindows = afw;
    }
}

export {Tornado3PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Tornado3PlayBoard};
}