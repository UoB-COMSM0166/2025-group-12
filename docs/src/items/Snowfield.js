export class SnowfieldModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Snowfield";
        this.terrainType = terrainTypes.SNOWFIELD;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 0;
    }
}

export class SnowfieldRenderer {
}

export class SnowfieldLogic {
    static getWeight(snowfield) {
        return snowfield.weight;
    }
}

export class SnowfieldSerializer {
}