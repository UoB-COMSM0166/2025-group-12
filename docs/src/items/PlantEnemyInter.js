import {itemTypes, plantTypes} from "./ItemTypes.js";
import {PlayBoard} from "../model/Play.js";
import {Storm} from "./Storm.js";
import {Plant} from "./Plant.js";

export class plantEnemyInteractions {

    static findPlantAndDelete(playBoard, plant){
        let cells = playBoard.boardObjects.getAllCellsWithPlant();
        let cell = cells.find(c => c.plant === plant);
        if(cell !== null){}{
            cell.removePlant();
            playBoard.boardObjects.reconstructEcosystem();
        }
    }

    static findEnemyAndDelete(playBoard, enemy){
        let index = playBoard.enemies.findIndex(e => e===enemy);
        playBoard.enemies.splice(index, 1);
    }

    static plantAttackedByStorm(playBoard, plant, storm) {
        if(!playBoard || !(playBoard instanceof PlayBoard)) {
            console.log("plantAttackedByStorm has received invalid board.");
            return;
        }

        if (!(plant instanceof Plant) || !(storm instanceof Storm)) {
            console.log("plantAttackedByStorm has received invalid plant or storm.");
            return;
        }

        // if a tree is attacked by a storm
        if (plant.plantType === plantTypes.TREE && plant.name === "Tree") {
            plant.health--;
            if (plant.health === 0) {
                plant.status = false;
            }
            storm.health = 0;
            storm.status = false;
        }else{
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

        if(plant.status === false){
            plantEnemyInteractions.findPlantAndDelete(playBoard, plant);
        }
        if(storm.status === false){
            plantEnemyInteractions.findEnemyAndDelete(playBoard, storm);
        }
    }
}