/**
 * @implements {PlantLike}
 */
export class PlumModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Plum";
        this.color = "rgb(222,111,161)";
        this.plantType = plantTypes.PLUM;
        this.img = p5.images.get(`${this.name}`);

        this.seed = PlumSeedModel;

        this.health = 2;
        this.maxHealth = 2;
        this.status = true;
    }

    getPassiveString() {
        return "Dissolve nearby snowfield.";
    }

    getActiveString() {
        return "No active skill.";
    }
}

export class PlumRenderer {
}

export class PlumLogic {
    static setup(bundle) {
        PlumLogic.util = bundle.utilityClass;
    }

    static reevaluateSkills() {
    }

    static plumRange(i0, j0, i1, j1) {
        return PlumLogic.util.manhattanDistance(i0, j0, i1, j1) <= 2 && PlumLogic.util.euclideanDistance(i0, j0, i1, j1) <= 2;
    }
}

export class PlumSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "PlumSeed";
        this.color = "rgb(222,111,161)";
        this.seedType = seedTypes.PLUM;
        this.countdown = 2;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class PlumSeedRenderer {
}

export class PlumSeedLogic {
}