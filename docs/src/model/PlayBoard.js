/**
 * @typedef {Object} PlayBoardLike
 * @property {GameState} gameState
 * @property {Array} buttons
 * @property {FloatingWindow} floatingWindow
 * @property {Map} allFloatingWindows
 * @property {number} fade
 * @property {boolean} isFading
 * @property {boolean} isEntering
 * @property {number} fadeIn
 * @property {boolean} selectInv
 * @property {String} mode
 * @property {number} stageGroup
 * @property {number} stageNumbering
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
 * @property {boolean} hasBamboo
 * @property {boolean} skip
 * @property {*} shadowPlant
 * @property {Array} undoStack
 * @property {Array} snowfields
 * @property {Array} fertilized
 * @property {FloatingWindow} infoFloatingWindow
 * @property {Function} setupActionListeners
 * @property {Function} setStageTerrain
 * @property {Function} initAllFloatingWindows
 * @property {Function} getTurnButtonText
 */

// ---------------------------------
// Remember to maintain above JSDoc.
// ---------------------------------

import {FloatingWindow} from "./FloatingWindow.js";

/**
 * @implements ScreenLike
 * @implements PlayBoardLike
 */
class PlayBoardModel {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        PlayBoardModel.utilityClass = bundle.utilityClass;
        PlayBoardModel.stateCode = bundle.stateCode;
        PlayBoardModel.stageGroup = bundle.stageGroup;
        /** @type {typeof Button} */
        PlayBoardModel.Button = bundle.Button;
        /** @type {typeof InfoBoxModel} */
        PlayBoardModel.InfoBoxModel = bundle.InfoBoxModel;
        /** @type {typeof BoardModel} */
        PlayBoardModel.BoardModel = bundle.BoardModel;
    }

    /**
     *
     * @param p5
     * @param {GameState} gameState
     */
    constructor(p5, gameState) {
        this.gameState = gameState;
        this.buttons = [];
        /** @type {FloatingWindow} */
        this.floatingWindow = null;
        /** @type {Map} */
        this.allFloatingWindows = null;

        // fade in fade out render
        this.fade = 0;
        this.faing = false;
        this.isEntering = true;
        this.fadeIn = 255;

        this.stageGroup = PlayBoardModel.stageGroup.NO_STAGE;
        this.stageNumbering = 0;
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
        this.infoBox = new PlayBoardModel.InfoBoxModel(this);

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
        this.awaitCell = false;

        this.ecoDisplay = true;

        this.isGameOver = false;

        this.skip = false;

        // set cursor style when dragging item
        this.shadowPlant = null;

        // save last state
        this.undoStack = [];

        // BLIZZARD SPECIFIC:
        // snowfield prototype cells
        this.snowfields = [];

        // TSUNAMI SPECIFIC:
        // record fertilized cells
        this.fertilized = [];

        PlayBoardModel.concreteBoardInit(this);

        // gamepad
        this.selectInv = false;
        this.mode = "mouse";

        this.infoFloatingWindow = null;

        // initialization
        PlayBoardModel.initPlayBoard(p5, /** @type {PlayBoardLike} */ this);
    }

    // will be replaced by concrete board methods
    static concreteBoardInit(playBoard) {
    }

    setupInteractive(playBoard) {
    }

    // abstract - invoked by controller
    static setStageInventory(p5, playBoard) {
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static initPlayBoard(p5, playBoard) {
        // reset position
        p5.gamepadX = playBoard.canvasWidth / 2;
        p5.gamepadY = playBoard.canvasHeight / 2;
        p5.mouseSpeed = 10;
        playBoard.mode = playBoard.gameState.mode;
        playBoard.gameState.inventory.mode = playBoard.gameState.mode;

        // action listeners
        PlayBoardModel.setupActionListeners(p5, playBoard);

        // setup stage terrain
        PlayBoardModel.setStageTerrain(p5, playBoard);

        // initialized all fw
        PlayBoardModel.initAllFloatingWindows(p5, playBoard);
    }

    // abstract
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setStageTerrain(p5, playBoard) {
    }

    // abstract
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static initAllFloatingWindows(p5, playBoard) {
    }

    // boilerplate
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setupActionListeners(p5, playBoard) {
        // undo
        let [undoX, undoY] = PlayBoardModel.utilityClass.relative2absolute(0.02, 0.01);
        let [undoWidth, undoHeight] = PlayBoardModel.utilityClass.relative2absolute(0.09, 0.07);
        let undoButton = new PlayBoardModel.Button(undoX, undoY, undoWidth, undoHeight, "UNDO", "xbox_LT");
        undoButton.mode = playBoard.gameState.mode;
        undoButton.onClick = () => {
            PlayBoardSerializer.undo(p5, playBoard);
        }

        // turn button
        let [turnWidth, turnHeight] = PlayBoardModel.utilityClass.relative2absolute(5 / 32, 0.07);
        let [turnX, turnY] = PlayBoardModel.utilityClass.relative2absolute(0.5, 0.01);
        let turnButton = new PlayBoardModel.Button(turnX - turnWidth / 2, turnY, turnWidth, turnHeight, PlayBoardModel.getTurnButtonText(playBoard), "xbox_Y", "2");
        turnButton.mode = playBoard.gameState.mode;
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
                playBoard.endTurn = true;
            }
            // once player unable to click, controller will loop movables to check if there are anything has not moved
            playBoard.gameState.setPlayerCanClick(false);
        }

        playBoard.buttons.push(turnButton, undoButton);
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static getTurnButtonText(playBoard) {
        return `TURN ${playBoard.turn} IN ${playBoard.maxTurn}`;
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.buttons.forEach(button => {
            button.mode = "gamepad";
        });
        this.gameState.inventory.mode = "gamepad";
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.buttons.forEach(button => {
            button.mode = "mouse";
        });
        this.gameState.inventory.mode = "mouse";
    }
}

class PlayBoardRenderer {
    static setup(bundle) {
        PlayBoardRenderer.itemTypes = bundle.itemTypes;
        PlayBoardRenderer.stageGroup = bundle.stageGroup;
        PlayBoardRenderer.stateCode = bundle.stateCode;
        PlayBoardRenderer.movableTypes = bundle.movableTypes;
        /** @type {typeof ScreenRenderer} */
        PlayBoardRenderer.ScreenRenderer = bundle.ScreenRenderer;
        /** @type {typeof BoardRenderer} */
        PlayBoardRenderer.BoardRenderer = bundle.BoardRenderer;
        /** @type {typeof InfoBoxRenderer} */
        PlayBoardRenderer.InfoBoxRenderer = bundle.InfoBoxRenderer;
        /** @type {typeof InventoryRenderer} */
        PlayBoardRenderer.InventoryRenderer = bundle.InventoryRenderer;
        /** @type {typeof MovableRenderer} */
        PlayBoardRenderer.MovableRenderer = bundle.MovableRenderer;

        /** @type {typeof myUtil} */
        PlayBoardRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof FloatingWindow} */
        PlayBoardRenderer.FloatingWindow = bundle.FloatingWindow;

        /** @type {typeof InteractionLogic} */
        PlayBoardRenderer.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawGrid(p5, playBoard) {
        PlayBoardRenderer.BoardRenderer.draw(p5, playBoard);

        // if skill is activated and awaiting target, set highlight on
        if (playBoard.awaitCell) {
            for (let i = 0; i < playBoard.gridSize; i++) {
                for (let j = 0; j < playBoard.gridSize; j++) {
                    if (PlayBoardRenderer.InteractionLogic.activeRange1(i, j, playBoard.selectedCell[0], playBoard.selectedCell[1])) {
                        let [x1, y1, x2, y2, x3, y3, x4, y4] = PlayBoardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CORNERS);
                        p5.fill('rgba(150, 150, 0, 0.65)');
                        p5.strokeWeight(2);
                        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                    }
                }
            }
            p5.noFill();
        }

        // highlight the cell mouse hovering on
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                let [x1, y1, x2, y2, x3, y3, x4, y4] = PlayBoardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CORNERS);
                let isCursorInQuad = playBoard.gameState.mode === "mouse" ? PlayBoardRenderer.utilityClass.isCursorInQuad(p5.mouseX, p5.mouseY, x1, y1, x2, y2, x3, y3, x4, y4)
                    : PlayBoardRenderer.utilityClass.isCursorInQuad(p5.gamepadX, p5.gamepadY, x1, y1, x2, y2, x3, y3, x4, y4)
                if (isCursorInQuad) {
                    p5.stroke('rgb(255,255,0)');
                    p5.strokeWeight(2);
                    p5.noFill();
                    p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
                }
            }
        }
        p5.noStroke();
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setCursorStyle(p5, playBoard) {
        // set cursor style
        if (playBoard.gameState.mode === "mouse") {
            if (playBoard.gameState.inventory.selectedItem !== null) {
                p5.cursor('grab');
            } else if (playBoard.awaitCell) {
                p5.cursor('pointer');
            } else {
                p5.cursor(p5.ARROW);
            }
        }

        // draw shadow plant
        if (playBoard.shadowPlant !== null) {
            let imgSize = PlayBoardRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
            p5.push();
            p5.tint(255, 180);
            if (playBoard.gameState.mode === "gamepad") {
                p5.image(playBoard.shadowPlant.img, p5.gamepadX - imgSize / 2, p5.gamepadY - 3 * imgSize / 4, imgSize, imgSize);
            } else {
                p5.image(playBoard.shadowPlant.img, p5.mouseX - imgSize / 2, p5.mouseY - 3 * imgSize / 4, imgSize, imgSize);
            }
            p5.pop();
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawMovables(p5, playBoard) {
        // tornado arrows first
        for (let movable of playBoard.movables) {
            if (!movable.isMoving && movable.type === PlayBoardRenderer.itemTypes.ENEMY && movable.movableType === PlayBoardRenderer.movableTypes.TORNADO) {
                PlayBoardRenderer.MovableRenderer.drawDirection(p5, movable);
            }
        }
        // draw all movables according to movables
        for (let movable of playBoard.movables) {
            PlayBoardRenderer.MovableRenderer.draw(playBoard, movable);
        }
        // health bar last
        for (let movable of playBoard.movables) {
            if (movable.health !== undefined) {
                PlayBoardRenderer.utilityClass.drawHealthBar(p5, movable, movable.x - 20, movable.y - 50, 40, 5);
            }
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawFloatingWindow(p5, playBoard) {
        PlayBoardRenderer.ScreenRenderer.drawFloatingWindow(p5, playBoard, PlayBoardLogic.setFloatingWindow);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawActionPoints(p5, playBoard) {
        if (playBoard.hasActionPoints) {
            let [x, y] = PlayBoardRenderer.utilityClass.relative2absolute(0.6, 0.01);
            let [width, height] = PlayBoardRenderer.utilityClass.relative2absolute(0.07 * 9 / 16, 0.07);
            let img = playBoard.actionPoints !== 0 ? p5.images.get("ActionPointBoard") : p5.images.get("ActionPointBoardDeplete");
            p5.image(img, x, y, width, height);

            p5.fill(50);
            p5.textSize(15);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(playBoard.actionPoints + " / " + playBoard.maxActionPoints, x + width / 2, y + height / 2);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static drawIdleInfo(p5, playBoard) {
        if ((playBoard.gameState.mouseIdleDetector.isIdle() || playBoard.gameState.isIdle) && (!playBoard.floatingWindow || playBoard.floatingWindow.playerCanClick)) {
            if (!playBoard.infoFloatingWindow) {
                let text = null;
                let index;
                if (playBoard.gameState.mode === "mouse") index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
                else index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.gamepadX, p5.gamepadY);
                // mouse is on a cell
                if (index[0] !== -1) {
                    let cell = PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
                    if (cell.plant) {
                        text = PlayBoardLogic.PlantLogic.idleInfo(cell.plant.plantType);
                    }
                    if (cell.enemy) {
                        text = PlayBoardLogic.MovableLogic.idleInfo(cell.enemy.movableType);
                    }
                }
                // mouse is on an inventory item
                else {
                    let inventory = playBoard.gameState.inventory;
                    let visibleItems = Array.from(inventory.items.entries()).slice(inventory.scrollIndex, inventory.scrollIndex + inventory.maxVisibleItems);
                    for (let i = 0; i < visibleItems.length; i++) {
                        let key = visibleItems[i][0];
                        if (inventory.mode === "mouse") {
                            let [x, y] = PlayBoardLogic.InventoryLogic.getItemPosition(i, inventory);
                            if (p5.mouseX >= x && p5.mouseX <= x + inventory.itemWidth &&
                                p5.mouseY >= y && p5.mouseY <= y + (inventory.itemHeight - inventory.itemInter)) {
                                if (key % 2 === 1) key--;
                                text = PlayBoardLogic.PlantLogic.idleInfo(key);
                            }
                        }
                    }
                }
                if (text !== null) {
                    let xPos = playBoard.gameState.mode === "mouse" ? p5.mouseX : p5.gamepadX;
                    let yPos = playBoard.gameState.mode === "mouse" ? p5.mouseY : p5.gamepadY;
                    playBoard.infoFloatingWindow = new PlayBoardRenderer.FloatingWindow(p5, null, text, {
                        x: xPos,
                        y: yPos,
                        fontSize: 14,
                        padding: 4,
                        spacingRatio: 0.2,
                        fadingSpeed: 1,
                        playerCanClick: true
                    });
                    playBoard.infoFloatingWindow.x -= playBoard.infoFloatingWindow.boxWidth / 2;
                    playBoard.infoFloatingWindow.y -= playBoard.infoFloatingWindow.boxHeight / 2;
                    if (playBoard.infoFloatingWindow.x - playBoard.infoFloatingWindow.boxWidth < 0) {
                        playBoard.infoFloatingWindow.x += playBoard.infoFloatingWindow.boxWidth;
                    }
                    if (playBoard.infoFloatingWindow.y - playBoard.infoFloatingWindow.boxHeight < 0) {
                        playBoard.infoFloatingWindow.y += playBoard.infoFloatingWindow.boxHeight;
                    }
                }
            } else {
                playBoard.infoFloatingWindow.draw();
            }
        }
        if (!playBoard.gameState.mouseIdleDetector.isIdle() && playBoard.gameState.mode === "mouse") {
            playBoard.infoFloatingWindow = null;
        }
        if (!playBoard.gameState.isIdle && playBoard.gameState.mode === "gamepad") {
            playBoard.infoFloatingWindow = null;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static draw(p5, playBoard) {
        // draw background
        let bg;
        if (playBoard.stageGroup === PlayBoardRenderer.stageGroup.TORNADO) {
            bg = p5.images.get("TornadoBG");
        }
        if (playBoard.stageGroup === PlayBoardRenderer.stageGroup.VOLCANO) {
            bg = p5.images.get("VolcanoBG");
        }
        if (playBoard.stageGroup === PlayBoardRenderer.stageGroup.EARTHQUAKE) {
            bg = p5.images.get("EarthquakeBG");
        }
        if (playBoard.stageGroup === PlayBoardRenderer.stageGroup.BLIZZARD) {
            bg = p5.images.get("BlizzardBG");
        }
        if (playBoard.stageGroup === PlayBoardRenderer.stageGroup.TSUNAMI) {
            bg = p5.images.get("TsunamiBG");
        }
        p5.image(bg, 0, 0, PlayBoardRenderer.utilityClass.relative2absolute(1, 1)[0], PlayBoardRenderer.utilityClass.relative2absolute(1, 1)[1]);

        // stage number text
        let [stageNumberingX, stageNumberingY] = PlayBoardRenderer.utilityClass.relative2absolute(0.37, 0.01);
        let stageNumberingSize = PlayBoardRenderer.utilityClass.relative2absolute(0.38, 0.08)[1];
        p5.image(p5.images.get(`LevelSigns${playBoard.stageGroup}-${playBoard.stageNumbering}`),stageNumberingX, stageNumberingY, stageNumberingSize, stageNumberingSize);

        PlayBoardRenderer.drawGrid(p5, playBoard);

        // draw info box
        if (playBoard.selectedCell.length !== 0) {
            PlayBoardRenderer.InfoBoxRenderer.draw(p5, playBoard.infoBox);
        }

        PlayBoardRenderer.drawMovables(p5, playBoard);

        // draw inventory
        PlayBoardRenderer.InventoryRenderer.draw(p5, playBoard.gameState.inventory);
        PlayBoardRenderer.InventoryRenderer.drawGamepadInstruction(p5, playBoard.gameState.inventory);

        // draw action points
        PlayBoardRenderer.drawActionPoints(p5, playBoard);

        // all buttons
        // to cascade activate button above info box, place the loop after info box
        for (let button of playBoard.buttons) {
            if (!(playBoard.turn === playBoard.maxTurn + 1 && button.text.toLowerCase().startsWith("turn"))) {
                button.draw(p5);
            }
        }

        // if game over, set player can click to stop movables updating
        if (playBoard.isGameOver && !playBoard.gameState.playerCanClick) {
            playBoard.gameState.setPlayerCanClick(true);
        }

        PlayBoardRenderer.drawFloatingWindow(p5, playBoard);

        PlayBoardRenderer.setCursorStyle(p5, playBoard);

        if (playBoard.gameState.isFading) {
            PlayBoardRenderer.ScreenRenderer.playFadeOutAnimation(p5, playBoard);
        }

        if (playBoard.isEntering) {
            PlayBoardRenderer.ScreenRenderer.playFadeInAnimation(p5, playBoard);
        }

        // gamepad pos
        if (playBoard.gameState.mode === "gamepad") {
            p5.fill('yellow');
            p5.stroke(0);
            p5.circle(p5.gamepadX, p5.gamepadY, 10);
        }

        // new feature: if mouse is idle, draw floating window to print information on game entities.
        PlayBoardRenderer.drawIdleInfo(p5, playBoard);
    }

}

class PlayBoardLogic {
    static setup(bundle) {
        /** @type {typeof ScreenLogic} */
        PlayBoardLogic.ScreenLogic = bundle.ScreenLogic;

        /** @type {typeof myUtil} */
        PlayBoardLogic.utilityClass = bundle.utilityClass;
        PlayBoardLogic.stateCode = bundle.stateCode;
        PlayBoardLogic.stageGroup = bundle.stageGroup;
        PlayBoardLogic.itemTypes = bundle.itemTypes;
        /** @type {function} */
        PlayBoardLogic.baseType = bundle.baseType;
        PlayBoardLogic.plantTypes = bundle.plantTypes;
        PlayBoardLogic.seedTypes = bundle.seedTypes;
        PlayBoardLogic.plantFactory = bundle.plantFactory;

        PlayBoardLogic.terrainTypes = bundle.terrainTypes;
        PlayBoardLogic.terrainFactory = bundle.terrainFactory;

        PlayBoardLogic.movableTypes = bundle.movableTypes;
        PlayBoardLogic.movableFactory = bundle.movableFactory;

        PlayBoardLogic.FloatingWindow = bundle.FloatingWindow;

        /** @type {typeof InventoryLogic} */
        PlayBoardLogic.InventoryLogic = bundle.InventoryLogic;
        /** @type {typeof InfoBoxLogic} */
        PlayBoardLogic.InfoBoxLogic = bundle.InfoBoxLogic;
        /** @type {typeof BoardLogic} */
        PlayBoardLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        PlayBoardLogic.InteractionLogic = bundle.InteractionLogic;

        /** @type {typeof PlantLogic} */
        PlayBoardLogic.PlantLogic = bundle.PlantLogic;
        /** @type {typeof SeedLogic} */
        PlayBoardLogic.SeedLogic = bundle.SeedLogic;
        /** @type {typeof TerrainLogic} */
        PlayBoardLogic.TerrainLogic = bundle.TerrainLogic;
        /** @type {typeof MovableLogic} */
        PlayBoardLogic.MovableLogic = bundle.MovableLogic;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static cancel(playBoard) {
        if (playBoard.gameState.paused) playBoard.gameState.togglePaused();
        else {
            if (playBoard.gameState.inventory.selectedItem) {
                playBoard.gameState.inventory.selectedItem = null;
                playBoard.shadowPlant = null;
                return;
            } else if (playBoard.gameState.inventory.isSelected) {
                playBoard.gameState.inventory.index = -1;
                playBoard.gameState.inventory.isSelected = false;
            }
        }
    }

    static handleAnalogStickPressed() {

    }

    static handleAnalogStickIdle(axes, playBoard) {
        playBoard.gameState.isIdle = true;
    }

    /**
     *
     * @param index
     * @param {PlayBoardLike} playBoard
     */
    static handleGamepad(index, playBoard) {
        switch (index) {
            case 1:
                PlayBoardLogic.cancel(playBoard);
                break;
            case 2:
                if (playBoard.isGameOver) return;
                if (playBoard.floatingWindow !== null && !playBoard.floatingWindow.playerCanClick) return;
                let display = playBoard.buttons.find(button => button.text.toLowerCase().includes('display'));
                if (display) display.onClick();
                break;
            case 3:
                if (playBoard.isGameOver) return;
                if (playBoard.floatingWindow !== null && !playBoard.floatingWindow.playerCanClick) return;
                playBoard.buttons[0].onClick();
                break;
            case 6:
                if (playBoard.isGameOver) return;
                if (playBoard.floatingWindow !== null && !playBoard.floatingWindow.playerCanClick) return;
                playBoard.buttons[1].onClick();
                break;
            case 7:
                if (playBoard.isGameOver) return;
                if (playBoard.floatingWindow !== null && !playBoard.floatingWindow.playerCanClick) return;
                let activate = playBoard.buttons.find(button => button.text.toLowerCase().includes('activate'));
                if (activate) activate.onClick();
                break;
            case 9:
                playBoard.gameState.togglePaused();
                break;
            case 12:
                playBoard.gameState.inventory.isSelected = true;
                playBoard.gameState.inventory.index = Math.max(0, playBoard.gameState.inventory.index - 1);
                if (playBoard.gameState.inventory.index === 0) {
                    const event = {};
                    event.deltaY = -1;
                    PlayBoardLogic.InventoryLogic.handleScroll(event, playBoard.gameState.inventory);
                }
                break;
            case 13:
                playBoard.gameState.inventory.isSelected = true;
                let visibleItems = Array.from(playBoard.gameState.inventory.items.entries()).slice(playBoard.gameState.inventory.scrollIndex, playBoard.gameState.inventory.scrollIndex + playBoard.gameState.inventory.maxVisibleItems);
                playBoard.gameState.inventory.index = Math.min(visibleItems.length - 1, playBoard.gameState.inventory.index + 1);
                if (playBoard.gameState.inventory.index === 5) {
                    const event = {};
                    event.deltaY = 1;
                    PlayBoardLogic.InventoryLogic.handleScroll(event, playBoard.gameState.inventory);
                }
                break;
        }
    }

    /**
     *
     * @param axes
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static handleAnalogStick(p5, axes, playBoard) {
        if (playBoard.gameState.paused) return;
        playBoard.gameState.isIdle = false;
        if (Math.abs(axes[0]) > 0.2 || Math.abs(axes[1]) > 0.2) {
            // edges of the grid under old grid-centered coordinates
            let leftEdge = -(playBoard.gridSize * playBoard.cellWidth) / 2;
            let rightEdge = (playBoard.gridSize * playBoard.cellWidth) / 2;
            let topEdge = -(playBoard.gridSize * playBoard.cellHeight) / 2;
            let bottomEdge = (playBoard.gridSize * playBoard.cellHeight) / 2;

            let updateX = p5.gamepadX + axes[0] * p5.mouseSpeed;
            let updateY = p5.gamepadY + axes[1] * p5.mouseSpeed;

            // mouse position under old grid-centered coordinates
            let oldX = PlayBoardLogic.utilityClass.oldCoorX(playBoard, updateX - playBoard.canvasWidth / 2, updateY - playBoard.canvasHeight / 2);
            let oldY = PlayBoardLogic.utilityClass.oldCoorY(playBoard, updateX - playBoard.canvasWidth / 2, updateY - playBoard.canvasHeight / 2);

            oldX = oldX <= leftEdge ? leftEdge : oldX;
            oldY = oldY <= topEdge ? topEdge : oldY;
            oldX = oldX >= rightEdge ? rightEdge : oldX;
            oldY = oldY >= bottomEdge ? bottomEdge : oldY;
            p5.gamepadX = PlayBoardLogic.utilityClass.newCoorX(playBoard, oldX, oldY) + playBoard.canvasWidth / 2;
            p5.gamepadY = PlayBoardLogic.utilityClass.newCoorY(playBoard, oldX, oldY) + playBoard.canvasHeight / 2;
        }
    }

    // boilerplate. when floating window is on, click anywhere to disable it.
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static handleFloatingWindow(playBoard) {
        if (playBoard.floatingWindow !== null) {
            // game over
            if (!playBoard.allFloatingWindows.has("001")) {
                playBoard.gameState.setState(PlayBoardModel.stateCode.STANDBY);
                return true;
            }
            // game clear
            if (!playBoard.allFloatingWindows.has("000")) {
                playBoard.gameState.isFading = true;
                playBoard.gameState.nextState = PlayBoardLogic.stateCode.FINISH;
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
            let index;
            if (playBoard.gameState.mode === "mouse") index = PlayBoardLogic.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
            else index = PlayBoardLogic.utilityClass.pos2CellIndex(playBoard, p5.gamepadX, p5.gamepadY);
            if (index[0] === -1) {
                playBoard.floatingWindow = /** @type {FloatingWindow} */ PlayBoardLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            } else {
                // the branch represents skill has been activated successfully
                PlayBoardSerializer.stringify(playBoard);
                let spellCaster = PlayBoardLogic.BoardLogic.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1], playBoard.boardObjects);
                let target = PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
                if (spellCaster.plant.plantType === PlayBoardLogic.plantTypes.PINE) {
                    PlayBoardLogic.InteractionLogic.rechargeHP(playBoard, spellCaster, target, 1);
                } else if (spellCaster.plant.plantType === PlayBoardLogic.plantTypes.ORCHID) {
                    PlayBoardLogic.InteractionLogic.sendAnimalFriends(playBoard, spellCaster, target);
                }
            }
            playBoard.awaitCell = false;
        }
    }

    // set the clicked cell to draw info box
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static clickedCell(p5, playBoard) {
        let index;
        if (playBoard.gameState.mode === "gamepad") {
            index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.gamepadX, p5.gamepadY);
        } else {
            index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
        }
        if (index[0] === -1) {
            playBoard.selectedCell = [];
        } else {
            playBoard.selectedCell = [index[0], index[1]];
        }
        // update infobox status
        PlayBoardLogic.InfoBoxLogic.updateInfoBox(playBoard);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static handlePlanting(p5, playBoard) {
        let index;
        if (playBoard.gameState.mode === "gamepad") {
            index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.gamepadX, p5.gamepadY);
        } else {
            index = PlayBoardModel.utilityClass.pos2CellIndex(playBoard, p5.mouseX, p5.mouseY);
        }
        // clicked an item from inventory, then clicked a cell:
        if (playBoard.gameState.inventory.selectedItem !== null && index[0] !== -1) {
            if (playBoard.actionPoints > 0) {
                PlayBoardSerializer.stringify(playBoard);
                let item = PlayBoardLogic.InventoryLogic.createItem(p5, playBoard.gameState.inventory.selectedItem, playBoard.gameState.inventory);
                if (PlayBoardLogic.BoardLogic.plantCell(p5, playBoard, index[0], index[1], item)) {
                    playBoard.shadowPlant = null;
                    if (playBoard.hasActionPoints) {
                        playBoard.actionPoints--;
                    }
                    // set plant's skill
                    PlayBoardLogic.reevaluatePlantSkills(playBoard);

                    // remove item from inventory
                    PlayBoardLogic.InventoryLogic.itemDecrement(playBoard.gameState.inventory);

                    // set countdown for seed
                    PlayBoardLogic.setSeedCountdown(p5, index[0], index[1], playBoard);

                    // if kiku is planted, increase upper limit of action points immediately
                    if (PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects)?.plant?.plantType === PlayBoardLogic.plantTypes.KIKU) {
                        playBoard.maxActionPoints++;
                        playBoard.actionPoints++;
                    }
                    return;
                }
            } else {
                if (playBoard.hasActionPoints && playBoard.actionPoints === 0) {
                    playBoard.floatingWindow = /** @type {FloatingWindow} */ PlayBoardLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("002"));
                    playBoard.shadowPlant = null;
                    playBoard.gameState.inventory.selectedItem = null;
                    return;
                }
            }
        }

        // clicked item from inventory or clicked somewhere else:
        // handle inventory clicks later to prevent unintentional issues
        PlayBoardLogic.InventoryLogic.handleClick(p5, playBoard.gameState.inventory);
        if (playBoard.gameState.inventory.selectedItem !== null) {
            playBoard.shadowPlant = PlayBoardLogic.InventoryLogic.createItem(p5, playBoard.gameState.inventory.selectedItem, playBoard.gameState.inventory);
        } else {
            playBoard.shadowPlant = null;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static handleClick(p5, playBoard) {
        if (PlayBoardLogic.handleFloatingWindow(playBoard)) {
            return;
        }

        // click any button
        for (let button of playBoard.buttons) {
            if (button.mouseClick(p5) && (button === playBoard.infoBox.activateButton || button === playBoard.infoBox.displayButton)) {
                return;
            }
        }

        PlayBoardLogic.handleActiveSkills(p5, playBoard);

        // inventory item and planting
        PlayBoardLogic.handlePlanting(p5, playBoard);

        // click any grid cell to display info box
        PlayBoardLogic.clickedCell(p5, playBoard);
    }

    /**
     *
     * @param event
     * @param {PlayBoardLike} playBoard
     */
    static handleScroll(event, playBoard) {
        PlayBoardLogic.ScreenLogic.handleScroll(event, playBoard);
    }

    /**
     *
     * @param p5
     * @param x
     * @param y
     * @param {PlayBoardLike} playBoard
     */
    static setSeedCountdown(p5, x, y, playBoard) {
        let cell = PlayBoardLogic.BoardLogic.getCell(x, y, playBoard.boardObjects);
        if (!cell.seed) return;
        if (cell.terrain.terrainType !== PlayBoardLogic.terrainTypes.DESERT) {
            cell.seed.img = p5.images.get("Seed1");
        }
        if (playBoard.stageGroup >= PlayBoardLogic.stageGroup.TSUNAMI) {
            if (playBoard.fertilized[x][y]) cell.seed.countdown = 1;
        }
    }

    // miscellaneous end turn settings
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static endTurnActivity(p5, playBoard) {
        // clear undo stack
        playBoard.undoStack = [];

        // remove dead plants and reset plant skill
        let cells = PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
        for (let cell of cells) {
            // a safe-lock to remove all dead plants
            if (cell.plant.status === false) {
                cell.removePlant();
            }
            // reset active skill status
            if (cell.plant.hasActive) {
                cell.plant.useLeft = cell.plant.maxUse;
            }
        }

        // update seed status
        let cellsWithSeed = PlayBoardLogic.BoardLogic.getAllCellsWithSeed(playBoard.boardObjects);
        for (let cws of cellsWithSeed) {
            let grown = PlayBoardLogic.SeedLogic.grow(cws.seed);
            if (grown.type === PlayBoardLogic.itemTypes.SEED) {
                cws.seed = grown;
            } else if (grown.type === PlayBoardLogic.itemTypes.PLANT) {
                cws.removeSeed();
                cws.plant = grown;
            }
        }

        // reevaluate plants' skills, after seeds have grown up
        PlayBoardLogic.reevaluatePlantSkills(playBoard);

        // also, reconstruct ecosystem
        PlayBoardLogic.BoardLogic.setEcosystem(playBoard.boardObjects);

        // set turn and counter
        playBoard.turn++;
        playBoard.buttons.find(button => button.text.toLowerCase().startsWith("turn")).text = PlayBoardModel.getTurnButtonText(playBoard);
        if (playBoard.turn === playBoard.maxTurn + 1) {
            PlayBoardLogic.stageClearSettings(p5, playBoard);
            return;
        } else {
            playBoard.endTurn = false;
        }

        // set stage group specific elements
        PlayBoardLogic.setAndResolveCounter(p5, playBoard);
        if (playBoard.stageGroup >= PlayBoardLogic.stageGroup.BLIZZARD) {
            PlayBoardLogic.resetSnowfield(p5, playBoard);
        }

        // set next turn enemies and new inventory items
        PlayBoardLogic.nextTurnItems(p5, playBoard);

        // count the total number of kiku to determine max action points
        let count = 0;
        for (let cwp of PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects)) {
            if (cwp?.plant.plantType === PlayBoardLogic.plantTypes.KIKU) count++;
        }
        playBoard.maxActionPoints = 3 + count;
        // reset action points
        playBoard.actionPoints = playBoard.maxActionPoints;

        // set action listener active
        playBoard.gameState.setPlayerCanClick(true);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static stageClearSettings(p5, playBoard) {
        // when a stage is cleared:
        // 1. store all living plants, comes after seeds have grown
        let cellsWithPlant = PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
        for (let cws of cellsWithPlant) {
            PlayBoardLogic.InventoryLogic.pushItem2Inventory(p5, cws.plant.plantType ? cws.plant.plantType : cws.plant.seedType, 1, playBoard.gameState.inventory);
        }
        // 2. remove all seeds and bamboo from inventory
        PlayBoardLogic.InventoryLogic.removeAllSeedsAndBamboo(playBoard.gameState.inventory);
        // 3. set current stage cleared
        playBoard.gameState.setStageCleared(playBoard.stageGroup);
        // 4. reset action listener
        playBoard.gameState.setPlayerCanClick(true);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setAndResolveCounter(p5, playBoard) {
        let cells = PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);

        // increment earth counters, decrement cold counters.
        for (let cwp of cells) {
            if (playBoard.stageGroup >= PlayBoardLogic.stageGroup.EARTHQUAKE) {
                if (!cwp.plant.earthCounter) {
                    cwp.plant.earthCounter = 1;
                } else {
                    cwp.plant.earthCounter++;
                }
            }
            if (playBoard.stageGroup >= PlayBoardLogic.stageGroup.BLIZZARD) {
                if (cwp.terrain.terrainType === PlayBoardLogic.terrainTypes.SNOWFIELD) {
                    if (!cwp.plant.coldCounter) {
                        cwp.plant.coldCounter = 1;
                    } else {
                        cwp.plant.coldCounter--;
                        if (cwp.plant.coldCounter <= 0) {
                            cwp.removePlant();
                        }
                    }
                }
            }
        }

        if (playBoard.stageGroup >= PlayBoardLogic.stageGroup.EARTHQUAKE) {
            if (!playBoard.hasBamboo) {
                cells = PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
                // if a tree has a counter=10, insert bamboo into inventory.
                for (let cwp of cells) {
                    if (cwp.plant.earthCounter && cwp.plant.earthCounter >= 10 && PlayBoardLogic.baseType(cwp.plant) === PlayBoardLogic.plantTypes.TREE) {
                        PlayBoardLogic.modifyBoard(p5, playBoard, "bamboo");
                        playBoard.hasBamboo = true;
                        break;
                    }
                }
            }
        }
    }

    // when a new plant is placed or removed,
    // we need to verify all plant's skill status.
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static reevaluatePlantSkills(playBoard) {
        let cells = PlayBoardLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
        for (let cell of cells) {
            PlayBoardLogic.PlantLogic.reevaluateSkills(playBoard, cell, cell.plant);
        }
    }

    // does not activate skill immediately, but go to awaiting status
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static activatePlantSkill(playBoard) {
        let spellCaster = PlayBoardLogic.BoardLogic.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1], playBoard.boardObjects);
        if (spellCaster.plant.hasActive) {
            playBoard.awaitCell = !playBoard.awaitCell;
        }
    }

    // VOLCANO SPECIFIC:
    /**
     *
     * @param p5
     * @param i
     * @param j
     * @param {PlayBoardLike} playBoard
     */
    static generateVolBomb(p5, i, j, playBoard) {
        let i1 = Math.floor(Math.random() * 3);
        let j1 = Math.floor(Math.random() * 3);
        while (i1 - j1 === i - j) {
            i1 = Math.floor(Math.random() * 3);
            j1 = Math.floor(Math.random() * 3);
        }
        let [x1, y1] = PlayBoardLogic.utilityClass.cellIndex2Pos(p5, playBoard, i1, j1, p5.CENTER);
        let [x2, y2] = PlayBoardLogic.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);

        PlayBoardLogic.movableFactory.get(PlayBoardLogic.movableTypes.BOMB)(playBoard, i1, j1, i, j, x1, y1, x2, y2);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static generateRandomVolBomb(p5, playBoard) {
        let i2 = Math.floor(Math.random() * (playBoard.gridSize - 3)) + 3;
        let j2 = Math.floor(Math.random() * (playBoard.gridSize - 3)) + 3;
        PlayBoardLogic.generateVolBomb(p5, i2, j2, playBoard);
    }

    // BLIZZARD SPECIFIC:
    // we will need to reset snowfield if plum dies.
    static resetSnowfield(p5, playBoard) {
        for (let index of playBoard.snowfields) {
            let cell = PlayBoardLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
            let hasPlum = false;
            for (let nCell of PlayBoardLogic.BoardLogic.getNearbyCells(cell.i, cell.j, PlayBoardLogic.PlantLogic.plumRange, playBoard.boardObjects)) {
                if (nCell.plant?.plantType === PlayBoardLogic.plantTypes.PLUM) {
                    hasPlum = true;
                    break;
                }
            }
            if (!hasPlum) {
                cell.terrain = PlayBoardLogic.terrainFactory.get(PlayBoardLogic.terrainTypes.SNOWFIELD)();
            }
        }
    }

    // abstract
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static nextTurnItems(p5, playBoard) {
    }

    // abstract
    /**
     *
     * @param p5
     * @param code
     * @param {PlayBoardLike} playBoard
     */
    static modifyBoard(p5, playBoard, code) {
    }

    // abstract
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static setFloatingWindow(p5, playBoard) {
    }

    static resize() {

    }
}

class PlayBoardSerializer {
    static setup(bundle) {
        /**  @type {typeof BoardSerializer} */
        PlayBoardSerializer.BoardSerializer = bundle.BoardSerializer;
        /**  @type {typeof InventorySerializer} */
        PlayBoardSerializer.InventorySerializer = bundle.InventorySerializer;
        /** @type {typeof MovableSerializer} */
        PlayBoardSerializer.MovableSerializer = bundle.MovableSerializer;
        /** @type {typeof BoardLogic} */
        PlayBoardSerializer.BoardLogic = bundle.BoardLogic;
    }

    // stringify - undo
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static stringify(playBoard) {
        let status = {
            boardObjects: PlayBoardSerializer.BoardSerializer.stringify(playBoard.boardObjects),
            inventory: PlayBoardSerializer.InventorySerializer.stringify(playBoard.gameState.inventory),
            movables: JSON.stringify(playBoard.movables.map(movable => PlayBoardSerializer.MovableSerializer.stringify(movable))),
            actionPoints: playBoard.actionPoints,
            maxActionPoints: playBoard.maxActionPoints,
        }
        playBoard.undoStack.push(JSON.stringify(status));
        return status;
    }

    // saveGame - loadGame
    /**
     *
     * @param {PlayBoardLike} playBoard
     */
    static saveGame(playBoard) {
        let status = PlayBoardSerializer.stringify(playBoard);
        status.stageGroup = playBoard.stageGroup;
        status.stageNumbering = playBoard.stageNumbering;
        status.turn = playBoard.turn;
        status.tmpInventoryItems = Array.from(playBoard.tmpInventoryItems.entries());
        if (playBoard.snowfields !== undefined) {
            status.snowfields = JSON.stringify(playBoard.snowfields);
        }
        if (playBoard.fertilized !== undefined) {
            status.fertilized = JSON.stringify(playBoard.fertilized);
        }
        return JSON.stringify(status);
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
        playBoard.boardObjects = PlayBoardSerializer.BoardSerializer.parse(status.boardObjects, p5);
        // reset action points
        playBoard.maxActionPoints = status.maxActionPoints;
        playBoard.actionPoints = status.actionPoints;
        // reset plant skills
        PlayBoardLogic.reevaluatePlantSkills(playBoard);
        // reset ecosystem
        PlayBoardSerializer.BoardLogic.setEcosystem(playBoard.boardObjects);
        // reset inventory
        PlayBoardSerializer.InventorySerializer.parse(status.inventory, p5, playBoard.gameState.inventory);

        // reset movables, need to put movable with cell to the correct cell
        playBoard.movables = JSON.parse(status.movables).map(json => {
            return PlayBoardSerializer.MovableSerializer.parse(json, playBoard);
        });
        for (let movable of playBoard.movables) {
            if (movable.cell) {
                movable.cell.enemy = movable;
            }
        }
    }

    /**
     *
     * @param p5
     * @param {GameState} gameState
     * @param status
     */
    static loadGame(p5, gameState, status) {
        let statusObject = JSON.parse(status);
        let stagePackage = gameState.gsf.stageClasses[statusObject.stageGroup][statusObject.stageNumbering - 1];
        gameState.gsf.wiringUp(stagePackage, PlayBoardModel, PlayBoardLogic);
        let playBoard = new PlayBoardModel(p5, gameState);
        playBoard.undoStack.push(status);
        PlayBoardSerializer.undo(p5, playBoard);
        playBoard.turn = statusObject.turn;
        playBoard.buttons.find(button => button.text.toLowerCase().includes("turn")).text = PlayBoardModel.getTurnButtonText(playBoard);
        playBoard.tmpInventoryItems = new Map(statusObject.tmpInventoryItems);
        //if (playBoard.snowfields) playBoard.snowfields = JSON.parse(statusObject.snowfields);
        //if (playBoard.fertilized) playBoard.fertilized = JSON.parse(statusObject.fertilized);
        return playBoard;
    }
}

export {PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer};

if (typeof module !== 'undefined') {
    module.exports = {PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer};
}