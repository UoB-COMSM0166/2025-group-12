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
    TREE: 2,
    BUSH: 4,
    GRASS: 6,
    FIRE_HERB: 8,
}
export let seedTypes = {
    TREE: 3,
    BUSH: 5,
    GRASS: 7,
    FIRE_HERB: 9,
}

export let terrainTypes = {
    RUIN: 0,
    BASE: 1,
    MOUNTAIN: 2,
    RIVER: 3,
    BRIDGE: 4,
    STEPPE: 5,
    LUMBERING: 6,
    VOLCANO: 7,
    LAVA: 8,
}

// notice: the order of end turn actions refers to below ordering.
export let enemyTypes = {
    BOMB: 10,
    TORNADO: 100,
    BANDIT: 200,
    LAVA: 300,
}

export function baseType(plantOrSeed){
    if(plantOrSeed instanceof Plant){
        if(plantOrSeed.plantType === plantTypes.TREE){
            return plantTypes.TREE;
        }else if(plantOrSeed.plantType === plantTypes.BUSH){
            return plantTypes.BUSH;
        }else if(plantOrSeed.plantType === plantTypes.GRASS || plantOrSeed.plantType === plantTypes.FIRE_HERB){
            return plantTypes.GRASS;
        }
    }else if (plantOrSeed instanceof Seed){
        if(plantOrSeed.seedType === seedTypes.TREE){
            return seedTypes.TREE;
        }else if (plantOrSeed.seedType === seedTypes.BUSH){
            return seedTypes.BUSH;
        }else if (plantOrSeed.seedType === seedTypes.GRASS || plantOrSeed.seedType === seedTypes.FIRE_HERB){
            return seedTypes.GRASS;
        }
    }
}