export class MountainModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Mountain";
        this.terrainType = terrainTypes.MOUNTAIN;
        this.img = p5.images.get(`${this.name}`);
        this.weight = 1000;
    }

    getWeight() {
        return this.weight;
    }
}

export class MountainRenderer {
}

export class MountainLogic {
}