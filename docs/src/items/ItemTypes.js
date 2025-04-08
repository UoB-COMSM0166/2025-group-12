// make itemTypes distinct from other types on numeric values
export let itemTypes = {
    PLANT: 1000,
    SEED: 1001,
    ENEMY: 1002,
    TERRAIN: 1003,
    UNKNOWN: 1004,
}

// notice: the order of plants and seed in the inventory follows below ordering.
export let plantTypes = {
    BAMBOO: 2,
    ORCHID: 8,
    FIRE_HERB: 10,
    PLUM: 12,
    KIKU: 14,
    PALM: 16,

    TREE: 90,
    BUSH: 92,
    GRASS: 94,
}
export let seedTypes = {
    BAMBOO: 3,
    ORCHID: 9,
    FIRE_HERB: 11,
    PLUM: 13,
    KIKU: 15,
    PALM: 17,

    TREE: 91,
    BUSH: 93,
    GRASS: 95,
}

export let terrainTypes = {
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
export let movableTypes = {
    ANIMAL: 0,
    EARTHQUAKE: 100,
    SLIDE: 105,
    TSUNAMI: 110,
    BOMB: 115,
    TORNADO: 120,
    BLIZZARD: 125,
    BANDIT: 130,
}

export function baseType(plantOrSeed) {
    if (plantOrSeed.type === itemTypes.PLANT) {
        if (plantOrSeed.plantType === plantTypes.TREE || plantOrSeed.plantType === plantTypes.BAMBOO || plantOrSeed.plantType === plantTypes.PALM) {
            return plantTypes.TREE;
        } else if (plantOrSeed.plantType === plantTypes.BUSH || plantOrSeed.plantType === plantTypes.PLUM) {
            return plantTypes.BUSH;
        } else if (plantOrSeed.seedType === seedTypes.GRASS || plantOrSeed.plantType === plantTypes.ORCHID || plantOrSeed.plantType === plantTypes.FIRE_HERB || plantOrSeed.seedType === seedTypes.KIKU) {
            return plantTypes.GRASS;
        }
    } else if (plantOrSeed.type === itemTypes.SEED) {
        if (plantOrSeed.seedType === seedTypes.TREE || plantOrSeed.seedType === seedTypes.BAMBOO || plantOrSeed.plantType === plantTypes.PALM) {
            return seedTypes.TREE;
        } else if (plantOrSeed.seedType === seedTypes.BUSH || plantOrSeed.seedType === seedTypes.PLUM) {
            return seedTypes.BUSH;
        } else if (plantOrSeed.seedType === seedTypes.GRASS || plantOrSeed.seedType === seedTypes.ORCHID || plantOrSeed.seedType === seedTypes.FIRE_HERB || plantOrSeed.seedType === seedTypes.KIKU) {
            return seedTypes.GRASS;
        }
    }
    return itemTypes.UNKNOWN;
}