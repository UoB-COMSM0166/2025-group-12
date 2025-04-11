export class TerrainModel {
    constructor(itemTypes) {
        this.img = null;
        this.type = itemTypes.TERRAIN;
        this.terrainType = 0;
    }
}

export class TerrainRenderer {
    static assertImplementation(assertion, impl) {
    }
}

export class TerrainLogic {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'TerrainLogic',
            impl,
            methods: ['getWeight']
        });
    }
}

export class TerrainSerializer {
    static assertImplementation(assertion, impl) {
        assertion({
            name: 'TerrainSerializer',
            impl,
            methods: ['stringify', 'parse']
        });
    }

    static stringify(terrainInstance, terrainTypes) {
        if (terrainInstance.terrainType === terrainTypes.LAVA) {
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

    static parse(json, p5, newTerrainInstance, plantFactory, terrainTypes) {
        let object = JSON.parse(json);
        if (object.terrainType === terrainTypes.LAVA) {
            newTerrainInstance.name = object.name;
            newTerrainInstance.img = p5.images.get(newTerrainInstance.name);
            newTerrainInstance.countdown = object.countdown;
            newTerrainInstance.hasSolidified = object.hasSolidified;
            newTerrainInstance.cellX = object.cellX;
            newTerrainInstance.cellY = object.cellY;
            if (object.seed) {
                let seedInstance = plantFactory[object.seed.name]();
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