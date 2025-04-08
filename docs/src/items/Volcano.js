export class VolcanoModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Volcano";
        this.terrainType = terrainTypes.VOLCANO;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 2000;
    }
}

export class VolcanoRenderer {
}

export class VolcanoLogic {
    static getWeight(volcano) {
        return volcano.weight;
    }
}

export class VolcanoSerializer {
}