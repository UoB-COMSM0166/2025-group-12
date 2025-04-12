/**
 * @typedef {Object} MovableLike
 * @property {number} type
 * @property {number} movableType
 * @property {number} x
 * @property {number} y
 * @property {boolean} isMoving
 * @property {boolean} hasMoved
 */

export class MovableModel {
    constructor(itemTypes, x = -1, y = -1) {
        this.x = x;
        this.y = y;
        this.type = itemTypes.ENEMY;

        this.isMoving = false;
        this.hasMoved = true;
    }
}

export class MovableRenderer {
    static setup(bundle) {
        MovableSerializer.p5 = bundle.p5;
        MovableSerializer.movableTypes = bundle.movableTypes;
        /** @type {typeof EarthquakeRenderer} */
        MovableSerializer.EarthquakeRenderer = bundle.EarthquakeRenderer;
        /** @type {typeof SlideRenderer} */
        MovableSerializer.SlideRenderer = bundle.SlideRenderer;
        /** @type {typeof TsunamiRenderer} */
        MovableSerializer.TsunamiRenderer = bundle.TsunamiRenderer;
        /** @type {typeof VolcanicBombRenderer} */
        MovableSerializer.VolcanicBombRenderer = bundle.VolcanicBombRenderer;
        /** @type {typeof BlizzardRenderer} */
        MovableSerializer.BlizzardRenderer = bundle.BlizzardRenderer;
        /** @type {typeof TornadoRenderer} */
        MovableSerializer.TornadoRenderer = bundle.TornadoRenderer;
        /** @type {typeof BanditRenderer} */
        MovableSerializer.BanditRenderer = bundle.BanditRenderer;

    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {MovableLike} movable
     */
    static draw(playBoard, movable) {
        let p5 = MovableSerializer.p5;
        if(movable.movableType === MovableSerializer.movableTypes.EARTHQUAKE){
            MovableSerializer.EarthquakeRenderer.draw(p5);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.SLIDE){
            MovableSerializer.SlideRenderer.draw(p5);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.TSUNAMI){
            MovableSerializer.TsunamiRenderer.draw(p5, playBoard, /** @type {TsunamiModel} */ movable);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.BOMB){
            MovableSerializer.VolcanicBombRenderer.draw(p5, /** @type {VolcanicBombModel} */ movable);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.BLIZZARD){
            MovableSerializer.BlizzardRenderer.draw(p5, playBoard, /** @type {BlizzardModel} */ movable);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.TORNADO){
            MovableSerializer.TornadoRenderer.draw(p5, /** @type {TornadoModel} */ movable);
        }
        else if(movable.movableType === MovableSerializer.movableTypes.BANDIT){
            MovableSerializer.BanditRenderer.draw(p5, /** @type {BanditModel} */ movable);
        }else{
            console.warn("Unknown type of movable, skipped rendering!");
        }
    }
}

export class MovableLogic {
    static setup(bundle) {}
}

export class MovableSerializer {

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
                let bandit = MovableSerializer.movableFactory.get("Bandit")(playBoard, movable.cellX, movable.cellY);
                bandit.health = movable.health;
                if (movable.targetCellX != null && movable.targetCellY != null) {  // != null checks both null and undefined
                    bandit.targetCell = MovableSerializer.BoardLogic.getCell(movable.targetCellX, movable.targetCellY, playBoard.boardObjects);
                }
                return bandit;
            case MovableSerializer.movableTypes.TORNADO:
                let tornado = MovableSerializer.movableFactory.get("Tornado")(playBoard, MovableModel, movable.cellX, movable.cellY, movable.direction, movable.countdown)
                tornado.health = movable.health;
                return tornado;
            case MovableSerializer.movableTypes.BOMB:
                return MovableSerializer.movableFactory.get("VolcanicBomb")(playBoard, movable.i1, movable.j1, movable.i2, movable.j2, movable.x1, movable.y1, movable.x2, movable.y2, movable.countdown);
            case MovableSerializer.movableTypes.SLIDE:
                return MovableSerializer.movableFactory.get("SlideAnimation")(playBoard, movable.cellX, movable.cellY, movable.finalCellX, movable.finalCellY);
            case MovableSerializer.movableTypes.EARTHQUAKE:
                return MovableSerializer.movableFactory.get("Earthquake")(playBoard);
            case MovableSerializer.movableTypes.BLIZZARD:
                return MovableSerializer.movableFactory.get("Blizzard")(playBoard, movable.cellX, movable.cellY, movable.countdown);
            case MovableSerializer.movableTypes.TSUNAMI:
                return MovableSerializer.movableFactory.get("TsunamiAnimation")(playBoard, movable.startCol, movable.startRow, movable.range, movable.blockerLimit);
            default:
                console.warn("Unknown enemy type", movable.movableType);
                return null;
        }

    }
}