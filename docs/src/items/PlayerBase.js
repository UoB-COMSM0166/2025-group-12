class PlayerBaseModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Player's Base";
        this.terrainType = terrainTypes.BASE;
        this.img = p5.images.get("baseBlock");
        this.layer = p5.images.get(`PlayerBase`);

        this.health = 1;
        this.maxHealth = 1;

        this.weight = 0;
    }

    getWeight() {
        return this.weight;
    }
}

class PlayerBaseRenderer {
}

class PlayerBaseLogic {
}

export {PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer};

if (typeof module !== 'undefined') {
    module.exports = {PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer};
}