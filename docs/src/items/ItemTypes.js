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

function isTree(plantTypes){
    return plantTypes === plantTypes.TREE;
}

function isTreeSeed(seedTypes){
    return seedTypes === seedTypes.TREE;
}

function isBush(plantTypes){
    return plantTypes === plantTypes.BUSH;
}

function isBushSeed(seedTypes){
    return seedTypes === seedTypes.BUSH;
}

function isGrass(plantTypes){
    return plantTypes === plantTypes.GRASS || plantTypes === plantTypes.FIRE_HERB;
}

function isGrassSeed(seedTypes){
    return seedTypes === seedTypes.GRASS || seedTypes === seedTypes.FIRE_HERB;
}