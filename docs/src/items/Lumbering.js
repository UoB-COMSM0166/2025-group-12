export class LumberingModel {
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

export class LumberingRenderer {
}

export class LumberingLogic {
}