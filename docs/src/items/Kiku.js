export class KikuModel {
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
}

export class KikuRenderer {
    static getPassiveString(kiku) {
        return "Increase the upper limit of action points by 1.";
    }

    static getActiveString(kiku) {
        return "No active skill.";
    }
}

export class KikuLogic {
    static setup(bundle) {
    }

    static reevaluateSkills(bundle) {
    }
}

export class KikuSerializer {
}

export class KikuSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "KikuSeed";
        this.color = "rgb(255,182,30)";
        this.seedType = seedTypes.KIKU;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class KikuSeedRenderer {
}

export class KikuSeedLogic {
}

export class KikuSeedSerializer {
}