/**
 * @implements {PlantLike}
 */
class CornModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Corn";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.CORN;
        this.img = p5.images.get(`${this.name}`);

        this.seed = CornSeedModel;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;

        // passive: nearby pine's defense extends to 9 cells.
    }

    getPassiveString() {
        return "Extends nearby Trees' passive ability to adjacent 8 cells.";
    }

    getActiveString() {
        return "No active skill.";
    }
}

class CornRenderer {
}

class CornLogic {
    static setup(bundle) {
    }

    static reevaluateSkills() {
    }
}

class CornSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "CornSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.CORN;
        this.countdown = 2;
        this.img = this.img = p5.images.get("Seed");
    }
}

class CornSeedRenderer {
}

class CornSeedLogic {
}

export {CornModel, CornLogic, CornRenderer, CornSeedModel, CornSeedLogic, CornSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {CornModel, CornLogic, CornRenderer, CornSeedModel, CornSeedLogic, CornSeedRenderer};
}