import {myutil} from "../../lib/myutil.js";

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

    static sendAnimalFriends(spellCasterCell, targetCell) {
        if (spellCasterCell.plant.useLeft === 0) {
            console.log("the plant cannot activate skill any more this turn.")
            return false;
        }

        console.log("no effect at this moment.")
    }
}