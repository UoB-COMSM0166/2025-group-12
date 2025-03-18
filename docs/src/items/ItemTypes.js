import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";

export let itemTypes = {
    PLANT: 2,
    SEED: 4,
    ENEMY: 8,
    TERRAIN: 16
}

// notice: the order of plants and seed in the inventory follows below ordering.
export let plantTypes = {
    BAMBOO: 2,
    TREE: 4,
    BUSH: 6,
    GRASS: 8,
    FIRE_HERB: 10,
    PLUM: 12,
}
export let seedTypes = {
    BAMBOO: 3,
    TREE: 5,
    BUSH: 7,
    GRASS: 9,
    FIRE_HERB: 11,
    PLUM: 13,
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
}

// notice: the order of end turn actions refers to below ordering.
export let enemyTypes = {
    EARTHQUAKE: 100,
    SLIDE: 200,
    BOMB: 300,
    TORNADO: 400,
    BLIZZARD: 500,
    BANDIT: 600,
}

export function baseType(plantOrSeed) {
    if (plantOrSeed.type === itemTypes.PLANT) {
        if (plantOrSeed.plantType === plantTypes.TREE || plantOrSeed.plantType === plantTypes.BAMBOO) {
            return plantTypes.TREE;
        } else if (plantOrSeed.plantType === plantTypes.BUSH || plantOrSeed.plantType === plantTypes.PLUM) {
            return plantTypes.BUSH;
        } else if (plantOrSeed.plantType === plantTypes.GRASS || plantOrSeed.plantType === plantTypes.FIRE_HERB) {
            return plantTypes.GRASS;
        }
    } else if (plantOrSeed.type === itemTypes.SEED) {
        if (plantOrSeed.seedType === seedTypes.TREE || plantOrSeed.seedType === seedTypes.BAMBOO) {
            return seedTypes.TREE;
        } else if (plantOrSeed.seedType === seedTypes.BUSH || plantOrSeed.seedType === seedTypes.PLUM) {
            return seedTypes.BUSH;
        } else if (plantOrSeed.seedType === seedTypes.GRASS || plantOrSeed.seedType === seedTypes.FIRE_HERB) {
            return seedTypes.GRASS;
        }
    }
}