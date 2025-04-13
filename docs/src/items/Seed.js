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

class SeedModel {
    constructor(itemTypes) {
        this.type = itemTypes.SEED;
        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        this.seedType = 0;
        this.countdown = -1;
    }
}

class SeedRenderer {
    static setup(bundle) {
    }

    static draw() {
    }
}

class SeedLogic {
    static setup(bundle) {
        SeedLogic.plantFactory = bundle.plantFactory;
    }

    /**
     *
     * @param {SeedLike} seedInstance
     */
    static grow(seedInstance) {
        seedInstance.countdown--;
        if (seedInstance.countdown === 0) {
            return SeedLogic.plantFactory.get(seedInstance.seedType)();
        } else {
            return seedInstance;
        }
    }
}

class SeedSerializer {
    static setup(bundle) {
        SeedSerializer.seedTypes = bundle.seedTypes;
        SeedSerializer.plantFactory = bundle.plantFactory;
    }

    /**
     *
     * @param {SeedLike} seedInstance
     */
    static stringify(seedInstance) {
        const object = {
            name: seedInstance.name,
            seedType: seedInstance.seedType,
            countdown: seedInstance.countdown,
        }
        return JSON.stringify(object);
    }

    static parse(json) {
        const object = JSON.parse(json);
        let seed = SeedSerializer.plantFactory.get(object.seedType)();
        Object.assign(seed, object);
        return seed;
    }
}

export {SeedModel, SeedLogic, SeedRenderer, SeedSerializer};

if (typeof module !== 'undefined') {
    module.exports = {SeedModel, SeedLogic, SeedRenderer, SeedSerializer};
}