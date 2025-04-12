export class SeaModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Sea";
        this.terrainType = terrainTypes.SEA;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 100000;
    }

    getWeight() {
        return this.weight;
    }
}

export class SeaRenderer {
}

export class SeaLogic {
}