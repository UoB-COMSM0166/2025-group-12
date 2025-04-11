/**
 * @typedef {Object} MovableLike
 * @property {number} type
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
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'MovableRenderer',
            impl,
            methods: ['draw']
        });
    }
}

export class MovableLogic {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'MovableLogic',
            impl,
            methods: ['setup', 'movements']
        });
    }
}

export class MovableSerializer {

    static setup(bundle){
        MovableSerializer.movableTypes = bundle.movableTypes;
        MovableSerializer.movableFactory = bundle.movableFactory;
    }

    static stringify(movable) {
        if(!movable.movableType){
            console.error(`movable ${movable} does not have movable type field!`);
        }
        let object;
        switch (movable.movableType) {
            case movableTypes.BANDIT:
                break;
            case movableTypes.TORNADO:
                break;
            case movableTypes.BOMB:
                break;
            case MovableSerializer.movableTypes.SLIDE:
                object = {
                    movableType: movable.movableType,
                    cellX: movable.cell?.x,
                    cellY: movable.cell?.y,
                    finalCellX: movable.finalCell?.x,
                    finalCellY: movable.finalCell?.y,
                }
                break;
            case MovableSerializer.movableTypes.EARTHQUAKE:
                object = {
                    movableType: movable.movableType,
                }
                break;
            case movableTypes.BLIZZARD:
                break;
            case movableTypes.TSUNAMI:
                break;
            default:
                console.error("Unknown movable type", movable.movableType);
                return "";
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, playBoard) {
        let movable = JSON.parse(json);
        switch (movable.movableType) {
            case movableTypes.BANDIT:
                return Bandit.parse(json, p5, this);
            case movableTypes.TORNADO:
                return Tornado.parse(json, p5, this);
            case movableTypes.BOMB:
                return VolcanicBomb.parse(json, p5, this);
            case MovableSerializer.movableTypes.SLIDE:
                return MovableSerializer.movableFactory.get("SlideAnimation")(p5, playBoard, movable.finalCellX, movable.finalCellY);
            case MovableSerializer.movableTypes.EARTHQUAKE:
                return MovableSerializer.movableFactory.get("Earthquake")();
            case movableTypes.BLIZZARD:
                return Blizzard.parse(json, p5, this);
            case movableTypes.TSUNAMI:
                return TsunamiAnimation.parse(json, p5, this);
            default:
                console.warn("Unknown enemy type", movable.movableType);
                return null;
        }

    }
}