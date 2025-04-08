export class InteractionLogic {

    static setup(bundle){
        InteractionLogic.utilityClass = bundle.utilityClass;
        InteractionLogic.FloatingWindow = bundle.FloatingWindow;
        InteractionLogic.movableTypes = bundle.movableTypes;
        InteractionLogic.itemTypes = bundle.itemTypes;
        InteractionLogic.plantTypes = bundle.plantTypes;
    }

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
            if (a.movableType !== undefined && b.movableType !== undefined) {
                return a.movableType - b.movableType;
            }
            if (a.movableType !== undefined) return -1;
            if (b.movableType !== undefined) return 1;
            return 0;
        });
    }

    static plantAttackedByTornado(playBoard, item, tornado) {
        if (!(tornado.movableType === InteractionLogic.movableTypes.TORNADO)) {
            console.error("plantAttackedByTornado has received invalid tornado.");
            return;
        }

        let plant = null, seed = null;
        if (item.type === InteractionLogic.itemTypes.PLANT) {
            plant = item;
        } else if (item.type === InteractionLogic.itemTypes.SEED) {
            seed = item;
        } else {
            console.error("plantAttackedByTornado has received invalid plant or seed.");
            return;
        }

        if (seed !== null) {
            seed.health = 0;
            InteractionLogic.findSeedAndDelete(playBoard, seed);
            tornado.health--;
            if (tornado.health === 0) {
                tornado.status = false;
            }
            if (tornado.status === false) {
                InteractionLogic.findMovableAndDelete(playBoard, tornado);
            }
        }

        if (plant !== null) {
            // if a tree is attacked by a tornado
            if (plant.plantType === InteractionLogic.plantTypes.TREE && plant.name === "Tree") {
                for (let i = 0; i < 2 && plant.health > 0 && tornado.health > 0; i++) {
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
                InteractionLogic.findPlantAndDelete(playBoard, plant);
            }
            if (tornado.status === false) {
                InteractionLogic.findMovableAndDelete(playBoard, tornado);
            }
        }

    }

    static plantIsAttacked(playBoard, item, lost) {
        if (item.type === InteractionLogic.itemTypes.PLANT) {
            item.health -= lost;
            if (item.health <= 0) {
                item.health = 0;
                item.status = false;
                InteractionLogic.findPlantAndDelete(playBoard, item);
            }
        } else if (item.type === InteractionLogic.itemTypes.SEED) {
            item.health = 0;
            item.status = false;
            InteractionLogic.findSeedAndDelete(playBoard, item);
        } else {
            console.error("plantAttacked1 has received invalid plant or seed.");
        }
    }

    static rechargeHP(playBoard, spellCasterCell, targetCell, n) {
        if (spellCasterCell.plant.useLeft === 0) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("051"));
            return false;
        }

        if (!InteractionLogic.activeRange1(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y)) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("052"));
            return false;
        }

        let item;
        if (targetCell.plant) {
            item = targetCell.plant;
        } else if (targetCell.seed) {
            item = targetCell.seed;
        } else {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            return false;
        }

        if (item.health === item.maxHealth) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("053"));
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
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("051"));
            return false;
        }

        // a basic version, no animal friends.

        if (!InteractionLogic.activeRange1(spellCasterCell.x, spellCasterCell.y, targetCell.x, targetCell.y)) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("052"));
            return false;
        }

        if (targetCell.enemy === null || targetCell.enemy.name !== "Bandit") {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("050"));
            return false;
        }

        let target = targetCell.enemy;
        target.health--;
        if (target.health === 0) {
            target.status = false;
            InteractionLogic.findMovableAndDelete(playBoard, target);
            targetCell.enemy = null;
        }
        spellCasterCell.plant.useLeft--;
        return true;
    }

    static activeRange1(i1, j1, i2, j2) {
        return InteractionLogic.utilityClass.manhattanDistance(i1, j1, i2, j2) <= 2;
    }
}