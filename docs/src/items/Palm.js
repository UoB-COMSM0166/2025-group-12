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
}

export class PalmRenderer {
    static getPassiveString(bamboo) {
        return "Dampen tsunami."
    }

    static getActiveString(bamboo) {
        return "No active skill.";
    }
}

export class PalmLogic {
    static setup(bundle) {
    }

    static reevaluateSkills(bundle) {
    }
}

export class PalmSerializer {
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

export class PalmSeedSerializer {
}
