export class VolcanoModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Volcano";
        this.terrainType = terrainTypes.VOLCANO;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 20000;
    }

    getWeight() {
        return this.weight;
    }
}

export class VolcanoRenderer {
}

export class VolcanoLogic {
}