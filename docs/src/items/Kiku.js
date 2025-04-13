/**
 * @implements {PlantLike}
 */
class KikuModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Kiku";
        this.color = "rgb(255,182,30)";
        this.plantType = plantTypes.KIKU;
        this.img = p5.images.get(`${this.name}`);

        this.seed = KikuSeedModel;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;
    }

    getPassiveString() {
        return "Increase the upper limit of action points by 1.";
    }

    getActiveString() {
        return "No active skill.";
    }
}

class KikuRenderer {
}

class KikuLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

class KikuSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "KikuSeed";
        this.color = "rgb(255,182,30)";
        this.seedType = seedTypes.KIKU;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

class KikuSeedRenderer {
}

class KikuSeedLogic {
}

export {KikuModel, KikuLogic, KikuRenderer, KikuSeedModel, KikuSeedLogic, KikuSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {KikuModel, KikuLogic, KikuRenderer, KikuSeedModel, KikuSeedLogic, KikuSeedRenderer};
}