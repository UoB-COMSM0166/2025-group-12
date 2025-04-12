/**
 * @implements {MovableLike}
 */
export class BlizzardModel {
    constructor(p5, playBoard, superModel, itemTypes, movableTypes, countdown = 0, x = -1, y = -1) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "Blizzard";
        this.movableType = movableTypes.BLIZZARD;
        this.status = true;

        /** @type {CellModel} */
        this.cell = null;
        this.countdown = countdown;
        this.isMoving = false;
        this.hasMoved = true;

        this.playAnimation = 0;

        if (this.countdown > 0) {
            this.img = p5.images.get("Alert");
        } else {
            this.img = p5.images.get(`${this.name}`);
        }
    }

    static create(p5, playBoard, superModel, i, j, countdown = 0) {
        let blizzard = new BlizzardModel(p5, playBoard, superModel, BlizzardLogic.itemTypes, BlizzardLogic.movableTypes, countdown);
        blizzard.cell = BlizzardLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
        playBoard.movables.push(blizzard);
        return blizzard;
    }
}

export class BlizzardRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        BlizzardRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof BoardLogic} */
        BlizzardRenderer.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BlizzardModel} blizzard
     */
    static draw(p5, playBoard, blizzard) {
        let imgSize = BlizzardRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
        // draw 9 images
        let cells = BlizzardRenderer.BoardLogic.getAdjacent8Cells(blizzard.cell.i, blizzard.cell.j, playBoard.boardObjects);
        cells.push(blizzard.cell);

        for (let cell of cells) {
            let [avgX, avgY] = BlizzardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, cell.i, cell.j, p5.CENTER);
            p5.image(blizzard.img, avgX - imgSize / 2, avgY - imgSize / 2, imgSize, imgSize);
        }
    }
}

export class BlizzardLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        BlizzardLogic.utilityClass = bundle.utilityClass;
        BlizzardLogic.baseType = bundle.baseType;
        BlizzardLogic.itemTypes = bundle.itemTypes;
        BlizzardLogic.plantTypes = bundle.plantTypes;
        BlizzardLogic.terrainTypes = bundle.terrainTypes;
        BlizzardLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        BlizzardLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        BlizzardLogic.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BlizzardModel} blizzard
     */
    static movements(p5, playBoard, blizzard) {
        if (!blizzard.status) {
            return false;
        }
        // end movement
        if (blizzard.isMoving && blizzard.playAnimation >= 100) {
            let cells = BlizzardLogic.BoardLogic.getAdjacent8Cells(blizzard.cell.i, blizzard.cell.j, playBoard.boardObjects);
            cells.push(blizzard.cell);
            for (let cell of cells) {
                BlizzardLogic.hit(p5, playBoard, cell);
            }
            blizzard.isMoving = false;
            blizzard.hasMoved = true;
            BlizzardLogic.InteractionLogic.findMovableAndDelete(playBoard, blizzard);
            return true;
        }
        // during movement
        if (blizzard.isMoving && blizzard.playAnimation < 100) {
            // play animation placeholder
            blizzard.playAnimation += 5;
            return true;
        }
        // before movement
        if (blizzard.countdown > 0) {
            blizzard.countdown--;
            blizzard.hasMoved = true;
            if (blizzard.countdown <= 1) blizzard.img = p5.images.get(`${blizzard.name}`);
            return false;
        }
        if (blizzard.countdown === 0) {
            blizzard.isMoving = true;
            blizzard.img = p5.images.get(`${blizzard.name}`);
            return true;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     */
    static hit(p5, playBoard, cell) {
        if (cell.ecosystem?.withstandSnow) return;

        if (cell.plant) BlizzardLogic.InteractionLogic.plantIsAttacked(playBoard, cell.plant, 1);

        if (cell.seed) BlizzardLogic.InteractionLogic.plantIsAttacked(playBoard, cell.seed, 1);
    }
}

