export class SeaModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Sea";
        this.terrainType = terrainTypes.SEA;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 100000;
    }
}

export class SeaRenderer {
}

export class SeaLogic {
    static getWeight(sea) {
        return sea.weight;
    }
}

export class SeaSerializer {
}