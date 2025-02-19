import {itemTypes, plantTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {Storm} from "./Storm.js";
import {Plant} from "./Plant.js";
import {Seed} from "./Seed.js";

export class plantEnemyInteractions {

    static findSeedAndDelete(playBoard, seed) {
        let cells = playBoard.boardObjects.getAllCellsWithSeed();
        let cell = cells.find(c => c.seed === seed);
        if (cell !== null) {
            cell.removeSeed();
        }
    }

    static findPlantAndDelete(playBoard, plant) {
        let cells = playBoard.boardObjects.getAllCellsWithPlant();
        let cell = cells.find(c => c.plant === plant);
        if (cell !== null) {
            cell.removePlant();
            playBoard.boardObjects.reconstructEcosystem();
        }
    }

    static findEnemyAndDelete(playBoard, enemy) {
        let index = playBoard.enemies.findIndex(e => e === enemy);
        if (index === -1) {
            return;
        }
        playBoard.enemies.splice(index, 1);
        playBoard.enemies.sort((a, b) => a.enemyType - b.enemyType);
    }

    static plantAttackedByStorm(playBoard, item, storm) {
        if (!playBoard || !(playBoard instanceof PlayBoard)) {
            console.log("plantAttackedByStorm has received invalid board.");
            return;
        }
        if (!(storm instanceof Storm)) {
            console.log("plantAttackedByStorm has received invalid storm.");
            return;
        }

        let plant = null, seed = null;
        if (item instanceof Plant) {
            plant = item;
        } else if (item instanceof Seed) {
            seed = item;
        } else {
            console.log("plantAttackedByStorm has received invalid plant or seed.");
            return;
        }

        if (seed !== null) {
            seed.health = 0;
            plantEnemyInteractions.findSeedAndDelete(playBoard, seed);
            storm.health--;
            if (storm.health === 0) {
                storm.status = false;
            }
            if (storm.status === false) {
                plantEnemyInteractions.findEnemyAndDelete(playBoard, storm);
            }
        }

        if (plant !== null) {
            // if a tree is attacked by a storm
            if (plant.plantType === plantTypes.TREE && plant.name === "Tree") {
                plant.health--;
                if (plant.health === 0) {
                    plant.status = false;
                }
                storm.health = 0;
                storm.status = false;
            } else {
                // other plants attacked by a storm, one of them dies first, or they die simultaneously
                while (plant.health > 0 && storm.health > 0) {
                    plant.health--;
                    storm.health--;
                }
                if (plant.health === 0) {
                    plant.status = false;
                }
                if (storm.health === 0) {
                    storm.status = false;
                }
            }
            if (plant.status === false) {
                plantEnemyInteractions.findPlantAndDelete(playBoard, plant);
            }
            if (storm.status === false) {
                plantEnemyInteractions.findEnemyAndDelete(playBoard, storm);
            }
        }

    }

    static plantIsAttacked(playBoard, item, lost) {
        if (!playBoard || !(playBoard instanceof PlayBoard)) {
            console.log("plantAttacked1 has received invalid board.");
            return;
        }
        let plant = null, seed = null;
        if (item instanceof Plant) {
            item.health -= lost;
            if (item.health <= 0) {
                item.health = 0;
                item.status = false;
                plantEnemyInteractions.findPlantAndDelete(playBoard, item);
            }
        } else if (item instanceof Seed) {
            item.health = 0;
            item.status = false;
            plantEnemyInteractions.findSeedAndDelete(playBoard, item);
        } else {
            console.log("plantAttacked1 has received invalid plant or seed.");
        }
    }
}