/**
 * @implements {PlantLike}
 */
export class PalmModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Palm";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.PALM;
        this.img = p5.images.get(`${this.name}`);

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

export class PalmRenderer {
}

export class PalmLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

export class PalmSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "PalmSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.PALM;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class PalmSeedRenderer {
}

export class PalmSeedLogic {
}