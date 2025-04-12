export class LavaModel {
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

export class LavaRenderer {
}

export class LavaLogic {
    static setup(bundle) {
        LavaLogic.itemTypes = bundle.itemTypes;
        /** @type {typeof BoardLogic} */
        LavaLogic.BoardLogic = bundle.BoardLogic;
    }

    static storeSeed(p5, plant, lava) {
        if (plant.type === LavaLogic.itemTypes.SEED) {
            lava.seed = plant.constructor(p5);
        } else if (plant.type === LavaLogic.itemTypes.PLANT) {
            lava.seed = new plant.seed(p5);
        }
    }

    static solidify(p5, playBoard, lava) {
        if (lava.countdown > 0) {
            lava.countdown--;
        } else {
            lava.name = "LavaS";
            lava.img = p5.images.get(`${lava.name}`);
            lava.hasSolidified = true;
            if (lava.seed != null) {
                console.log(this)
                lava.seed.countdown = 1;
                LavaLogic.BoardLogic.getCell(lava.cellX, lava.cellY, playBoard.boardObjects).seed = lava.seed;
                lava.seed = null;
            }
            lava.weight = 0;
        }
    }
}