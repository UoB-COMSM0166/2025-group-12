/**
 * @implements {MovableLike}
 */
class SlideModel {
    /**
     *
     * @param p5
     * @param {typeof MovableModel} superModel
     * @param itemTypes
     * @param movableTypes
     * @param {CellModel} firstCell
     * @param {CellModel} finalCell
     * @param x
     * @param y
     */
    constructor(p5, superModel, itemTypes, movableTypes, firstCell, finalCell, x = -1, y = -1) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "SlideAnimation";
        this.movableType = movableTypes.SLIDE;

        this.cell = firstCell;
        this.finalCell = finalCell;

        this.accumulate = 0;
    }

    static create(p5, playBoard, superModel, start_i, start_j, dest_i, dest_j) {
        let slide = new SlideModel(p5, superModel, SlideLogic.itemTypes, SlideLogic.movableTypes,
            SlideLogic.BoardLogic.getCell(start_i, start_j, playBoard.boardObjects),
            SlideLogic.BoardLogic.getCell(dest_i, dest_j, playBoard.boardObjects));
        playBoard.movables.push(slide);
        return slide;
    }
}

class SlideRenderer {
    static setup(bundle) {
    }

    static draw(p5) {
    }
}

class SlideLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        SlideLogic.utilityClass = bundle.utilityClass;
        SlideLogic.baseType = bundle.baseType;
        SlideLogic.itemTypes = bundle.itemTypes;
        SlideLogic.plantTypes = bundle.plantTypes;
        SlideLogic.terrainTypes = bundle.terrainTypes;
        SlideLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        SlideLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        SlideLogic.InteractionLogic = bundle.InteractionLogic;

        SlideLogic.terrainFactory = bundle.terrainFactory;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {MovableModel} superModel
     * @param dest_i
     * @param dest_j
     */
    static generateSlide(p5, playBoard, superModel, dest_i, dest_j) {
        let hills = [];
        for (let i = 0; i < playBoard.gridSize; i++) {
            for (let j = 0; j < playBoard.gridSize; j++) {
                let cell = SlideLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
                if (cell.terrain.terrainType === SlideLogic.terrainTypes.HILL && cell.terrain.canSlide) {
                    hills.push(cell);
                }
            }
        }
        let cell = hills[Math.floor(Math.random() * hills.length)];
        for (let adCell of SlideLogic.BoardLogic.getAdjacent8Cells(cell.i, cell.j, playBoard.boardObjects)) {
            if (adCell.plant !== null && SlideLogic.baseType(adCell.plant) === SlideLogic.plantTypes.TREE && adCell.ecosystem !== null) {
                return;
            }
        }
        if (!dest_i) {
            SlideModel.create(p5, playBoard, superModel, cell.i, cell.j, cell.i, dest_j);
        } else if (!dest_j) {
            SlideModel.create(p5, playBoard, superModel, cell.i, cell.j, dest_i, cell.j);
        } else {
            SlideModel.create(p5, playBoard, superModel, cell.i, cell.j, dest_i, dest_j);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {SlideModel} landslide
     */
    static movements(p5, playBoard, landslide) {
        if (landslide.hasMoved) {
            return false;
        }
        if (landslide.isMoving) {
            SlideLogic.move(p5, playBoard, landslide);
            return true;
        }
        landslide.isMoving = true;
        return true;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {SlideModel} landslide
     */
    static move(p5, playBoard, landslide) {
        landslide.accumulate += 1;
        if (landslide.accumulate >= 20) {
            SlideLogic.slide(p5, playBoard, landslide);
            landslide.accumulate = 0;
        }
        if (!landslide.isMoving) {
            landslide.hasMoved = true;
            SlideLogic.InteractionLogic.findMovableAndDelete(playBoard, landslide);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {SlideModel} landslide
     */
    static slide(p5, playBoard, landslide) {
        // some terrain can block landslide
        if (landslide.cell.terrain.terrainType === SlideLogic.terrainTypes.MOUNTAIN
            || landslide.cell.terrain.terrainType === SlideLogic.terrainTypes.VOLCANO) {
            landslide.isMoving = false;
        }

        // kill plants and bandit on this cell:
        if (landslide.cell.plant !== null) landslide.cell.removePlant();
        if (landslide.cell.seed !== null) landslide.cell.removeSeed();
        if (landslide.cell.enemy && landslide.cell.enemy.movableType === SlideLogic.movableTypes.BANDIT) {
            SlideLogic.InteractionLogic.findMovableAndDelete(playBoard, landslide.cell.enemy);
        }

        // if cell is player base, game over.
        if (landslide.cell.terrain.terrainType === SlideLogic.terrainTypes.BASE) {
            SlideLogic.utilityClass.gameOver(playBoard);
            landslide.isMoving = false;
        }

        landslide.cell.terrain = SlideLogic.terrainFactory.get(SlideLogic.terrainTypes.LANDSLIDE)();
        landslide.cell.terrain.layerName = "Landslide" + `${landslide.cell.i % 6}` + `${landslide.cell.j % 3}`;
        landslide.cell.terrain.layer = p5.images.get(landslide.cell.terrain.layerName);
        // place exit condition here to ensure final cell is included
        if (landslide.cell === landslide.finalCell) landslide.isMoving = false;

        // find next cell
        let direction = [0, 0];
        if (landslide.finalCell.i - landslide.cell.i !== 0) {
            direction[0] = (landslide.finalCell.i - landslide.cell.i) / Math.abs(landslide.finalCell.i - landslide.cell.i);
        }
        if (landslide.finalCell.j - landslide.cell.j !== 0) {
            direction[1] = (landslide.finalCell.j - landslide.cell.j) / Math.abs(landslide.finalCell.j - landslide.cell.j);
        }
        if (direction[0] !== 0 && direction[1] !== 0) {
            direction[Math.floor(Math.random() * 2)] = 0;
        }

        landslide.cell = SlideLogic.BoardLogic.getCell(landslide.cell.i + direction[0], landslide.cell.j + direction[1], playBoard.boardObjects);
    }
}

export {SlideModel, SlideLogic, SlideRenderer};

if (typeof module !== 'undefined') {
    module.exports = {SlideModel, SlideLogic, SlideRenderer};
}