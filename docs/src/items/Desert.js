class DesertModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Desert";
        this.terrainType = terrainTypes.DESERT;
        this.img = p5.images.get("baseBlock");
        this.layerName = "Desert" + Math.ceil(Math.random() * 2).toString();
        this.layer = p5.images.get(this.layerName);
        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

class DesertRenderer {
}

class DesertLogic {
}

export {DesertModel, DesertLogic, DesertRenderer};

if (typeof module !== 'undefined') {
    module.exports = {DesertModel, DesertLogic, DesertRenderer};
}