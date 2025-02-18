import {myutil} from "../../lib/myutil.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";

export class PlantActive {

    static rechargeHP(spellCasterCell, targetCell, n) {
        if (spellCasterCell.plant.useLeft === 0) {
            console.log("the plant cannot activate skill any more this turn.")
            return false;
        }

        if (myutil.manhattanDistance(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y) > 2
            && myutil.euclideanDistance(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y) >= 2
        ) {
            console.log("cancelled rechargeHP since target is too far away from the spell caster.");
            return false;
        }

        let item;
        if (targetCell.plant) {
            item = targetCell.plant;
        } else if (targetCell.seed) {
            item = targetCell.seed;
        } else {
            console.log("rechargeHP received invalid target.");
            return false;
        }

        if (item.health === item.maxHealth) {
            console.log("you don't need to recharge the target since it is of full HP.");
            return false;
        }

        item.health += n;
        if (item.health > item.maxHealth) {
            item.health = item.maxHealth;
        }
        spellCasterCell.plant.useLeft--;
        return true;
    }

    static sendAnimalFriends(spellCasterCell, targetCell, playBoard) {
        if (spellCasterCell.plant.useLeft === 0) {
            console.log("the plant cannot activate skill any more this turn.")
            return false;
        }

        // a basic version, no animal friends.

        if (myutil.manhattanDistance(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y) > 2
            && myutil.euclideanDistance(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y) >= 2
        ) {
            console.log("cancelled sendAnimalFriends since target is too far away from the spell caster.");
            return false;
        }

        if (targetCell.enemy === null || targetCell.enemy.name !== "Bandit") {
            console.log("sendAnimalFriends received invalid target.");
            return false;
        }

        let target = targetCell.enemy;
        target.health--;
        if (target.health === 0) {
            target.status = false;
            plantEnemyInteractions.findEnemyAndDelete(playBoard, target);
            targetCell.enemy = null;
        }
        spellCasterCell.plant.useLeft--;
        return true;
    }
}