import { itemTypes, plantTypes } from "./ItemTypes.js";
import { plantEnemyInteractions } from "./PlantEnemyInter.js";
export class Plant{
    constructor(){
        this.type = itemTypes.PLANT;
    }

    checkCollision(enemies){
        for(let enemy of enemies){
            if (
                // reduce the hit box to half of the size to avoid misCollision
                enemy.x < this.x + this.width/2 &&
                enemy.x + enemy.width/2 > this.x &&
                enemy.y < this.y + this.height/2 &&
                enemy.y + enemy.height/2 > this.y
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