class LumberingModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Lumbering Camp";
        this.terrainType = terrainTypes.LUMBERING;
        this.img = p5.images.get("baseBlock");
        this.layer = p5.images.get(`Lumbering`);
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