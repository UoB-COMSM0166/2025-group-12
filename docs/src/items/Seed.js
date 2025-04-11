/**
 * @typedef {Object} SeedLike
 * @property {number} type
 * @property {String} name
 * @property {String} color
 * @property {number} seedType
 * @property {number} countdown
 * @property {p5.Image} img
 * @property {number} health
 * @property {number} maxHealth
 * @property {boolean} status
 */

export class SeedModel {
    constructor(itemTypes) {
        this.type = itemTypes.SEED;
        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        this.seedType = 0;
        this.countdown = -1;
    }
}

export class SeedRenderer {
    static assertImplementation(assertion, impl) {
    }
}

export class SeedLogic {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'SeedLogic',
            impl,
            methods: ['grow']
        });
    }

    static grow(p5, seedInstance, newPlantInstance) {
        seedInstance.countdown--;
        if (seedInstance.countdown === 0) {
            return newPlantInstance;
        } else {
            return seedInstance;
        }
    }
}

export class SeedSerializer {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'SeedSerializer',
            impl,
            methods: ['stringify', 'parse']
        });
    }

    static stringify(seedInstance) {
        const object = {
            name: seedInstance.name,
            seedType: seedInstance.seedType,
            countdown: seedInstance.countdown,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, newSeedInstance) {
        const object = JSON.parse(json);
        Object.assign(newSeedInstance, object);
        return newSeedInstance;
    }
}