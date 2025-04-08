export class SteppeModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Steppe";
        this.terrainType = terrainTypes.STEPPE;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 0;
    }
}

export class SteppeRenderer {
}

export class SteppeLogic {
    static getWeight(steppe) {
        return steppe.weight;
    }
}

export class SteppeSerializer {
}