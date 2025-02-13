import { itemTypes, plantTypes } from "./ItemTypes.js";
import { Storm } from "./Storm.js";
import { Plant } from "./Plant.js";

export class plantEnemyInteraction {
    static plantAttackedByStorm(plant, storm) {
        if (!(plant instanceof Plant) || !(storm instanceof Storm)) {
            console.log("plantAttackedByStorm has received invalid input.");
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
            return;
        }
        else {
            // other plants attacked by a storm, one of them dies first or they die simultaneously
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

    }
}