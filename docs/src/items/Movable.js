/**
 * @typedef {Object} MovableLike
 * @property {number} type
 * @property {number} movableType
 * @property {number} x
 * @property {number} y
 * @property {boolean} isMoving
 * @property {boolean} hasMoved
 */

class MovableModel {
    constructor(itemTypes, x = -1, y = -1) {
        this.x = x;
        this.y = y;
        this.type = itemTypes.ENEMY;

        this.isMoving = false;
        this.hasMoved = true;
    }
}

class MovableRenderer {
    static setup(bundle) {
        MovableRenderer.p5 = bundle.p5;
        MovableRenderer.movableTypes = bundle.movableTypes;
        /** @type {typeof EarthquakeRenderer} */
        MovableRenderer.EarthquakeRenderer = bundle.EarthquakeRenderer;
        /** @type {typeof SlideRenderer} */
        MovableRenderer.SlideRenderer = bundle.SlideRenderer;
        /** @type {typeof TsunamiRenderer} */
        MovableRenderer.TsunamiRenderer = bundle.TsunamiRenderer;
        /** @type {typeof VolcanicBombRenderer} */
        MovableRenderer.VolcanicBombRenderer = bundle.VolcanicBombRenderer;
        /** @type {typeof BlizzardRenderer} */
        MovableRenderer.BlizzardRenderer = bundle.BlizzardRenderer;
        /** @type {typeof TornadoRenderer} */
        MovableRenderer.TornadoRenderer = bundle.TornadoRenderer;
        /** @type {typeof BanditRenderer} */
        MovableRenderer.BanditRenderer = bundle.BanditRenderer;
    }

    /**
     *
     * @param p5
     * @param {TornadoModel} tornado
     */
    static drawDirection(p5, tornado) {
        MovableRenderer.TornadoRenderer.drawDirection(p5, tornado);
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {MovableLike} movable
     */
    static draw(playBoard, movable) {
        let p5 = MovableRenderer.p5;
        if (movable.movableType === MovableRenderer.movableTypes.EARTHQUAKE) {
            MovableRenderer.EarthquakeRenderer.draw(p5);
        } else if (movable.movableType === MovableRenderer.movableTypes.SLIDE) {
            MovableRenderer.SlideRenderer.draw(p5);
        } else if (movable.movableType === MovableRenderer.movableTypes.TSUNAMI) {
            MovableRenderer.TsunamiRenderer.draw(p5, playBoard, /** @type {TsunamiModel} */ movable);
        } else if (movable.movableType === MovableRenderer.movableTypes.BOMB) {
            MovableRenderer.VolcanicBombRenderer.draw(p5, playBoard, /** @type {VolcanicBombModel} */ movable);
        } else if (movable.movableType === MovableRenderer.movableTypes.BLIZZARD) {
            MovableRenderer.BlizzardRenderer.draw(p5, playBoard, /** @type {BlizzardModel} */ movable);
        } else if (movable.movableType === MovableRenderer.movableTypes.TORNADO) {
            MovableRenderer.TornadoRenderer.draw(p5, playBoard, /** @type {TornadoModel} */ movable);
        } else if (movable.movableType === MovableRenderer.movableTypes.BANDIT) {
            MovableRenderer.BanditRenderer.draw(p5, playBoard, /** @type {BanditModel} */ movable);
        } else {
            console.warn("Unknown type of movable, skipped rendering!");
        }
    }
}

class MovableLogic {
    static setup(bundle) {
        MovableSerializer.movableTypes = bundle.movableTypes;
        /** @type {typeof EarthquakeLogic} */
        MovableLogic.EarthquakeLogic = bundle.EarthquakeLogic;
        /** @type {typeof SlideLogic} */
        MovableLogic.SlideLogic = bundle.SlideLogic;
        /** @type {typeof TsunamiLogic} */
        MovableLogic.TsunamiLogic = bundle.TsunamiLogic;
        /** @type {typeof VolcanicBombLogic} */
        MovableLogic.VolcanicBombLogic = bundle.VolcanicBombLogic;
        /** @type {typeof BlizzardLogic} */
        MovableLogic.BlizzardLogic = bundle.BlizzardLogic;
        /** @type {typeof TornadoLogic} */
        MovableLogic.TornadoLogic = bundle.TornadoLogic;
        /** @type {typeof BanditLogic} */
        MovableLogic.BanditLogic = bundle.BanditLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {MovableLike} movable
     */
    static movements(p5, playBoard, movable) {
        switch (movable.movableType) {
            case MovableSerializer.movableTypes.BANDIT:
                return MovableLogic.BanditLogic.movements(p5, playBoard, /** @type {BanditModel} */ movable);
            case MovableSerializer.movableTypes.TORNADO:
                return MovableLogic.TornadoLogic.movements(p5, playBoard, /** @type {TornadoModel} */ movable);
            case MovableSerializer.movableTypes.BOMB:
                return MovableLogic.VolcanicBombLogic.movements(p5, playBoard, /** @type {VolcanicBombModel} */ movable);
            case MovableSerializer.movableTypes.SLIDE:
                return MovableLogic.SlideLogic.movements(p5, playBoard, /** @type {SlideModel} */ movable);
            case MovableSerializer.movableTypes.EARTHQUAKE:
                return MovableLogic.EarthquakeLogic.movements(p5, playBoard, /** @type {EarthquakeModel} */ movable);
            case MovableSerializer.movableTypes.BLIZZARD:
                return MovableLogic.BlizzardLogic.movements(p5, playBoard, /** @type {BlizzardModel} */ movable);
            case MovableSerializer.movableTypes.TSUNAMI:
                return MovableLogic.TsunamiLogic.movements(p5, playBoard, /** @type {TsunamiModel} */ movable);
            default:
                console.error("Unknown movable type", movable.movableType);
                return false;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param dest_i
     * @param dest_j
     */
    static generateSlide(p5, playBoard, dest_i = 5, dest_j = null) {
        MovableLogic.SlideLogic.generateSlide(p5, playBoard, MovableModel, dest_i, dest_j);
    }
}

class MovableSerializer {

    static setup(bundle) {
        MovableSerializer.movableTypes = bundle.movableTypes;
        MovableSerializer.movableFactory = bundle.movableFactory;
        /** @type {typeof BoardLogic} */
        MovableSerializer.BoardLogic = bundle.BoardLogic;
    }

    static stringify(movable) {
        if (!movable.movableType) {
            console.error(`movable ${movable} does not have movable type field!`);
        }
        let object;
        switch (movable.movableType) {
            case MovableSerializer.movableTypes.BANDIT:
                /** @type {BanditModel} */
                let bandit = movable;
                object = {
                    movableType: bandit.movableType,
                    health: bandit.health,
                    cellX: bandit.cell?.i,
                    cellY: bandit.cell?.j,
                    targetCellX: bandit.targetCell?.i,
                    targetCellY: bandit.targetCell?.j,
                }
                break;
            case MovableSerializer.movableTypes.TORNADO:
                /** @type {TornadoModel} */
                let tornado = movable;
                let d;
                if (tornado.direction[0] === 0 && tornado.direction[1] === -1) d = 'u';
                if (tornado.direction[0] === 0 && tornado.direction[1] === 1) d = 'd';
                if (tornado.direction[0] === -1 && tornado.direction[1] === 0) d = 'l';
                if (tornado.direction[0] === 1 && tornado.direction[1] === 0) d = 'r';
                object = {
                    movableType: tornado.movableType,
                    health: tornado.health,
                    direction: d,
                    cellX: tornado.cell?.i,
                    cellY: tornado.cell?.j,
                    countdown: tornado.countdown,
                }
                break;
            case MovableSerializer.movableTypes.BOMB:
                /** @type {VolcanicBombModel} */
                let bomb = movable;
                object = {
                    movableType: bomb.movableType,
                    i1: bomb.i1,
                    j1: bomb.j1,
                    i2: bomb.i2,
                    j2: bomb.j2,
                    x1: bomb.x1,
                    y1: bomb.y1,
                    x2: bomb.x2,
                    y2: bomb.y2,
                    countdown: bomb.countdown,
                }
                break;
            case MovableSerializer.movableTypes.SLIDE:
                /** @type {SlideModel} */
                let slide = movable;
                object = {
                    movableType: slide.movableType,
                    cellX: slide.cell?.i,
                    cellY: slide.cell?.j,
                    finalCellX: slide.finalCell?.i,
                    finalCellY: slide.finalCell?.j,
                }
                break;
            case MovableSerializer.movableTypes.EARTHQUAKE:
                object = {
                    movableType: /** @type {EarthquakeModel} */ movable.movableType,
                }
                break;
            case MovableSerializer.movableTypes.BLIZZARD:
                /** @type {BlizzardModel} */
                let blizzard = movable;
                object = {
                    movableType: blizzard.movableType,
                    countdown: blizzard.countdown,
                    cellX: blizzard.cell?.i,
                    cellY: blizzard.cell?.j,
                }
                break;
            case MovableSerializer.movableTypes.TSUNAMI:
                /** @type {TsunamiModel} */
                let tsunami = movable;
                object = {
                    movableType: tsunami.movableType,
                    startCol: tsunami.startCol,
                    startRow: tsunami.startRow,
                    range: tsunami.range[0],
                    blockerLimit: tsunami.blockerLimit[0],
                }
                break;
            default:
                console.error("Unknown movable type", movable.movableType);
                return "";
        }
        return JSON.stringify(object);
    }

    /**
     *
     * @param json
     * @param {PlayBoardLike} playBoard
     */
    static parse(json, playBoard) {
        let movable = JSON.parse(json);
        switch (movable.movableType) {
            case MovableSerializer.movableTypes.BANDIT:
                let bandit = MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.BANDIT)(playBoard, movable.cellX, movable.cellY);
                bandit.health = movable.health;
                if (movable.targetCellX != null && movable.targetCellY != null) {  // != null checks both null and undefined
                    bandit.targetCell = MovableSerializer.BoardLogic.getCell(movable.targetCellX, movable.targetCellY, playBoard.boardObjects);
                }
                return bandit;
            case MovableSerializer.movableTypes.TORNADO:
                let tornado = MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.TORNADO)(playBoard, MovableModel, movable.cellX, movable.cellY, movable.direction, movable.countdown)
                tornado.health = movable.health;
                return tornado;
            case MovableSerializer.movableTypes.BOMB:
                return MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.BOMB)(playBoard, movable.i1, movable.j1, movable.i2, movable.j2, movable.x1, movable.y1, movable.x2, movable.y2, movable.countdown);
            case MovableSerializer.movableTypes.SLIDE:
                return MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.SLIDE)(playBoard, movable.cellX, movable.cellY, movable.finalCellX, movable.finalCellY);
            case MovableSerializer.movableTypes.EARTHQUAKE:
                return MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.EARTHQUAKE)(playBoard);
            case MovableSerializer.movableTypes.BLIZZARD:
                return MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.BLIZZARD)(playBoard, movable.cellX, movable.cellY, movable.countdown);
            case MovableSerializer.movableTypes.TSUNAMI:
                return MovableSerializer.movableFactory.get(MovableSerializer.movableTypes.TSUNAMI)(playBoard, movable.startCol, movable.startRow, movable.range, movable.blockerLimit);
            default:
                console.warn("Unknown enemy type", movable.movableType);
                return null;
        }

    }
}

export {MovableModel, MovableLogic, MovableRenderer, MovableSerializer};

if (typeof module !== 'undefined') {
    module.exports = {MovableModel, MovableLogic, MovableRenderer, MovableSerializer};
}