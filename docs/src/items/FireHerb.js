/**
 * @implements {PlantLike}
 */
class FireHerbModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "FireHerb";
        this.color = "red";
        this.plantType = plantTypes.FIRE_HERB;
        this.img = p5.images.get("FireHerb1");
        this.imgs = [];
        this.pointer = 0;
        for (let i = 1; i <= 80; i++) {
            this.imgs.push(p5.images.get("FireHerb" + i.toString()));
        }

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

class FireHerbRenderer {

}

class FireHerbLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

class FireHerbSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "FireHerbSeed";
        this.color = "red";
        this.seedType = seedTypes.FIRE_HERB;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

class FireHerbSeedRenderer {
}

class FireHerbSeedLogic {
}

export {FireHerbModel, FireHerbLogic, FireHerbRenderer, FireHerbSeedModel, FireHerbSeedLogic, FireHerbSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {
        FireHerbModel,
        FireHerbLogic,
        FireHerbRenderer,
        FireHerbSeedModel,
        FireHerbSeedLogic,
        FireHerbSeedRenderer
    };
}