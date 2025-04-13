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
        if (terrainInstance.terrainType === TerrainSerializer.terrainTypes.LAVA) {
            let object = {
                terrainType: terrainInstance.terrainType,
                name: terrainInstance.name,
                countdown: terrainInstance.countdown,
                hasSolidified: terrainInstance.hasSolidified,
                cellX: terrainInstance.cellX,
                cellY: terrainInstance.cellY,
                seed: terrainInstance.seed ? {
                    className: terrainInstance.seed.constructor.name,
                    countdown: terrainInstance.seed.countdown
                } : null
            }
            return JSON.stringify(object);
        } else {
            let object = {
                name: terrainInstance.name,
                terrainType: terrainInstance.terrainType,
            }
            return JSON.stringify(object);
        }
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
        return newTerrainInstance;
    }
}

export {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer};

if (typeof module !== 'undefined') {
    module.exports = {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer};
}