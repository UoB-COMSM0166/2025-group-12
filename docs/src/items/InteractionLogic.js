class InteractionLogic {

    static setup(bundle) {
        /** @type {typeof myUtil} */
        InteractionLogic.utilityClass = bundle.utilityClass;
        InteractionLogic.FloatingWindow = bundle.FloatingWindow;
        InteractionLogic.movableTypes = bundle.movableTypes;
        InteractionLogic.itemTypes = bundle.itemTypes;
        InteractionLogic.plantTypes = bundle.plantTypes;
        /** @type {typeof BoardLogic} */
        InteractionLogic.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {SeedLike} seed
     */
    static findSeedAndDelete(playBoard, seed) {
        let cells = InteractionLogic.BoardLogic.getAllCellsWithSeed(playBoard.boardObjects);
        let cell = cells.find(c => c.seed === seed);
        if (cell !== null) {
            cell.removeSeed();
        }
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {PlantLike} plant
     */
    static findPlantAndDelete(playBoard, plant) {
        let cells = InteractionLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
        let cell = cells.find(c => c.plant === plant);
        if (cell !== null) {
            cell.removePlant();
        }
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param movable
     */
    static findMovableAndDelete(playBoard, movable) {
        let index = playBoard.movables.findIndex(e => e === movable);
        if (index === -1) {
            return;
        }
        if(movable.cell) movable.cell.enemy = null;
        playBoard.movables.splice(index, 1);
        playBoard.movables.sort((a, b) => {
            if (a.movableType != null && b.movableType != null) {
                return a.movableType - b.movableType;
            }
            if (a.movableType != null) return -1;
            if (b.movableType != null) return 1;
            return 0;
        });
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param item
     * @param {number} lost
     */
    static plantIsAttacked(playBoard, item, lost) {
        if (item.type === InteractionLogic.itemTypes.PLANT) {
            /** @type {PlantLike} */
            let plant = item;
            plant.health -= lost;
            if (plant.health <= 0) {
                plant.health = 0;
                plant.status = false;
                InteractionLogic.findPlantAndDelete(playBoard, plant);
            }
        } else if (item.type === InteractionLogic.itemTypes.SEED) {
            /** @type {SeedLike} */
            let seed = item;
            seed.health = 0;
            seed.status = false;
            InteractionLogic.findSeedAndDelete(playBoard, seed);
        } else {
            console.error("plantAttacked has received invalid plant or seed.");
        }
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} spellCasterCell
     * @param {CellModel} targetCell
     * @param n
     */
    static rechargeHP(playBoard, spellCasterCell, targetCell, n) {
        if (!InteractionLogic.checkActiveSkill(playBoard, spellCasterCell, targetCell)) return false;

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

    // a basic version, no animal friend animation. refactor
    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} spellCasterCell
     * @param {CellModel} targetCell
     */
    static sendAnimalFriends(playBoard, spellCasterCell, targetCell) {
        if (!InteractionLogic.checkActiveSkill(playBoard, spellCasterCell, targetCell)) return false;

        if (!targetCell.enemy || targetCell.enemy.movableType !== InteractionLogic.movableTypes.BANDIT) {
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

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} spellCasterCell
     * @param {CellModel} targetCell
     */
    static checkActiveSkill(playBoard, spellCasterCell, targetCell) {
        // ran out of usage
        if (spellCasterCell.plant.useLeft === 0) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("051"));
            return false;
        }
        // out of skill range
        if (!InteractionLogic.activeRange1(spellCasterCell.i, spellCasterCell.j, targetCell.i, targetCell.j)) {
            playBoard.floatingWindow = InteractionLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("052"));
            return false;
        }
        return true;
    }

    static activeRange1(i1, j1, i2, j2) {
        return InteractionLogic.utilityClass.manhattanDistance(i1, j1, i2, j2) <= 2;
    }
}

export {InteractionLogic};

if (typeof module !== 'undefined') {
    module.exports = {InteractionLogic};
}