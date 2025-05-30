/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class Volcano1PlayBoard {
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
        playBoard.stageGroup = this.PlayBoardModel.stageGroup.VOLCANO;
        playBoard.stageNumbering = 1;
        // grid parameters
        playBoard.gridSize = 10;
        [playBoard.cellWidth, playBoard.cellHeight] = this.PlayBoardModel.utilityClass.relative2absolute(14 / 160, 14 / 90);

        // board objects array
        playBoard.boardObjects = new this.PlayBoardModel.BoardModel(playBoard.gridSize);

        // turn counter
        playBoard.turn = 1;
        playBoard.maxTurn = 12;
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
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.PINE, 4, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.CORN, 2, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.ORCHID, 4, playBoard.gameState.inventory);
        this.PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, this.seedTypes.FIRE_HERB, 1, playBoard.gameState.inventory);
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
        this.PlayBoardLogic.BoardLogic.setCell(8, 8, this.terrainFactory.get(this.terrainTypes.BASE)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(4, 4, this.terrainFactory.get(this.terrainTypes.LUMBERING)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 7, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(5, 8, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(7, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(8, 5, this.terrainFactory.get(this.terrainTypes.MOUNTAIN)(), playBoard.boardObjects);

        this.PlayBoardLogic.BoardLogic.setCell(0, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(0, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(1, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 1, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(2, 0, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
        this.PlayBoardLogic.BoardLogic.setCell(0, 2, this.terrainFactory.get(this.terrainTypes.VOLCANO)(), playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
        this.PlayBoardLogic.generateVolBomb(p5, 8, 8, playBoard);

        switch (playBoard.turn) {
            case 2:
                this.generateLava(p5, 3, 3, playBoard);
                this.generateLava(p5, 3, 2, playBoard);
                this.generateLava(p5, 3, 1, playBoard);
                this.generateLava(p5, 3, 0, playBoard);
                this.generateLava(p5, 2, 3, playBoard);
                this.generateLava(p5, 1, 3, playBoard);
                this.generateLava(p5, 0, 3, playBoard);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 5, 4);
                this.movableFactory.get(this.movableTypes.BANDIT)(playBoard, 4, 5);
                break;
            case 4:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 9, 'd', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 0, 'r', 1);
                break;
            case 7:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 6, 'd', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 6, 0, 'r', 1);
                break;
            case 9:
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 9, 'd', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 9, 0, 'r', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 0, 6, 'd', 1);
                this.movableFactory.get(this.movableTypes.TORNADO)(playBoard, 6, 0, 'r', 1);
                break;
        }
        if(playBoard.turn !== 2) this.expandLava(p5, playBoard);
    }

    /**
     *
     * @param p5
     * @param i
     * @param j
     * @param {PlayBoardLike} playBoard
     */
    static generateLava(p5, i, j, playBoard) {
        let cell = this.PlayBoardLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
        let lava = this.terrainFactory.get(this.terrainTypes.LAVA)();
        lava.cellX = cell.i;
        lava.cellY = cell.j;
        cell.terrain = lava;

        // kill plant and store its seed
        if (cell.plant !== null) {
            this.PlayBoardLogic.TerrainLogic.storeSeed(p5, cell.plant, lava);
            cell.removePlant();
        } else if (cell.seed !== null) {
            this.PlayBoardLogic.TerrainLogic.storeSeed(p5, cell.seed, lava);
            cell.removeSeed();
        }

        // kill bandit on this cell
        if (cell.enemy !== null && cell.enemy.movableType === this.movableTypes.BANDIT) {
            cell.enemy.status = false;
            this.PlayBoardLogic.InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static expandLava(p5, playBoard) {
        // find all lava
        let cells = [];
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                let cell = this.PlayBoardLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
                if (cell.terrain.terrainType === this.terrainTypes.LAVA && cell.terrain.name === "Lava") {
                    cells.push(cell);
                }
            }
        }

        // expand them
        for (let cell of cells) {
            for (let adCell of this.PlayBoardLogic.BoardLogic.getAdjacent4Cells(cell.i, cell.j, playBoard.boardObjects)) {
                // if the cell is in ecosystem with 'rejectLava', skip.
                if (adCell.ecosystem !== null && adCell.ecosystem.rejectLava) continue;
                // if expands to player base, game over.
                if (adCell.terrain.terrainType === this.terrainTypes.BASE) {
                    this.PlayBoardLogic.utilityClass.gameOver(playBoard);
                    return;
                }
                // it expands to normal terrain.
                if (adCell.terrain.terrainType === this.terrainTypes.DESERT) {
                    this.generateLava(p5, adCell.i, adCell.j, playBoard);
                }
            }
        }

        // solidify lava
        for (let cell of cells) {
            this.PlayBoardLogic.TerrainLogic.solidify(p5, playBoard, cell.terrain);
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

        afw.set("100", new this.PlayBoardLogic.FloatingWindow(p5, "rc", "{white:You have more than 6 kind of items in your inventory. Scroll}\\{red:mouse wheel}{white: when your mouse is hovering over the inventory.}", {
            x: this.PlayBoardLogic.utilityClass.relative2absolute(0.6, 0.15)[0],
            y: this.PlayBoardLogic.utilityClass.relative2absolute(0.6, 0.15)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        playBoard.allFloatingWindows = afw;
    }
}

export {Volcano1PlayBoard};

if (typeof module !== 'undefined') {
    module.exports = {Volcano1PlayBoard};
}