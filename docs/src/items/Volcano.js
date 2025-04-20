class VolcanoModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Volcano";
        this.terrainType = terrainTypes.VOLCANO;
        this.img = p5.images.get(`${this.name}`);
        this.layer = p5.images.get("VolcanoLayer");
        this.weight = 20000;
    }

    getWeight() {
        return this.weight;
    }
}

class VolcanoRenderer {
}

class VolcanoLogic {
}

export {VolcanoModel, VolcanoLogic, VolcanoRenderer};

if (typeof module !== 'undefined') {
    module.exports = {VolcanoModel, VolcanoLogic, VolcanoRenderer};
}