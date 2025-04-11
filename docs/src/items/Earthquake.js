/**
 * @implements {MovableLike}
 */
export class EarthquakeModel {
    /**
     * @param p5
     * @param {typeof MovableModel} superModel
     * @param itemTypes
     * @param movableTypes
     * @param x
     * @param y
     */
    constructor(p5, superModel, itemTypes, movableTypes, x = -1, y = -1) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "Earthquake";
        this.movableType = movableTypes.EARTHQUAKE;
        this.status = true;

        this.isShaking = false;

        this.shakeDuration = 60;
        this.startFrame = 0;
    }

    static create(p5, playBoard, superModel, x = -1, y = -1) {
        let earthquake = new EarthquakeModel(p5, superModel, EarthquakeLogic.itemTypes, EarthquakeLogic.movableTypes, x, y);
        playBoard.movables.push(earthquake);
    }
}

export class EarthquakeRenderer {
    static draw(p5) {
    }
}

export class EarthquakeLogic {
    static setup(bundle){
        EarthquakeLogic.InteractionLogic = bundle.InteractionLogic;
        EarthquakeLogic.baseType = bundle.baseType;
        EarthquakeLogic.plantTypes = bundle.plantTypes;
        EarthquakeLogic.itemTypes = bundle.itemTypes;
        EarthquakeLogic.terrainTypes = bundle.terrainTypes;
        EarthquakeLogic.movableTypes = bundle.movableTypes;
        /** @type {typeof BoardLogic} */
        EarthquakeLogic.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {EarthquakeModel} earthquake
     */
    static movements(p5, playBoard, earthquake) {
        if (!earthquake.status || earthquake.hasMoved) {
            return false;
        }
        // end movement
        if (earthquake.isMoving && !earthquake.isShaking) {
            earthquake.isMoving = false;
            earthquake.hasMoved = true;
            earthquake.status = false;
            EarthquakeLogic.hit(p5, playBoard);
            EarthquakeLogic.InteractionLogic.findMovableAndDelete(playBoard, earthquake);
            return false;
        }
        // during movement
        if (earthquake.isMoving && earthquake.isShaking) {
            EarthquakeLogic.shake(p5, earthquake);
            return true;
        }
        // before movement
        earthquake.isMoving = true;
        earthquake.isShaking = true;
        earthquake.shakeDuration = 60;
        earthquake.startFrame = p5.frameCount;
        return true;
    }

    /**
     *
     * @param p5
     * @param {EarthquakeModel} earthquake
     */
    static shake(p5, earthquake) {
        let shakeAmount = 10;
        let shakeX = p5.random(-shakeAmount, shakeAmount);
        let shakeY = p5.random(-shakeAmount, shakeAmount);
        p5.translate(shakeX, shakeY);

        // Stop shaking after a duration
        if (p5.frameCount > earthquake.startFrame + earthquake.shakeDuration) {
            earthquake.isShaking = false;
        }
    }

    // deal damage to all trees
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static hit(p5, playBoard) {
        for (let cwp of EarthquakeLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects)) {
            if (EarthquakeLogic.baseType(cwp.plant) === EarthquakeLogic.plantTypes.TREE) {
                EarthquakeLogic.InteractionLogic.plantIsAttacked(playBoard, cwp.plant, 1);
            }
        }
    }
}