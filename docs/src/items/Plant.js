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