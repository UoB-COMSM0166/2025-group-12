// make itemTypes distinct from other types on numeric values
let itemTypes = {
    PLANT: 1000,
    SEED: 1001,
    ENEMY: 1002,
    TERRAIN: 1003,
    UNKNOWN: 1004,
}

// notice: the order of plants and seed in the inventory follows below ordering.
let plantTypes = {
    PALM: 2,
    PINE: 4,
    BAMBOO: 6,
    KIKU: 8,
    CORN: 10,
    PLUM: 12,
    FIRE_HERB: 14,
    ORCHID: 16,

    TREE: 90,
    BUSH: 92,
    GRASS: 94,
}
let seedTypes = {
    PALM: 3,
    PINE: 5,
    BAMBOO: 7,
    KIKU: 9,
    CORN: 11,
    PLUM: 13,
    FIRE_HERB: 15,
    ORCHID: 17,

    TREE: 91,
    BUSH: 93,
    GRASS: 95,
}

let terrainTypes = {
    BASE: 1,
    MOUNTAIN: 2,
    STEPPE: 3,
    LUMBERING: 4,
    VOLCANO: 5,
    LAVA: 6,
    HILL: 7,
    LANDSLIDE: 8,
    SNOWFIELD: 9,
    SEA: 10,
}

// notice: the order of end turn actions refers to below ordering.
let movableTypes = {
    ANIMAL: 100,
    EARTHQUAKE: 105,
    SLIDE: 110,
    TSUNAMI: 115,
    BOMB: 120,
    TORNADO: 125,
    BLIZZARD: 130,
    BANDIT: 135,
}

function baseType(plantOrSeed) {
    if (plantOrSeed.type === itemTypes.PLANT) {
        if (plantOrSeed.plantType === plantTypes.PINE || plantOrSeed.plantType === plantTypes.BAMBOO || plantOrSeed.plantType === plantTypes.PALM) {
            return plantTypes.TREE;
        } else if (plantOrSeed.plantType === plantTypes.CORN || plantOrSeed.plantType === plantTypes.PLUM) {
            return plantTypes.BUSH;
        } else if (plantOrSeed.plantType === plantTypes.ORCHID || plantOrSeed.plantType === plantTypes.FIRE_HERB || plantOrSeed.plantType === plantTypes.KIKU) {
            return plantTypes.GRASS;
        }
    } else if (plantOrSeed.type === itemTypes.SEED) {
        if (plantOrSeed.seedType === seedTypes.PINE || plantOrSeed.seedType === seedTypes.BAMBOO || plantOrSeed.seedType === seedTypes.PALM) {
            return seedTypes.TREE;
        } else if (plantOrSeed.seedType === seedTypes.CORN || plantOrSeed.seedType === seedTypes.PLUM) {
            return seedTypes.BUSH;
        } else if (plantOrSeed.seedType === seedTypes.ORCHID || plantOrSeed.seedType === seedTypes.FIRE_HERB || plantOrSeed.seedType === seedTypes.KIKU) {
            return seedTypes.GRASS;
        }
    }
    return itemTypes.UNKNOWN;
}

export {itemTypes, plantTypes, seedTypes, terrainTypes, movableTypes, baseType};

if (typeof module !== 'undefined') {
    module.exports = {itemTypes, plantTypes, seedTypes, terrainTypes, movableTypes, baseType};
}