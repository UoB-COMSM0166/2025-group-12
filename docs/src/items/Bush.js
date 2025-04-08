export class BushModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Bush";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.BUSH;
        this.img = p5.images.get(`${this.name}`);

        this.seed = BushSeedModel;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby tree's defense extends to 9 cells.
    }
}

export class BushRenderer {
    static getPassiveString(bush) {
        return "Extends nearby Trees' passive ability to adjacent 8 cells.";
    }

    static getActiveString(bush) {
        return "No active skill.";
    }
}

export class BushLogic {
    static setup(bundle) {
    }

    static reevaluateSkills(bundle) {
    }
}

export class BushSerializer {
}

export class BushSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "BushSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.BUSH;
        this.countdown = 2;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class BushSeedRenderer {
}

export class BushSeedLogic {
}

export class BushSeedSerializer {
}
