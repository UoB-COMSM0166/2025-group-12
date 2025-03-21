import {myutil} from "../../lib/myutil.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {FloatingWindow} from "../model/FloatingWindow.js";

export class PlantActive {

    static rechargeHP(playBoard, spellCasterCell, targetCell, n) {
        if (spellCasterCell.plant.useLeft === 0) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("051"));
            return false;
        }

        if (!PlantActive.activeRange1(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y)) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("052"));
            return false;
        }

        let item;
        if (targetCell.plant) {
            item = targetCell.plant;
        } else if (targetCell.seed) {
            item = targetCell.seed;
        } else {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            return false;
        }

        if (item.health === item.maxHealth) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("053"));
            return false;
        }

        item.health += n;
        if (item.health > item.maxHealth) {
            item.health = item.maxHealth;
        }
        spellCasterCell.plant.useLeft--;
        return true;
    }

    static sendAnimalFriends(playBoard, spellCasterCell, targetCell) {
        if (spellCasterCell.plant.useLeft === 0) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("051"));
            return false;
        }

        // a basic version, no animal friends.

        if (!PlantActive.activeRange1(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y)) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("052"));
            return false;
        }

        if (targetCell.enemy === null || targetCell.enemy.name !== "Bandit") {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            return false;
        }

        let target = targetCell.enemy;
        target.health--;
        if (target.health === 0) {
            target.status = false;
            plantEnemyInteractions.findMovableAndDelete(playBoard, target);
            targetCell.enemy = null;
        }
        spellCasterCell.plant.useLeft--;
        return true;
    }

    static activeRange1(i1, j1, i2, j2) {
        return myutil.manhattanDistance(i1, j1, i2, j2) <= 2;
    }
}