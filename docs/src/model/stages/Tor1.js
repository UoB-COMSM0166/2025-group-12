/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Tornado1PlayBoard {
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
        playBoard.stageNumbering = 1;
        // grid parameters
        playBoard.gridSize = 6;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 4;
        playBoard.hasActionPoints = false;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
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
        this.PlayBoardLogic.BoardLogic.setCell(4, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 4, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        let movableFactory = this.PlayBoardLogic.movableFactory;
        let movableTypes = this.PlayBoardLogic.movableTypes;
        if (playBoard.turn === 2) {
            movableFactory.get(movableTypes.TORNADO)(playBoard, 0, 4, 'd');
        }
    }

    /**
     *
     * @param p5
     * @param code
     * @param {PlayBoardLike} playBoard
     */
    static modifyBoard(p5, playBoard, code) {

        if (code === 102) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 4, 'd');
            return;
        }
        if (code === 103) {
            this.PlayBoardLogic.BoardLogic.plantCell(p5, playBoard, 2, 4, this.plantFactory.get(this.plantTypes.CORN)());
            this.PlayBoardLogic.BoardLogic.plantCell(p5, playBoard, 3, 4, this.plantFactory.get(this.plantTypes.ORCHID)());
            return;
        }
        if (code === 201) {
            this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.PINE, 1, playBoard.gameState.inventory);
        }
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
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("101") && playBoard.allFloatingWindows.has("102")) {
                this.modifyBoard(p5, playBoard, 102);
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("102");
                playBoard.allFloatingWindows.delete("102");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("102") && playBoard.allFloatingWindows.has("103")) {
                this.modifyBoard(p5, playBoard, 103);
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("103");
                playBoard.allFloatingWindows.delete("103");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("103") && playBoard.allFloatingWindows.has("104")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("104");
                playBoard.allFloatingWindows.delete("104");
                return;
            }

        }
        if (playBoard.turn === 2) {
            if (playBoard.allFloatingWindows.has("200")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("200");
                playBoard.allFloatingWindows.delete("200");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("200") && playBoard.allFloatingWindows.has("201")) {
                this.modifyBoard(p5, playBoard, 201);
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("201");
                playBoard.allFloatingWindows.delete("201");
                return;
            }
            if (playBoard.floatingWindow === null && playBoard.gameState.inventory.selectedItem !== null && !playBoard.allFloatingWindows.has("201") && playBoard.allFloatingWindows.has("202")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("202");
                playBoard.allFloatingWindows.delete("202");
                return;
            }
        }
        if (playBoard.turn === 3) {
            if (playBoard.allFloatingWindows.has("300")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("300");
                playBoard.allFloatingWindows.delete("300");
                return;
            }
            if (playBoard.floatingWindow === null && playBoard.selectedCell.length !== 0 && !playBoard.allFloatingWindows.has("300") && playBoard.allFloatingWindows.has("301")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("301");
                playBoard.allFloatingWindows.delete("301");
                return;
            }
        }
        if (playBoard.turn === 4) {
            if (playBoard.allFloatingWindows.has("400")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("400");
                playBoard.allFloatingWindows.delete("400");
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

        afw.set("100", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white: Welcome to the game.}\\ {white: Your goal is to protect your house by growing plants.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new this.PlayBoardLogic.FloatingWindow(p5, "uc", "{white:There is your house. It will be destroyed by}\\ {white:natural disasters if you do nothing.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 2 / 3 + 0.01)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 2 / 3 + 0.01)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("102", new this.PlayBoardLogic.FloatingWindow(p5, "ld", "{white:A tornado!}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.67, 0.45)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.67, 0.45)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("103", new this.PlayBoardLogic.FloatingWindow(p5, "lu", "{white:We have prepared some plants}\\{white:to block its way.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.69, 0.52)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.69, 0.52)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("104", new this.PlayBoardLogic.FloatingWindow(p5, "uc", "{white:click the turn button and}\\{white:let's see what happens next.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.5, 0.16)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.5, 0.16)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("200", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Your plants sacrificed their}\\{white:life to protect your house.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("201", new this.PlayBoardLogic.FloatingWindow(p5, "ru", "{white:You've been rewarded a}{red:Pine}\\{white:since you made through last assault.}\\{white:Now click the}{red:Pine}{white:.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.76, 0.11)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.76, 0.11)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("202", new this.PlayBoardLogic.FloatingWindow(p5, "lu", "{white:Click this cell to transplant it.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.64, 0.56)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.64, 0.56)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("300", new this.PlayBoardLogic.FloatingWindow(p5, "lu", "{white:You can click a cell to check relevant}\\{white:information from left bottom box.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.69, 0.58)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.69, 0.58)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("400", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:All plants on the field alive at the end of}\\{white:each stage will be added to your inventory}\\{white:and you can transplant them in later stages.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 1 / 4)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        playBoard.allFloatingWindows = afw;
    }
}

export {Tornado1PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Tornado1PlayBoard};
}