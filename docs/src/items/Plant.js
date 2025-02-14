import { itemTypes, plantTypes } from "./ItemTypes.js";
import { plantEnemyInteractions } from "./PlantEnemyInter.js";
export class Plant{
    constructor(){
        this.type = itemTypes.PLANT;
    }

    getPassiveString(){
        console.log("getPassiveString not overridden.");
    }

    getActiveString(){
        console.log("getActiveString not overridden.");
    }

    checkCollision(enemies){
        for(let enemy of enemies){
            if (
                // reduce the hitbox to half of the size to avoid misCollision
                enemy.x === this.x
            ){
                plantEnemyInteractions.plantAttackedByStorm(this, enemy);
                console.log('trigger');
                return true;
            }
            else{
                return false;
            }
        }
    }
}