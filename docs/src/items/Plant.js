/**
 * @typedef {Object} PlantLike
 * @property {number} type
 * @property {String} name
 * @property {*} seed
 * @property {String} color
 * @property {number} plantType
 * @property {p5.Image} img
 * @property {number} health
 * @property {number} maxHealth
 * @property {boolean} status
 * @property {boolean} hasActive
 * @property {boolean} hasExtended
 * @property {number} useLeft
 * @property {number} maxUse
 * @property {number} earthCounter
 * @property {number} coldCounter
 */

class PlantModel {
    constructor(itemTypes) {
        this.type = itemTypes.PLANT;
    }
}

class PlantRenderer {
    static setup(bundle) {
    }

    static draw() {
    }
}

class PlantLogic {
    static setup(bundle) {
        PlantLogic.plantTypes = bundle.plantTypes;
        /** @type {typeof PineLogic} */
        PlantLogic.PineLogic = bundle.PineLogic;
        /** @type {typeof OrchidLogic} */
        PlantLogic.OrchidLogic = bundle.OrchidLogic;
        /** @type {typeof BambooLogic} */
        PlantLogic.BambooLogic = bundle.BambooLogic;
        /** @type {typeof PlumLogic} */
        PlantLogic.PlumLogic = bundle.PlumLogic;
    }

    static idleInfo(plantType) {
        if (plantType === PlantLogic.plantTypes.PALM) {
            return "{white:Tree. No active or ecosystem skills.}"
        }
        if (plantType === PlantLogic.plantTypes.PINE) {
            return "{white:Tree. Will gain passive skill once a bush is next to it.}\\{white:Will gain active skill once a bush and a grass is next to it.}"
        }
        if (plantType === PlantLogic.plantTypes.BAMBOO) {
            return "{white:Tree. Will expand to all landslides}\\{white:if planted on landslide.}"
        }
        if (plantType === PlantLogic.plantTypes.KIKU) {
            return "{white:Grass. Automatically adds 1 to the total action points.}"
        }
        if (plantType === PlantLogic.plantTypes.CORN) {
            return "{white:Bush. No active or ecosystem skills.}"
        }
        if (plantType === PlantLogic.plantTypes.PLUM) {
            return "{white:Bush. Breaks nearby snowfields.}"
        }
        if (plantType === PlantLogic.plantTypes.FIRE_HERB) {
            return "{white:Grass. Ecosystem with 10 more plants and at least a fire herb resists lava.}\\{white: Ecosystem with fire herb withstands blizzard.}"
        }
        if (plantType === PlantLogic.plantTypes.ORCHID) {
            return "{white:Grass. Will gain active skill once a tree is next to it.}"
        }
        return null;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     * @param {PlantLike} plant
     */
    static reevaluateSkills(playBoard, cell, plant) {
        if (plant === null) return;
        if (plant.plantType === PlantLogic.plantTypes.PINE) {
            PlantLogic.PineLogic.reevaluateSkills(playBoard, cell, /** @type {PineModel} */ plant);
        } else if (plant.plantType === PlantLogic.plantTypes.ORCHID) {
            PlantLogic.OrchidLogic.reevaluateSkills(playBoard, cell, /** @type {OrchidModel} */ plant);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     */
    static spreadBamboo(p5, playBoard, cell) {
        PlantLogic.BambooLogic.spreadBamboo(p5, playBoard, cell);
    }

    static plumRange(i0, j0, i1, j1) {
        return PlantLogic.PlumLogic.plumRange(i0, j0, i1, j1);
    }
}

class PlantSerializer {
    static setup(bundle) {
        PlantSerializer.plantFactory = bundle.plantFactory;
        PlantSerializer.plantTypes = bundle.plantTypes;
    }

    /**
     *
     * @param {PlantLike} plantInstance
     * @returns {string}
     */
    static stringify(plantInstance) {
        const object = {
            name: plantInstance.name,
            plantType: plantInstance.plantType,
            health: plantInstance.health,
        }
        if (plantInstance.imgIndex != null) object.imgIndex = plantInstance.imgIndex;
        if (plantInstance.useLeft != null) object.useLeft = plantInstance.useLeft;
        if (plantInstance.earthCounter != null) object.earthCounter = plantInstance.earthCounter;
        if (plantInstance.coldCounter != null) object.coldCounter = plantInstance.coldCounter;
        return JSON.stringify(object);
    }

    /**
     *
     * @param p5
     * @param json
     */
    static parse(p5, json) {
        const object = JSON.parse(json);
        let plant = PlantSerializer.plantFactory.get(object.plantType)();
        Object.assign(plant, object);
        if (object.imgIndex) plant.img = p5.images.get(`${plant.name}` + plant.imgIndex.toString());
        return plant;
    }
}

export {PlantModel, PlantLogic, PlantRenderer, PlantSerializer};

if (typeof module !== 'undefined') {
    module.exports = {PlantModel, PlantLogic, PlantRenderer, PlantSerializer};
}