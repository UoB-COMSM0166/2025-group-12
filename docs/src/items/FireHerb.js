/**
 * @implements {PlantLike}
 */
export class FireHerbModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "FireHerb";
        this.color = "red";
        this.plantType = plantTypes.FIRE_HERB;
        this.img = p5.images.get(`${this.name}`);

        this.seed = FireHerbSeedModel;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // no passive or active skill
        // it only affects the ecosystem
    }

    getPassiveString() {
        return "No passive skill.";
    }

    getActiveString() {
        return "No active skill.";
    }
}

export class FireHerbRenderer {

}

export class FireHerbLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

export class FireHerbSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "FireHerbSeed";
        this.color = "red";
        this.seedType = seedTypes.FIRE_HERB;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class FireHerbSeedRenderer {
}

export class FireHerbSeedLogic {
}