class MountainModel {
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

class MountainRenderer {
}

class MountainLogic {
}

export {MountainModel, MountainLogic, MountainRenderer};

if (typeof module !== 'undefined') {
    module.exports = {MountainModel, MountainLogic, MountainRenderer};
}