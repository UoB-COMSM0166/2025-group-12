class LavaModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Lava";
        this.terrainType = terrainTypes.LAVA;
        this.img = p5.images.get(`${this.name}`);

        this.countdown = 1;
        this.hasSolidified = false;

        this.seed = null;
        this.cellX = -1;
        this.cellY = -1;

        this.weight = 1000;
    }

    getWeight() {
        return this.weight;
    }
}

class LavaRenderer {
}

class LavaLogic {
    static setup(bundle) {
        LavaLogic.itemTypes = bundle.itemTypes;
        /** @type {typeof BoardLogic} */
        LavaLogic.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param p5
     * @param {PlantLike} plant
     * @param {LavaModel} lava
     */
    static storeSeed(p5, plant, lava) {
    }

    /**
     *
     * @param p5
     * @param playBoard
     * @param {LavaModel} lava
     */
    static solidify(p5, playBoard, lava) {
        if (lava.countdown > 0) {
            lava.countdown--;
        } else {
            lava.name = "LavaS";
            lava.img = p5.images.get(`${lava.name}`);
            lava.hasSolidified = true;
            if (lava.seed != null) {
                lava.seed.countdown = 1;
                LavaLogic.BoardLogic.getCell(lava.cellX, lava.cellY, playBoard.boardObjects).seed = lava.seed;
                lava.seed = null;
            }
            lava.weight = 0;
        }
    }
}

export {LavaModel, LavaLogic, LavaRenderer};

if (typeof module !== 'undefined') {
    module.exports = {LavaModel, LavaLogic, LavaRenderer};
}