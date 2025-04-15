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
    static spreadBamboo(p5, playBoard, cell){
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
        if (plantInstance.useLeft != null) object.useLeft = plantInstance.useLeft;
        if (plantInstance.earthCounter != null) object.earthCounter = plantInstance.earthCounter;
        if (plantInstance.coldCounter != null) object.coldCounter = plantInstance.coldCounter;
        return JSON.stringify(object);
    }

    static parse(json) {
        const object = JSON.parse(json);
        let plant = PlantSerializer.plantFactory.get(object.plantType)();
        Object.assign(plant, object);
        return plant;
    }
}

export {PlantModel, PlantLogic, PlantRenderer, PlantSerializer};

if (typeof module !== 'undefined') {
    module.exports = {PlantModel, PlantLogic, PlantRenderer, PlantSerializer};
}