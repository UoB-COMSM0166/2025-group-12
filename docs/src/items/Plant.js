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
 */


export class PlantModel {
    constructor(itemTypes) {
        this.type = itemTypes.PLANT;
    }
}

export class PlantRenderer {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'PlantRenderer',
            impl,
            methods: ['getPassiveString', 'getActiveString']
        });
    }
}

export class PlantLogic {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'PlantLogic',
            impl,
            methods: ['setup', 'reevaluateSkills']
        });
    }
}

export class PlantSerializer {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'PlantSerializer',
            impl,
            methods: ['stringify', 'parse']
        });
    }

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

    static parse(json, p5, newPlantInstance) {
        const object = JSON.parse(json);
        Object.assign(newPlantInstance, object);
        return newPlantInstance;
    }
}