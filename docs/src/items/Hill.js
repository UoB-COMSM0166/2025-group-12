export class HillModel {
    constructor(p5, superModel, itemTypes, terrainTypes, canSlide = false) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Hill";
        this.terrainType = terrainTypes.HILL;
        this.img = p5.images.get(`${this.name}`);

        this.canSlide = canSlide;

        this.weight = 20;
    }

    getWeight() {
        return this.weight;
    }
}

export class HillRenderer {
}

export class HillLogic {
}