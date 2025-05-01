/**
 * @implements {MovableLike}
 */
class TsunamiModel {
    constructor(p5, playBoard, superModel, itemTypes, movableTypes, startCol, startRow, range = 1, blockerLimit = 3, x = -1, y = -1) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "TsunamiAnimation";
        this.movableType = movableTypes.TSUNAMI;
        this.img = this.img = p5.images.get(`${this.name}`);

        this.startCol = startCol;
        this.startRow = startRow;

        this.gridSize = playBoard.gridSize;

        // maximum range able to reach
        this.range = Array.from({length: this.gridSize}, () => range);

        // 0 <= moved length[i] <= this.range[i]
        this.movedLength = Array.from({length: this.gridSize}, () => 0);

        // when blocker[i] -> 0, decrease range[i] by 1
        this.blockerLimit = blockerLimit;
        this.blocker = Array.from({length: this.gridSize}, () => this.blockerLimit);

        // loop through this to end moving
        this.isMovingArray = Array.from({length: this.gridSize}, () => false);

        this.isMoving = false;
        this.hasMoved = true;

        this.accumulate = 0;
    }

    static create(p5, playBoard, superModel, startCol, startRow, range = 1, blockerLimit = 3) {
        let tsunami = new TsunamiModel(p5, playBoard, superModel, TsunamiLogic.itemTypes, TsunamiLogic.movableTypes, startCol, startRow, range, blockerLimit);
        playBoard.movables.push(tsunami);
        return tsunami;
    }
}

class TsunamiRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        TsunamiRenderer.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {TsunamiModel} tsunami
     */
    static draw(p5, playBoard, tsunami) {
        let imgSize = Math.min(playBoard.cellWidth, playBoard.cellHeight) / 2;
        if (tsunami.startCol !== -1) {
            for (let i = 0; i < tsunami.gridSize; i++) {
                for (let j = 0; j <= tsunami.movedLength[i]; j++) {
                    let [avgX, avgY] = TsunamiRenderer.utilityClass.cellIndex2Pos(p5, playBoard, i, tsunami.startCol + j, p5.CENTER);
                    p5.image(tsunami.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
                }
            }
        } else {
            for (let j = 0; j < tsunami.gridSize; j++) {
                for (let i = 0; i <= tsunami.movedLength[j]; i++) {
                    let [avgX, avgY] = TsunamiRenderer.utilityClass.cellIndex2Pos(p5, playBoard, tsunami.startRow + i, j, p5.CENTER);
                    p5.image(tsunami.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
                }
            }
        }
    }
}

class TsunamiLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        TsunamiLogic.utilityClass = bundle.utilityClass;
        TsunamiLogic.baseType = bundle.baseType;
        TsunamiLogic.itemTypes = bundle.itemTypes;
        TsunamiLogic.plantTypes = bundle.plantTypes;
        TsunamiLogic.terrainTypes = bundle.terrainTypes;
        TsunamiLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        TsunamiLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        TsunamiLogic.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param {TsunamiModel} tsunami
     */
    static checkIsMoving(tsunami) {
        for (let isMoving of tsunami.isMovingArray) {
            if (isMoving) return true;
        }
        return false;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {TsunamiModel} tsunami
     */
    static movements(p5, playBoard, tsunami) {
        if (tsunami.hasMoved) {
            return false;
        }
        if (tsunami.isMoving) {
            TsunamiLogic.move(p5, playBoard, tsunami);
            return true;
        }
        tsunami.isMoving = true;
        tsunami.isMovingArray = tsunami.isMovingArray.map(value => true);
        return true;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {TsunamiModel} tsunami
     */
    static move(p5, playBoard, tsunami) {
        tsunami.accumulate += 1;
        if (tsunami.accumulate >= 20) {
            TsunamiLogic.slide(p5, playBoard, tsunami);
            tsunami.accumulate = 0;
        }
        if (!tsunami.isMoving) {
            tsunami.hasMoved = true;
            TsunamiLogic.InteractionLogic.findMovableAndDelete(playBoard, tsunami);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {TsunamiModel} tsunami
     */
    static slide(p5, playBoard, tsunami) {
        let gameOver = false;
        for (let i = 0; i < tsunami.isMovingArray.length; i++) {
            if (tsunami.isMovingArray[i]) {
                if (tsunami.movedLength[i] < tsunami.range[i]) {
                    /** @type {CellModel} */
                    let cell;
                    if (tsunami.startCol !== -1) {
                        cell = TsunamiLogic.BoardLogic.getCell(i, tsunami.startCol + tsunami.movedLength[i] + 1, playBoard.boardObjects);
                        if (cell.terrain.terrainType === TsunamiLogic.terrainTypes.SEA) tsunami.range[i] += 1;
                    } else {
                        cell = TsunamiLogic.BoardLogic.getCell(tsunami.startRow + tsunami.movedLength[i] + 1, i, playBoard.boardObjects);
                        if (cell.terrain.terrainType === TsunamiLogic.terrainTypes.SEA) tsunami.range[i] += 1;
                    }
                    tsunami.movedLength[i] += 1;

                    // interact with plant
                    if (cell.plant || cell.seed) {
                        // decrease max range according to plant health
                        // if the plant is palm, invoke its passive skill
                        if (cell.plant && cell.plant.plantType === TsunamiLogic.plantTypes.PALM) {
                            cell.plant.health--;
                            if (cell.plant.health === 0) {
                                cell.removePlant();
                            }
                            tsunami.range[i] -= 2;
                        }
                        // else, use health to offset range
                        else {
                            let health = cell.seed ? 1 : cell.plant.health;
                            while (health > 0) {
                                tsunami.blocker[i] -= 1;
                                if (tsunami.blocker[i] <= 0) {
                                    tsunami.range[i] -= 1;
                                    tsunami.blocker[i] = tsunami.blockerLimit;
                                }
                                health--;
                            }
                            if (cell.plant) {
                                cell.removePlant();
                                playBoard.fertilized[cell.i][cell.j] = true;
                            }
                            if (cell.seed) {
                                cell.removeSeed();
                                playBoard.fertilized[cell.i][cell.j] = true;
                            }
                        }
                    }

                    // interact with enemy
                    if (cell.enemy?.movableType === TsunamiLogic.movableTypes.BANDIT) {
                        TsunamiLogic.InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
                    }

                    // interact with terrain
                    switch (cell.terrain.terrainType) {
                        case TsunamiLogic.terrainTypes.BASE:
                            gameOver = true;
                            break;
                        case TsunamiLogic.terrainTypes.VOLCANO:
                        case TsunamiLogic.terrainTypes.MOUNTAIN:
                            tsunami.range[i] = 0;
                            break;
                        case TsunamiLogic.terrainTypes.LUMBERING:
                            tsunami.range[i] -= 1;
                            break;
                    }
                } else {
                    tsunami.isMovingArray[i] = false;
                }
            }
            if (gameOver) TsunamiLogic.utilityClass.gameOver(playBoard);
        }

        if (!TsunamiLogic.checkIsMoving(tsunami)) tsunami.isMoving = false;
    }
}

export {TsunamiModel, TsunamiLogic, TsunamiRenderer};

if (typeof module !== 'undefined') {
    module.exports = {TsunamiModel, TsunamiLogic, TsunamiRenderer};
}