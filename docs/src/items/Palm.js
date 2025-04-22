/**
 * @implements {PlantLike}
 */
class PalmModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Palm";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.PALM;
        this.img = p5.images.get("Palm1");
        this.imgs = [];
        this.pointer = 0;
        for (let i = 1; i <= 24; i++) {
            this.imgs.push(p5.images.get("Palm" + i.toString()));
        }

        this.seed = PalmSeedModel;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;
    }

    getPassiveString() {
        return "Dampen tsunami."
    }

    getActiveString() {
        return "No active skill.";
    }
}

class PalmRenderer {
}

class PalmLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

class PalmSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "PalmSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.PALM;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

class PalmSeedRenderer {
}

class PalmSeedLogic {
}

export {PalmModel, PalmLogic, PalmRenderer, PalmSeedModel, PalmSeedLogic, PalmSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {PalmModel, PalmLogic, PalmRenderer, PalmSeedModel, PalmSeedLogic, PalmSeedRenderer};
}