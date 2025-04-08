export class PlayerBaseModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "PlayerBase";
        this.terrainType = terrainTypes.BASE;
        this.img = p5.images.get(`${this.name}`);

        this.health = 1;
        this.maxHealth = 1;

        this.weight = 0;
    }
}

export class PlayerBaseRenderer {
}

export class PlayerBaseLogic {
    static getWeight(base) {
        return base.weight;
    }
}

export class PlayerBaseSerializer {
}