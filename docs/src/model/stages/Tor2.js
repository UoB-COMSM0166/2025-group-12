/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Tornado2PlayBoard {
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
        playBoard.stageNumbering = 2;
        // grid parameters
        playBoard.gridSize = 6;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 5;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageInventory(p5, playBoard) {
        this.PlayBoardLogic.InventoryLogic.setItemOfInventory(p5, this.plantTypes.PINE, 1, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.CORN, 1, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.plantTypes.ORCHID, 1, playBoard.gameState.inventory);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                this.PlayBoardLogic.BoardLogic.setCell(i, j, this.terrainFactory.get(this.terrainTypes.STEPPE)(), playBoard.boardObjects);
            }
        }
        this.PlayBoardLogic.BoardLogic.setCell(4, 4, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 3, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 4, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(0, 4, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
    }

    /**
     *
     * @param p5
     * @param code
     * @param {PlayBoardLike} playBoard
     */
    static modifyBoard(p5, playBoard, code) {
        if (code === 103) {
            this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 1, 4, 'd');
            return;
        }
        if (code === 203) {
            this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PINE, 1, playBoard.gameState.inventory);
            this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.CORN, 1, playBoard.gameState.inventory);
            this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.ORCHID, 1, playBoard.gameState.inventory);
            return;
        }
        if (code === 204) {
            this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 1, 4);
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
                let cell;
                for (let cwp of this.PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects)) {
                    if (cwp.plant.plantType === this.plantTypes.PINE) {
                        cell = cwp;
                        break;
                    }
                }
                if (!cell.plant.hasActive) return;
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("200");
                playBoard.allFloatingWindows.delete("200");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("200") && playBoard.allFloatingWindows.has("201")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("201");
                playBoard.allFloatingWindows.delete("201");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("201") && playBoard.allFloatingWindows.has("202")) {
                let cell;
                for (let cwp of this.PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects)) {
                    if (cwp.plant.plantType === this.plantTypes.PINE) {
                        cell = cwp;
                        break;
                    }
                }
                if (!cell.plant.hasActive || cell.plant.useLeft === cell.plant.maxUse) return;
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("202");
                playBoard.allFloatingWindows.delete("202");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("202") && playBoard.allFloatingWindows.has("203")) {
                this.modifyBoard(p5, playBoard, 203);
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("203");
                playBoard.allFloatingWindows.delete("203");
                return;
            }
            if (playBoard.floatingWindow === null && !playBoard.allFloatingWindows.has("203") && playBoard.allFloatingWindows.has("204")) {
                this.modifyBoard(p5, playBoard, 204);
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("204");
                playBoard.allFloatingWindows.delete("204");
                return;
            }
        }
        if (playBoard.turn === 3) {
            if (playBoard.allFloatingWindows.has("300")) {
                playBoard.floatingWindow = playBoard.allFloatingWindows.get("300");
                playBoard.allFloatingWindows.delete("300");
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

        afw.set("100", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Hello again. In this stage we}\\ {white:explore more features of our game.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("101", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Remember: You may quit current game to start anytime.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("102", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:We have provided you with some new plants.}\\ {white:Plant them adjacent to make them stronger.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("103", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Try transplant a pine first, then}\\ {white:a corn and an orchid next to the tree.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("104", new this.PlayBoardLogic.FloatingWindow(p5, "ur", "{white:This is your action points. It means you can}\\ {white:transplant or sow up to 3 times every turn.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.85, 0.45)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.85, 0.45)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("200", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Your plants are damaged. Click your pine.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("201", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:There is an activate button at bottom left box.}\\{white:Click it or press E, and then click your damaged plant.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("202", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:If you have transplanted your plants as expected, }\\ {white:they will form an ecosystem.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: false
        }));

        afw.set("203", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Seeds sowed in the ecosystem grow faster.}\\ {white:Try to sow in and out the ecosystem.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("204", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Now you have knowledge on the main features of our game.}\\ {white:Try to deal with that bandit who wants to chop your plants!}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(1 / 2, 0.15)[1],
            fontSize: 16,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 0.1,
            playerCanClick: true
        }));

        afw.set("300", new this.PlayBoardLogic.FloatingWindow(p5, null, "{white:Only when different kind of plants are next to each other}\\ {white:then they get stronger! Try to figure out when will the skills emerge.}", {
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

export {Tornado2PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Tornado2PlayBoard};
}