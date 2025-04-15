/**
 * @implements {MovableLike}
 */
class TornadoModel {
    constructor(p5, superModel, itemTypes, movableTypes, x, y, direction, countdown = 0) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "Tornado";
        this.movableType = movableTypes.TORNADO;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        if (direction === 'u') {
            this.direction = [0, -1];
        } else if (direction === 'd') {
            this.direction = [0, 1];
        } else if (direction === 'l') {
            this.direction = [-1, 0];
        } else if (direction === 'r') {
            this.direction = [1, 0];
        } else {
            console.error(`invalid direction ${direction} of Tornado`);
            return;
        }

        /** @type {CellModel} */
        this.cell = null;
        this.countdown = countdown;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 5;

        if (this.countdown > 0) {
            this.img = p5.images.get("Alert");
        } else {
            this.img = p5.images.get(`${this.name}`);
        }
    }

    static create(p5, playBoard, superModel, i, j, direction, countdown = 0) {
        let cell = TornadoLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
        if (cell.enemy !== null) {
            return cell.enemy;
        }
        let [avgX, avgY] = TornadoLogic.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);
        let tornado = new TornadoModel(p5, superModel, TornadoLogic.itemTypes, TornadoLogic.movableTypes, avgX, avgY, direction, countdown);
        playBoard.movables.push(tornado);
        cell.enemy = tornado;
        tornado.cell = cell;
        return tornado;
    }
}

class TornadoRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        TornadoRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof BoardLogic} */
        TornadoRenderer.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param p5
     * @param {TornadoModel} tornado
     */
    static drawDirection(p5, tornado) {
        let direction = tornado.direction;
        let x = tornado.x;
        let y = tornado.y;
        let angle;
        if (direction[0] === 0 && direction[1] === -1) {
            angle = p5.radians(330); // Up-right
        } else if (direction[0] === 0 && direction[1] === 1) {
            angle = p5.radians(150); // Down-left
        } else if (direction[0] === -1 && direction[1] === 0) {
            angle = p5.radians(210); // Up-left
        } else if (direction[0] === 1 && direction[1] === 0) {
            angle = p5.radians(30); // Down-right
        }
        let offset = 10;
        let dx = offset * Math.cos(angle);
        let dy = offset * Math.sin(angle);
        p5.push();
        p5.translate(x + dx, y + dy);
        p5.rotate(angle + p5.HALF_PI);
        p5.imageMode(p5.CENTER);
        p5.image(p5.images.get("alertArrow"), 0, 0, 30, 30);
        p5.pop();
    }

    /**
     *
     * @param p5
     * @param {TornadoModel} tornado
     */
    static draw(p5, tornado) {
        let imgSize = TornadoRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
        p5.image(tornado.img, tornado.x - imgSize / 2, tornado.y - imgSize, imgSize, imgSize);
    }
}

class TornadoLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        TornadoLogic.utilityClass = bundle.utilityClass;
        TornadoLogic.baseType = bundle.baseType;
        TornadoLogic.itemTypes = bundle.itemTypes;
        TornadoLogic.plantTypes = bundle.plantTypes;
        TornadoLogic.terrainTypes = bundle.terrainTypes;
        TornadoLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        TornadoLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        TornadoLogic.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param playBoard
     * @param {TornadoModel} tornado
     */
    static movements(p5, playBoard, tornado) {
        if (!tornado.status) {
            return false;
        }
        if (tornado.isMoving) {
            TornadoLogic.moveAndInvokeTornado(p5, playBoard, tornado);
            return true;
        }
        if (tornado.countdown > 0) {
            tornado.countdown--;
            tornado.hasMoved = true;
            if (tornado.countdown <= 1) tornado.img = p5.images.get(`${tornado.name}`);
            return false;
        }
        if (tornado.countdown === 0) {
            if (tornado.cell !== null) {
                tornado.cell.enemy = null;
                tornado.cell = null;
            }
            tornado.isMoving = true;
            tornado.img = p5.images.get(`${tornado.name}`);
            TornadoLogic.moveAndInvokeTornado(p5, playBoard, tornado);
            return true;
        }
    }

    // priority and logic of Tornado interactions:
    // 1. check current cell to perform Tornado-terrain interaction.
    // 2. check extended trees' existence, and randomly pick one lucky tree.
    // 3. check current cell to attack plant or seed.
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {TornadoModel} tornado
     */
    static moveAndInvokeTornado(p5, playBoard, tornado) {
        let [dx, dy] = tornado.direction;
        let oldX = TornadoLogic.utilityClass.oldCoorX(playBoard, tornado.x, tornado.y) + tornado.moveSpeed * dx;
        let oldY = TornadoLogic.utilityClass.oldCoorY(playBoard, tornado.x, tornado.y) + tornado.moveSpeed * dy;
        let newX = TornadoLogic.utilityClass.newCoorX(playBoard, oldX, oldY);
        let newY = TornadoLogic.utilityClass.newCoorY(playBoard, oldX, oldY);
        tornado.x = newX;
        tornado.y = newY;

        // call interaction when Tornado overlays with plant (cell level)
        let index = TornadoLogic.utilityClass.pos2CellIndex(playBoard, tornado.x, tornado.y);
        if (index[0] !== -1) {
            let cell = TornadoLogic.BoardLogic.getCell(index[0], index[1], playBoard.boardObjects);
            // 1. check current cell to perform Tornado-terrain interaction.
            if (cell.terrain.terrainType === TornadoLogic.terrainTypes.MOUNTAIN) {
                tornado.status = false;
                TornadoLogic.InteractionLogic.findMovableAndDelete(playBoard, tornado);
                console.log("return1")
                return;
            }

            // 2. check extended trees' existence, and randomly pick one lucky tree.
            let cells = TornadoLogic.BoardLogic.getAdjacent4Cells(index[0], index[1], playBoard.boardObjects);
            let trees = [];
            for (let adCell of cells) {
                if (adCell !== null && adCell.plant !== null && adCell.plant.plantType === TornadoLogic.plantTypes.PINE) {
                    if (adCell.plant.hasExtended === true && adCell.plant.status === true) {
                        trees.push(adCell.plant);
                    }
                }
            }
            if (trees.length > 0) {
                let luckyTree = trees[Math.floor(Math.random() * trees.length)];
                TornadoLogic.InteractionLogic.plantAttackedByTornado(playBoard, luckyTree, tornado);
                console.log("return2")
                return;
            }

            // 3. check current cell to attack plant or seed.
            if (tornado.status === true) {
                if (cell.plant !== null && cell.plant.status === true) {
                    TornadoLogic.InteractionLogic.plantAttackedByTornado(playBoard, cell.plant, tornado);
                } else if (cell.seed !== null) {
                    TornadoLogic.InteractionLogic.plantAttackedByTornado(playBoard, cell.seed, tornado);
                }
            }

            // 4. if player base is at the cell, destroy it.
            if (cell.terrain.terrainType === TornadoLogic.terrainTypes.BASE) {
                TornadoLogic.utilityClass.gameOver(playBoard);
                return;
            }

            // 5. if a bandit is at the cell, dies.
            if (cell.enemy && cell.enemy.name === "Bandit") {
                cell.enemy.health = 0;
                cell.enemy.status = false;
                TornadoLogic.InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
                cell.enemy = null;
            }

        }

        // if the tornado goes out of the grid, it dies anyway.
        if (index[0] === -1) {
            tornado.status = false;
            TornadoLogic.InteractionLogic.findMovableAndDelete(playBoard, tornado);
        }
    }
}

export {TornadoModel, TornadoLogic, TornadoRenderer};

if (typeof module !== 'undefined') {
    module.exports = {TornadoModel, TornadoLogic, TornadoRenderer};
}