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
    GRASS: 6
}
export let seedTypes = {
    TREE: 3,
    BUSH: 5,
    GRASS: 7
}

export let terrainTypes = {
    RUIN: 0,
    BASE: 1,
    MOUNTAIN: 2,
    RIVER: 4,
    BRIDGE: 8,
    STEPPE: 16
}

// notice: the order of end turn action refers to below ordering.
export let enemyTypes = {
    TORNADO: 100,
    BANDIT: 200
}