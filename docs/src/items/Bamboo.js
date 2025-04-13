/**
 * @implements {PlantLike}
 */
class BambooModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Bamboo";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.BAMBOO;
        this.img = p5.images.get(`${this.name}`);

        this.seed = BambooSeedModel;

        this.health = 4;
        this.maxHealth = 4;
        this.status = true;
    }

    getPassiveString() {
        return "Automatically spreads to all nearby landslide terrain and repair local environment."
    }

    getActiveString() {
        return "No active skill.";
    }
}

class BambooRenderer {
}

class BambooLogic {
    static setup(bundle) {
        BambooLogic.terrainTypes = bundle.terrainTypes;
        BambooLogic.itemTypes = bundle.itemTypes;
        BambooLogic.plantTypes = bundle.plantTypes;
        BambooLogic.superModel = bundle.PlantModel;

        /** @type {typeof BoardLogic} */
        BambooLogic.BoardLogic = bundle.BoardLogic;
    }

    static reevaluateSkills() {
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     */
    static spreadBamboo(p5, playBoard, cell) {
        if (!cell.plant && !cell.seed) {
            cell.plant = new BambooModel(p5, BambooLogic.superModel, BambooLogic.itemTypes, BambooLogic.plantTypes);
        }

        for (let adCell of BambooLogic.BoardLogic.getAdjacent8Cells(cell.i, cell.j, playBoard.boardObjects)) {
            if (adCell.plant || adCell.seed) continue;

            if (adCell.terrain.terrainType === BambooLogic.terrainTypes.LANDSLIDE) {
                adCell.plant = new BambooModel(p5, BambooLogic.superModel, BambooLogic.itemTypes, BambooLogic.plantTypes);
                this.spreadBamboo(p5, playBoard, adCell);
            }
        }
    }
}

class BambooSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "BambooSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.BAMBOO;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

class BambooSeedRenderer {
}

class BambooSeedLogic {
}

export {BambooModel, BambooLogic, BambooRenderer, BambooSeedModel, BambooSeedLogic, BambooSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {BambooModel, BambooLogic, BambooRenderer, BambooSeedModel, BambooSeedLogic, BambooSeedRenderer};
}