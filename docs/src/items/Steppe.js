class SteppeModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Steppe";
        this.terrainType = terrainTypes.STEPPE;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

class SteppeRenderer {
}

class SteppeLogic {
}

export {SteppeModel, SteppeLogic, SteppeRenderer};

if (typeof module !== 'undefined') {
    module.exports = {SteppeModel, SteppeLogic, SteppeRenderer};
}