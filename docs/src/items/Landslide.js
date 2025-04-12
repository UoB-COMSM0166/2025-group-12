export class LandslideModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Landslide";
        this.terrainType = terrainTypes.LANDSLIDE;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

export class LandslideRenderer {
}

export class LandslideLogic {
}