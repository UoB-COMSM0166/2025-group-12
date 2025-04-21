class HillModel {
    constructor(p5, superModel, itemTypes, terrainTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Hill";
        this.terrainType = terrainTypes.HILL;
        this.img = p5.images.get("baseBlock");
        this.layer = p5.images.get("Hill" + Math.ceil(Math.random() * 3).toString());
        this.canSlide = false;

        this.weight = 20;
    }

    setCanSlide(bool){
        this.canSlide = bool;
    }

    getWeight() {
        return this.weight;
    }
}

class HillRenderer {
}

class HillLogic {
}

export {HillModel, HillLogic, HillRenderer};

if (typeof module !== 'undefined') {
    module.exports = {HillModel, HillLogic, HillRenderer};
}