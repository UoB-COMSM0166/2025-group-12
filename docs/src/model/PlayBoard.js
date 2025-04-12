/**
 * @typedef {Object} PlayBoardLike
 * @property {GameState} gameState
 * @property {Array} buttons
 * @property {FloatingWindow} floatingWindow
 * @property {Map} allFloatingWindows
 * @property {number} stageGroup
 * @property {string} stageNumbering
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 * @property {number} Sx
 * @property {number} Sy
 * @property {number} rot
 * @property {number} span
 * @property {number} Hy
 * @property {number} gridSize
 * @property {number} cellWidth
 * @property {number} cellHeight
 * @property {Array} movables
 * @property {BoardModel} boardObjects
 * @property {Array} selectedCell
 * @property {InfoBoxModel} infoBox
 * @property {Map} tmpInventoryItems
 * @property {number} turn
 * @property {number} maxTurn
 * @property {boolean} endTurn
 * @property {number} actionPoints
 * @property {number} maxActionPoints
 * @property {boolean} hasActionPoints
 * @property {boolean} awaitCell
 * @property {boolean} ecoDisplay
 * @property {boolean} isGameOver
 * @property {boolean} skip
 * @property {{img: p5.Image}} shadowPlant
 * @property {Array} undoStack
 * @property {Array} snowfields
 * @property {Array} fertilized
 * @property {Function} setupActionListeners
 * @property {Function} setStageTerrain
 * @property {Function} initAllFloatingWindows
 * @property {Function} getTurnButtonText
 */

// -----------------------------------
/* Remember to maintain above JSDoc. */
// -----------------------------------

/**
 * @implements ScreenLike
 */
export class PlayBoardModel {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        PlayBoardModel.utilityClass = bundle.utilityClass;
        PlayBoardModel.stateCode = bundle.stateCode;
        PlayBoardModel.stageGroup = bundle.stageGroup;
        /** @type {typeof Button} */
        PlayBoardModel.Button  =bundle.Button;
        /** @type {typeof InfoBoxModel} */
        PlayBoardModel.InfoBoxModel = bundle.InfoBoxModel;
        /** @type {typeof BoardModel} */
        PlayBoardModel.BoardModel = bundle.BoardModel;
    }

    /**
     *
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        /** @type {FloatingWindow} */
        this.floatingWindow = null;
        /** @type {Map} */
        this.allFloatingWindows = null;

        this.stageGroup = PlayBoardModel.stageGroup.NO_STAGE;
        this.stageNumbering = "0-0";
        this.canvasWidth = PlayBoardModel.utilityClass.relative2absolute(1, 1)[0];
        this.canvasHeight = PlayBoardModel.utilityClass.relative2absolute(1, 1)[1];

        // transformation parameters
        this.Sx = 0.5;
        this.Sy = 0.5;
        this.rot = Math.PI / 6;
        this.span = 2 * Math.PI / 3;
        this.Hy = 1;

        // grid parameters
        this.gridSize = 8;
        this.cellWidth = PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9)[0];
        this.cellHeight = PlayBoardModel.utilityClass.relative2absolute(1 / 16, 1 / 9)[1];

        // store all movable objects including enemies
        // objects in this array MUST have boolean fields hasMoved and isMoving!!!!!
        this.movables = [];

        this.selectedCell = [];
        /*
         * the second 'this' within parenthesis does not refer to concrete board classes...
         * initialize them later after Object.assign in subclasses.
         */
        this.boardObjects = null; // new PlayBoardModel.BoardModel(this.gridSize);
        this.infoBox = null; // new PlayBoardModel.InfoBoxModel(this);

        // to store the items at the start of each stage,
        // so when you quit we can reset inventory
        this.tmpInventoryItems = new Map();

        // turn counter
        this.turn = 1;
        this.maxTurn = 10;
        this.endTurn = false;
        // can place this number of plants every turn
        this.actionPoints = 3;
        this.maxActionPoints = 3;
        this.hasActionPoints = true;

        // to implement plant active skills.
        // I have a strong feeling that we need refactoring
        this.awaitCell = false;

        this.ecoDisplay = true;

        this.isGameOver = false;

        this.skip = false;

        // set cursor style when dragging item
        this.shadowPlant = null;

        // save last state
        this.undoStack = [];
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static initPlayBoard(p5, playBoard) {
        // action listeners
        playBoard.setupActionListeners(p5);

        // setup stage terrain
        playBoard.setStageTerrain(p5);

        // initialized all fw
        playBoard.initAllFloatingWindows(p5);
    }

    // boilerplate function, concrete boards must import this
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setupActionListeners(p5, playBoard) {
        // escape button
        let [escX, escY] = PlayBoardModel.utilityClass.relative2absolute(0.01, 0.01);
        let [escWidth, escHeight] = PlayBoardModel.utilityClass.relative2absolute(0.09, 0.07);
        let escapeButton = new PlayBoardModel.Button(escX, escY, escWidth, escHeight, "Escape");
        escapeButton.onClick = () => {
            playBoard.gameState.setState(PlayBoardModel.stateCode.STANDBY);
        };

        // undo
        let [undoX, undoY] = PlayBoardModel.utilityClass.relative2absolute(0.1, 0.01);
        let [undoWidth, undoHeight] = PlayBoardModel.utilityClass.relative2absolute(0.09, 0.07);
        let undoButton = new PlayBoardModel.Button(undoX, undoY, undoWidth, undoHeight, "Undo");
        undoButton.onClick = () => {
            PlayBoardSerializer.undo(p5, playBoard);
        }

        // turn button
        let [turnWidth, turnHeight] = PlayBoardModel.utilityClass.relative2absolute(5 / 32, 0.07);
        let [turnX, turnY] = PlayBoardModel.utilityClass.relative2absolute(0.5, 0.01);
        let turnButton = new PlayBoardModel.Button(turnX - turnWidth / 2, turnY, turnWidth, turnHeight, playBoard.getTurnButtonText());
        turnButton.onClick = () => {
            playBoard.movables.sort((a, b) => {
                if (a.movableType !== undefined && b.movableType !== undefined) {
                    return a.movableType - b.movableType;
                }
                if (a.movableType !== undefined) return -1;
                if (b.movableType !== undefined) return 1;
                return 0;
            });
            // set movable status
            for (let movable of playBoard.movables) {
                movable.hasMoved = false;
            }
            // when game is not cleared, remember to deal with end turn stuff
            if (playBoard.turn < playBoard.maxTurn + 1) {
                this.endTurn = true;
            }
            // once player unable to click, controller will loop movables to check if there are anything has not moved
            playBoard.gameState.setPlayerCanClick(false);
        }

        playBoard.buttons.push(escapeButton, turnButton, undoButton);
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static getTurnButtonText(playBoard) {
        return `turn ${playBoard.turn} in ${playBoard.maxTurn}`;
    }

    static assertImplementation(assertion, impl) {
        assertion({
            name: 'ScreenRenderer',
            impl,
            methods: ['setup', 'draw','drawFloatingWindow']
        });
    }
}

export class PlayBoardRenderer {
    static setup(bundle){
        /** @type {typeof ScreenRenderer} */
        PlayBoardRenderer.ScreenRenderer = bundle.ScreenRenderer;
        /** @type {typeof BoardRenderer} */
        PlayBoardRenderer.BoardRenderer = bundle.BoardRenderer;
        /** @type {typeof InfoBoxRenderer} */
        PlayBoardRenderer.InfoBoxRenderer = bundle.InfoBoxRenderer;
        /** @type {typeof InventoryRenderer} */
        PlayBoardRenderer.InventoryRenderer = bundle.InventoryRenderer;

        /** @type {typeof myUtil} */
        PlayBoardRenderer.utilityClass = bundle.utilityClass;

        /** @type {typeof InteractionLogic} */
        PlayBoardRenderer.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawGrid(p5, playBoard) {
        p5.stroke(0);
        p5.strokeWeight(2);

        PlayBoardRenderer.BoardRenderer.draw(p5, playBoard);

        // if skill is activated and awaiting target, set highlight on
        if (playBoard.awaitCell) {
            for (let i = 0; i < playBoard.gridSize; i++) {
                for (let j = 0; j < playBoard.gridSize; j++) {
                    if (PlayBoardRenderer.InteractionLogic.activeRange1(i, j, playBoard.selectedCell[0], playBoard.selectedCell[1])) {
                        let [x1, y1, x2, y2, x3, y3, x4, y4] = PlayBoardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CORNERS);
                        p5.stroke('rgb(150,150,0)');
                        p5.strokeWeight(2);
                        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                    }
                }
            }
        }

        // highlight the cell mouse hovering on
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                let [x1, y1, x2, y2, x3, y3, x4, y4] = PlayBoardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CORNERS);
                if (PlayBoardRenderer.utilityClass.isCursorInQuad(p5.mouseX, p5.mouseY, x1, y1, x2, y2, x3, y3, x4, y4)) {
                    p5.stroke('rgb(255,255,0)');
                    p5.strokeWeight(2);
                    p5.noFill();
                    p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                }
            }
        }
        p5.strokeWeight(0);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setCursorStyle(p5, playBoard){
        // set cursor style
        if (playBoard.gameState.inventory.selectedItem !== null) {
            p5.cursor('grab');
        } else if (playBoard.awaitCell) {
            p5.cursor('pointer');
        } else {
            p5.cursor(p5.ARROW);
        }

        // draw shadow plant
        if (playBoard.shadowPlant !== null) {
            let imgSize = PlayBoardRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
            p5.push();
            p5.tint(255, 180);
            p5.image(playBoard.shadowPlant.img, p5.mouseX - imgSize / 2, p5.mouseY - 3 * imgSize / 4, imgSize, imgSize);
            p5.pop();
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static draw(p5, playBoard) {
        p5.background(180);

        // stage number text
        let [stageNumberingX, stageNumberingY] = PlayBoardRenderer.utilityClass.relative2absolute(0.38, 0.04);
        p5.textSize(20);
        p5.fill('red');
        p5.noStroke();
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(playBoard.stageNumbering, stageNumberingX, stageNumberingY);

        // draw stage grid
        PlayBoardRenderer.drawGrid(p5, playBoard);

        // left bottom corner info box
        if (playBoard.selectedCell.length !== 0) {
            PlayBoardRenderer.InfoBoxRenderer.draw(p5, playBoard.infoBox);
        }

        // tornado arrows first
        for (let movable of playBoard.movables) {
            if (!movable.isMoving && movable.type === itemTypes.ENEMY && movable.movableType === movableTypes.TORNADO) {
                movable.drawDirection(p5);
            }
        }
        // draw all movables according to this.movables
        for (let movable of this.movables) {
            movable.draw(p5);
        }
        // health bar last
        for (let movable of this.movables) {
            if (movable.health !== undefined) {
                myUtil.drawHealthBar(p5, movable, movable.x - 20, movable.y - 50, 40, 5);
            }
        }


        // draw inventory
        PlayBoardRenderer.InventoryRenderer.draw(p5, playBoard.gameState.inventory);

        // draw action points
        myUtil.drawActionPoints(p5, this);

        // all buttons
        // to cascade activate button above info box, place this loop after info box
        for (let button of this.buttons) {
            if (!(this.turn === this.maxTurn + 1 && button.text.startsWith("turn"))) {
                button.draw(p5);
            }
        }

        // if game over, set player can click to stop movables updating
        if (this.isGameOver && !this.gameState.playerCanClick) {
            this.gameState.setPlayerCanClick(true);
        }

        this.drawFloatingWindow(p5);

        PlayBoardRenderer.setCursorStyle(p5, playBoard);
    }


}

export class PlayBoardLogic{
    static setup(bundle){
        /** @type {typeof ScreenLogic} */
        PlayBoardLogic.ScreenLogic = bundle.ScreenLogic;

        /** @type {typeof myUtil} */
        PlayBoardLogic.utilityClass = bundle.utilityClass;
        PlayBoardLogic.stateCode = bundle.stateCode;
        PlayBoardLogic.stageGroup = bundle.stageGroup;
        PlayBoardLogic.plantTypes = bundle.plantTypes;
        PlayBoardLogic.seedTypes = bundle.seedTypes;

        PlayBoardLogic.FloatingWindow = bundle.FloatingWindow;

        /** @type {typeof InfoBoxLogic} */
        PlayBoardLogic.InfoBoxLogic = bundle.InfoBoxLogic;
        /** @type {typeof BoardLogic} */
        PlayBoardLogic.BoardLogic = bundle.BoardLogic;
    }

    // when floating window is on, click anywhere to disable it.
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static handleFloatingWindow(playBoard){
        if (playBoard.floatingWindow !== null) {
            // game over
            if (!playBoard.allFloatingWindows.has("001")) {
                playBoard.gameState.setState(PlayBoardModel.stateCode.STANDBY);
                return true;
            }
            // game clear
            if (!playBoard.allFloatingWindows.has("000")) {
                playBoard.gameState.setState(PlayBoardModel.stateCode.FINISH);
                return true;
            }
            // common floating windows
            if (!playBoard.floatingWindow.isFading) {
                playBoard.floatingWindow.isFading = true;
            }
            if (!playBoard.floatingWindow.playerCanClick) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static handleActiveSkills(p5, playBoard) {
        // when activate button is clicked, system awaits a cell input
        if (playBoard.awaitCell) {
            let index = PlayBoardLogic.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
            if (index[0] === -1) {
                playBoard.floatingWindow = PlayBoardLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            } else {
                // this branch represents skill has been activated successfully
                playBoard.stringify();
                let spellCaster = PlayBoardLogic.BoardLogic.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1], playBoard.boardObjects);
                let target = PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
                if (spellCaster.plant.plantType === PlayBoardLogic.plantTypes.TREE) {
                    PlantActive.rechargeHP(this, spellCaster, target, 1);
                } else if (spellCaster.plant.plantType === PlayBoardLogic.plantTypes.ORCHID) {
                    PlantActive.sendAnimalFriends(this, spellCaster, target);
                }
            }
            this.awaitCell = false;
        }
    }

    // set the clicked cell to draw info box
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static clickedCell(p5, playBoard) {
        let index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
        if (index[0] === -1) {
            this.selectedCell = [];
        } else {
            this.selectedCell = [index[0], index[1]];
            // a shortcut to direct to plant active skill page
            let cell = PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
            if (cell.plant !== null && cell.plant.hasActive) {
                PlayBoardLogic.InfoBoxLogic.setStatus(p5, 'a',playBoard.infoBox);
            }
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    handleClick(p5, playBoard) {
        if (PlayBoardLogic.handleFloatingWindow(playBoard)) {
            return;
        }

        PlayBoardLogic.handleActiveSkills(p5, playBoard);

        // click any button
        for (let button of playBoard.buttons) {
            if (button.mouseClick(p5) && button === playBoard.infoBox.activateButton) {
                return;
            }
        }

        // clicked info box arrows when info box exists
        if (PlayBoardLogic.InfoBoxLogic.handleClickArrow(p5, playBoard)) {
            return;
        }

        // inventory item and planting
        this.handlePlanting(p5);

        // click any grid cell to display info box
        PlayBoardLogic.clickedCell(p5, playBoard);
    }







    handlePlanting(p5) {
        let index = myUtil.pos2CellIndex(this, p5.mouseX, p5.mouseY);
        // clicked an item from inventory, then clicked a cell:
        if (this.gameState.inventory.selectedItem !== null && index[0] !== -1) {
            if (this.actionPoints > 0) {
                this.stringify();
                if (this.boardObjects.plantCell(p5, this, index[0], index[1], this.gameState.inventory.createItem(p5, this.gameState.inventory.selectedItem))) {
                    console.log(`Placed ${this.gameState.inventory.selectedItem} at row ${index[0]}, col ${index[1]}`);
                    this.shadowPlant = null;
                    if (this.hasActionPoints) {
                        this.actionPoints--;
                    }
                    // set plant's skill
                    this.reevaluatePlantSkills();

                    // remove item from inventory
                    this.gameState.inventory.itemDecrement();

                    // set countdown for seed
                    this.setSeedCountdown(index[0], index[1]);

                    // if kiku is planted, increase upper limit of action points immediately
                    if (this.boardObjects.getCell(index[0], index[1])?.plant?.plantType === plantTypes.KIKU) {
                        this.maxActionPoints++;
                        this.actionPoints++;
                    }

                    return;
                }
            } else {
                if (this.hasActionPoints && this.actionPoints === 0) {
                    this.floatingWindow = FloatingWindow.copyOf(this.allFloatingWindows.get("002"));
                    return;
                }
            }
        }

        // clicked item from inventory or clicked somewhere else:
        // handle inventory clicks later to prevent unintentional issues
        this.gameState.inventory.handleClick(p5);
        if (this.gameState.inventory.selectedItem !== null && index[0] === -1) {
            this.shadowPlant = this.gameState.inventory.createItem(p5, this.gameState.inventory.selectedItem);
        } else {
            this.shadowPlant = null;
        }
    }

    setSeedCountdown(x, y) {
        // used in stage 5
    }

    // miscellaneous end turn settings
    endTurnActivity(p5) {
        // clear undo stack
        this.undoStack = [];

        // remove dead plants and reset plant skill
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            // a safe-lock to remove all dead plants
            if (cell.plant.status === false) {
                this.boardObjects.removePlant(cell.x, cell.y);
            }
            // reset active skill status
            if (cell.plant.hasActive) {
                cell.plant.useLeft = cell.plant.maxUse;
            }
        }

        // update seed status
        let cellsWithSeed = this.boardObjects.getAllCellsWithSeed();
        for (let cws of cellsWithSeed) {
            let grown = cws.seed.grow(p5);
            if (grown.type === itemTypes.SEED) {
                cws.seed = grown;
            } else if (grown.type === itemTypes.PLANT) {
                cws.removeSeed();
                cws.plant = grown;
            }
        }

        // reevaluate plants' skills, after seeds have grown up
        this.reevaluatePlantSkills();

        // also, reconstruct ecosystem
        this.boardObjects.setEcosystem();

        // set turn and counter
        this.turn++;
        this.buttons.find(button => button.text.startsWith("turn")).text = this.getTurnButtonText();
        if (this.turn === this.maxTurn + 1) {
            this.stageClearSettings(p5);
            return;
        } else {
            this.endTurn = false;
        }

        // set next turn enemies and new inventory items
        this.nextTurnItems(p5);

        // count the total number of kiku to determine max action points
        let count = 0;
        for (let cwp of this.boardObjects.getAllCellsWithPlant()) {
            if (cwp?.plant.plantType === plantTypes.KIKU) count++;
        }
        this.maxActionPoints = 3 + count;
        // reset action points
        this.actionPoints = this.maxActionPoints;

        // set action listener active
        this.gameState.setPlayerCanClick(true);
    }

    stageClearSettings(p5) {
        // when a stage is cleared:    
        // 1. store all living plants, this comes after seeds have grown
        let cellsWithPlant = this.boardObjects.getAllCellsWithPlant();
        for (let cws of cellsWithPlant) {
            this.gameState.inventory.pushItem2Inventory(p5, cws.plant.name, 1);
        }
        // 2. remove all seeds and bamboo from inventory
        this.gameState.inventory.removeAllSeedsAndBamboo();
        // 3. set current stage cleared
        this.gameState.setStageCleared(this);
        // 4. reset action listener
        this.gameState.setPlayerCanClick(true);
    }

    setAndResolveCounter(p5) {
        let cells = this.boardObjects.getAllCellsWithPlant();

        // increment earth counters, decrement cold counters.
        for (let cwp of cells) {
            if (cwp.plant.earthCounter === undefined) {
                cwp.plant.earthCounter = 1;
            } else {
                cwp.plant.earthCounter++;
            }
            if (cwp.terrain.terrainType === terrainTypes.SNOWFIELD) {
                if (cwp.plant.coldCounter === undefined) {
                    cwp.plant.coldCounter = 2;
                } else {
                    cwp.plant.coldCounter--;
                    if (cwp.plant.coldCounter <= 0) {
                        InteractionLogic.findPlantAndDelete(this, cwp.plant);
                    }
                }
            }
        }

        if (!this.hasBamboo) {
            // if a tree has a counter=10, insert bamboo into inventory.
            for (let cwp of cells) {
                if (cwp.plant.earthCounter !== undefined && cwp.plant.earthCounter >= 10 && baseType(cwp.plant) === plantTypes.TREE) {
                    this.modifyBoard(p5, "bamboo");
                    this.hasBamboo = true;
                    break;
                }
            }
        }
    }

    // when a new plant is placed or removed,
    // we need to verify all plant's skill status.
    reevaluatePlantSkills() {
        let cells = this.boardObjects.getAllCellsWithPlant();
        for (let cell of cells) {
            cell.plant.reevaluateSkills(this, cell);
        }
    }

    // this does not activate skill immediately, but go to awaiting status
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static activatePlantSkill(playBoard) {
        let spellCaster = PlayBoardLogic.BoardLogic.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1], playBoard.boardObjects);
        if (spellCaster.plant.plantType === PlayBoardLogic.plantTypes.TREE || spellCaster.plant.plantType === PlayBoardLogic.plantTypes.ORCHID) {
            playBoard.awaitCell = true;
        }
    }

    nextTurnItems(p5) {
        console.error("nextTurnEnemies is not overridden!");
    }




}

export class PlayBoardSerializer{
    static setup(bundle){

    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static stringify(playBoard) {
        let status = {
            boardObjects: playBoard.boardObjects.stringify(),
            inventory: playBoard.gameState.inventory.stringify(),
            movables: JSON.stringify(playBoard.movables.map(movable => movable.stringify())),
            actionPoints: playBoard.actionPoints,
            maxActionPoints: playBoard.maxActionPoints,
        }
        playBoard.undoStack.push(JSON.stringify(status));
        return status;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static undo(p5, playBoard) {
        if (playBoard.undoStack.length === 0) return;

        let status = JSON.parse(playBoard.undoStack.pop());

        // reset board
        playBoard.boardObjects = BoardSerializer.parse(status.boardObjects, p5, this);
        // reset action points
        playBoard.maxActionPoints = status.maxActionPoints;
        playBoard.actionPoints = status.actionPoints;
        // reset plant skills
        playBoard.reevaluatePlantSkills();
        // reset ecosystem
        playBoard.boardObjects.setEcosystem();
        // reset inventory
        playBoard.gameState.inventory = Inventory.parse(status.inventory, p5);

        // reset movables, need to put movable with cell to the correct cell
        this.movables = JSON.parse(status.movables).map(json => {
            const movable = JSON.parse(json);
            switch (movable.movableType) {
                case movableTypes.BANDIT:
                    return Bandit.parse(json, p5, this);
                case movableTypes.TORNADO:
                    return Tornado.parse(json, p5, this);
                case movableTypes.BOMB:
                    return VolcanicBomb.parse(json, p5, this);
                case movableTypes.SLIDE:
                    return SlideAnimation.parse(json, p5, this);
                case movableTypes.EARTHQUAKE:
                    return Earthquake.parse(json, p5, this);
                case movableTypes.BLIZZARD:
                    return Blizzard.parse(json, p5, this);
                case movableTypes.TSUNAMI:
                    return TsunamiAnimation.parse(json, p5, this);
                default:
                    console.warn("Unknown enemy type", movable.movableType);
                    return null;
            }
        }).filter(Boolean);
        for (let movable of this.movables) {
            if (movable.cell) {
                movable.cell.enemy = movable;
            }
        }
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static saveGame(playBoard) {
        let status = this.stringify();
        status.stageGroup = playBoard.stageGroup;
        status.stageNumbering = Number(this.stageNumbering.charAt(2));
        status.turn = this.turn;
        status.tmpInventoryItems = Array.from(this.tmpInventoryItems.entries());
        if (this.snowfields !== undefined) {
            status.snowfields = JSON.stringify(this.snowfields);
        }
        if (this.fertilized !== undefined) {
            status.fertilized = JSON.stringify(this.fertilized);
        }
        return JSON.stringify(status);
    }

    static loadGame(p5, gameState, status) {
        let statusObject = JSON.parse(status);
        let playBoard = new gameState.gsf.stageClasses[statusObject.stageGroup][statusObject.stageNumbering - 1](gameState);
        playBoard.undoStack.push(status);
        playBoard.undo(p5);
        playBoard.turn = statusObject.turn;
        playBoard.tmpInventoryItems = new Map(statusObject.tmpInventoryItems);
        if (playBoard.snowfields) playBoard.snowfields = JSON.parse(statusObject.snowfields);
        if (playBoard.fertilized) playBoard.fertilized = JSON.parse(statusObject.fertilized);
        playBoard.setupActionListeners(p5);
        playBoard.initAllFloatingWindows(p5);
        return playBoard;
    }
}
