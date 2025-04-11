
export class Tornado4PlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.TORNADO;
        this.stageNumbering = "1-4";
        // grid parameters
        this.gridSize =8;
        [this.cellWidth, this.cellHeight] = myUtil.relative2absolute(1 / 16, 1 / 9);

        // board objects array
        this.boardObjects = new BoardCells(this.gridSize);

        // turn counter
        this.turn = 1;
        this.maxTurn = 10;
    }

    // set stage inventory at entering, called by controller
    setStageInventory(p5) {
        this.gameState.inventory.pushItem2Inventory(p5, "Tree", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Bush", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "Orchid", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 3);
        this.gameState.inventory.pushItem2Inventory(p5, "OrchidSeed", 3);
    }

    // set stage terrain, called when the stage is loaded or reset
    setStageTerrain(p5) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.boardObjects.setCell(i, j, new Steppe(p5));
            }
        }
        this.boardObjects.setCell(4, 4, new PlayerBase(p5));
        this.boardObjects.setCell(4, 5, new Mountain(p5));
        this.boardObjects.setCell(5, 5, new Mountain(p5));
        this.boardObjects.setCell(1, 1, new Lumbering(p5));
        this.boardObjects.setCell(7, 7, new Lumbering(p5));
    }

    nextTurnItems(p5) {
        switch (this.turn) {
            case 2:
                Bandit.createNewBandit(p5, this, 1, 2);
                break;
            case 4:
                Bandit.createNewBandit(p5, this, 1, 2);
                Bandit.createNewBandit(p5, this, 2, 1);
                Tornado.createNewTornado(p5, this, 0, 4, "d", 1);
                break;
            case 5:
                break;
            case 6:
                Bandit.createNewBandit(p5, this, 6, 7);
                break;
            case 7:
                Bandit.createNewBandit(p5, this, 7, 6);
                Bandit.createNewBandit(p5, this, 7, 7);
                Tornado.createNewTornado(p5, this, 7, 4, "u", 1);
                Tornado.createNewTornado(p5, this, 2, 4, "d", 1);
                break;
            case 8:
                break;
            case 9:
                Tornado.createNewTornado(p5, this, 4, 2, "r", 1);
                Tornado.createNewTornado(p5, this, 7, 4, "u", 1);
                Tornado.createNewTornado(p5, this, 2, 4, "d", 1);
                break;
            case 10:
                Bandit.createNewBandit(p5, this, 2, 2);
                break;
        }
    }

    modifyBoard(p5, code) {

    }

    setFloatingWindow(p5) {
        if (this.turn === this.maxTurn + 1) {
            if (this.allFloatingWindows.has("000")) {
                this.floatingWindow = this.allFloatingWindows.get("000");
                this.allFloatingWindows.delete("000");
                return;
            }
        }
    }

    initAllFloatingWindows(p5) {
        let afw = new Map();

        myUtil.commonFloatingWindows(p5, afw);

        this.allFloatingWindows = afw;
    }
}