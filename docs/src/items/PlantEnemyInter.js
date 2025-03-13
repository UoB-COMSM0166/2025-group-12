import {itemTypes, plantTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {Tornado} from "./Tornado.js";
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
            playBoard.boardObjects.setEcosystem();
        }
    }

    static findMovableAndDelete(playBoard, movable) {
        let index = playBoard.movables.findIndex(e => e === movable);
        if (index === -1) {
            return;
        }
        playBoard.movables.splice(index, 1);
        playBoard.movables.sort((a, b) => {
            if (a.enemyType !== undefined && b.enemyType !== undefined) {
                return a.enemyType - b.enemyType;
            }
            if (a.enemyType !== undefined) return -1;
            if (b.enemyType !== undefined) return 1;
            return 0;
        });
    }

    static plantAttackedByTornado(playBoard, item, tornado) {
        if (!playBoard || !(playBoard instanceof PlayBoard)) {
            console.error("plantAttackedByTornado has received invalid board.");
            return;
        }
        if (!(tornado instanceof Tornado)) {
            console.error("plantAttackedByTornado has received invalid tornado.");
            return;
        }

        let plant = null, seed = null;
        if (item instanceof Plant) {
            plant = item;
        } else if (item instanceof Seed) {
            seed = item;
        } else {
            console.error("plantAttackedByTornado has received invalid plant or seed.");
            return;
        }

        if (seed !== null) {
            seed.health = 0;
            plantEnemyInteractions.findSeedAndDelete(playBoard, seed);
            tornado.health--;
            if (tornado.health === 0) {
                tornado.status = false;
            }
            if (tornado.status === false) {
                plantEnemyInteractions.findMovableAndDelete(playBoard, tornado);
            }
        }

        if (plant !== null) {
            // if a tree is attacked by a tornado
            if (plant.plantType === plantTypes.TREE && plant.name === "Tree") {
                for (let i = 0; i<2 && plant.health > 0 && tornado.health > 0; i++) {
                    plant.health--;
                    tornado.health--;
                }
                if (plant.health === 0) {
                    plant.status = false;
                }
                tornado.health = 0;
                tornado.status = false;
            } else {
                // other plants attacked by a tornado, one of them dies first, or they die simultaneously
                while (plant.health > 0 && tornado.health > 0) {
                    plant.health--;
                    tornado.health--;
                }
                if (plant.health === 0) {
                    plant.status = false;
                }
                if (tornado.health === 0) {
                    tornado.status = false;
                }
            }
            if (plant.status === false) {
                plantEnemyInteractions.findPlantAndDelete(playBoard, plant);
            }
            if (tornado.status === false) {
                plantEnemyInteractions.findMovableAndDelete(playBoard, tornado);
            }
        }

    }

    static plantIsAttacked(playBoard, item, lost) {
        if (!playBoard || !(playBoard instanceof PlayBoard)) {
            console.error("plantAttacked1 has received invalid board.");
            return;
        }
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
            console.error("plantAttacked1 has received invalid plant or seed.");
        }
    }
}