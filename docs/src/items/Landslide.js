class LandslideModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Landslide";
        this.terrainType = terrainTypes.LANDSLIDE;
        this.img = p5.images.get("baseBlock");
        this.layerName = `${this.name}` + "00"; // default, needs refine
        this.layer = p5.images.get(this.layerName);
        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

class LandslideRenderer {
}

class LandslideLogic {
}

export {LandslideModel, LandslideLogic, LandslideRenderer};

if (typeof module !== 'undefined') {
    module.exports = {LandslideModel, LandslideLogic, LandslideRenderer};
}