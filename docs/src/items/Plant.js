/**
 * @typedef {Object} PlantLike
 * @property {number} type
 * @property {String} name
 * @property {String} color
 * @property {number} plantType
 * @property {p5.Image} img
 * @property {SeedLike} seed
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

export class PlantModel {
    constructor(itemTypes) {
        this.type = itemTypes.PLANT;
    }
}

export class PlantRenderer {
    static setup(bundle){}

    static draw(){}
}

export class PlantLogic {
    static setup(bundle){
        PlantLogic.plantTypes = bundle.plantTypes;
        /** @type {typeof TreeLogic} */
        PlantLogic.TreeLogic = bundle.TreeLogic;
        /** @type {typeof OrchidLogic} */
        PlantLogic.OrchidLogic = bundle.OrchidLogic;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     * @param {PlantLike} plant
     */
    static reevaluateSkills(playBoard, cell, plant){
        if(plant.plantType === PlantLogic.plantTypes.TREE){
            PlantLogic.TreeLogic.reevaluateSkills(playBoard, cell, /** @type {TreeModel} */ plant);
        }
        else if(plant.plantType === PlantLogic.plantTypes.ORCHID){
            PlantLogic.OrchidLogic.reevaluateSkills(playBoard, cell, /** @type {OrchidModel} */ plant);
        }
    }
}

export class PlantSerializer {
    static setup(bundle){
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