class LumberingModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Lumbering";
        this.terrainType = terrainTypes.LUMBERING;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

class LumberingRenderer {
}

class LumberingLogic {
}

export {LumberingModel, LumberingLogic, LumberingRenderer};

if (typeof module !== 'undefined') {
    module.exports = {LumberingModel, LumberingLogic, LumberingRenderer};
}