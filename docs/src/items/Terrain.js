class TerrainModel {
    constructor(itemTypes) {
        this.img = null;
        this.type = itemTypes.TERRAIN;
        this.terrainType = 0;
    }
}

class TerrainRenderer {
    static setup(bundle) {
    }
}

class TerrainLogic {
    static setup(bundle) {
        TerrainLogic.itemTypes = bundle.itemTypes;
        TerrainLogic.plantTypes = bundle.plantTypes;
        TerrainLogic.seedTypes = bundle.seedTypes;
        TerrainLogic.plantFactory = bundle.plantFactory;
        /** @type {LavaLogic} */
        TerrainLogic.LavaLogic = bundle.LavaLogic;
    }

    /**
     *
     * @param p5
     * @param  plant
     * @param {LavaModel} lava
     */
    static storeSeed(p5, plant, lava) {
        if (plant.type === TerrainLogic.itemTypes.SEED) {
            lava.seed = TerrainLogic.plantFactory.get(plant.seedType)();
        } else if (plant.type === TerrainLogic.itemTypes.PLANT) {
            lava.seed = TerrainLogic.plantFactory.get(plant.plantType + 1)();
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {LavaModel} lava
     */
    static solidify(p5, playBoard, lava) {
        TerrainLogic.LavaLogic.solidify(p5, playBoard, lava);
    }

}

class TerrainSerializer {
    static setup(bundle) {
        TerrainSerializer.p5 = bundle.p5;
        TerrainSerializer.terrainTypes = bundle.terrainTypes;
        TerrainSerializer.plantFactory = bundle.plantFactory;
        TerrainSerializer.terrainFactory = bundle.terrainFactory;
    }

    static stringify(terrainInstance) {
        let object = {};
        if (terrainInstance.terrainType === TerrainSerializer.terrainTypes.LAVA) {
            object = {
                terrainType: terrainInstance.terrainType,
                name: terrainInstance.name,
                countdown: terrainInstance.countdown,
                hasSolidified: terrainInstance.hasSolidified,
                cellX: terrainInstance.cellX,
                cellY: terrainInstance.cellY,
                seed: terrainInstance.seed ? {
                    className: terrainInstance.seed.constructor.name,
                    seedType: terrainInstance.seed.seedType,
                    countdown: terrainInstance.seed.countdown
                } : null
            }
        } else {
            object = {
                name: terrainInstance.name,
                terrainType: terrainInstance.terrainType,
            }
        }
        if (terrainInstance.layerName) object.layerName = terrainInstance.layerName;
        return JSON.stringify(object);
    }

    static parse(json) {
        let object = JSON.parse(json);
        let newTerrainInstance = TerrainSerializer.terrainFactory.get(object.terrainType)();

        if (object.terrainType === TerrainSerializer.terrainTypes.LAVA) {
            newTerrainInstance.name = object.name;
            newTerrainInstance.img = TerrainSerializer.p5.images.get(newTerrainInstance.name);
            newTerrainInstance.countdown = object.countdown;
            newTerrainInstance.hasSolidified = object.hasSolidified;
            newTerrainInstance.cellX = object.cellX;
            newTerrainInstance.cellY = object.cellY;
            if (object.seed) {
                let seedInstance = TerrainSerializer.plantFactory.get(object.seed.seedType)();
                if (seedInstance) {
                    seedInstance.countdown = object.seed.countdown;
                    newTerrainInstance.seed = seedInstance;
                } else {
                    console.warn(`Seed class ${object.seed.name} not found in factory`);
                }
            }
        }
        if (object.layerName) {
            newTerrainInstance.layerName = object.layerName;
            newTerrainInstance.layer = TerrainSerializer.p5.images.get(newTerrainInstance.layerName);
        }
        return newTerrainInstance;
    }
}

export {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer};

if (typeof module !== 'undefined') {
    module.exports = {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer};
}