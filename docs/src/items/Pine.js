/**
 * @implements {PlantLike}
 */
class PineModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Pine";
        this.color = "rgb(0,255,21)";
        this.plantType = plantTypes.PINE;
        this.img = p5.images.get(`${this.name}`);

        this.seed = PineSeedModel;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // passive: lose up to 2 health when attacked by Tornado.
        // active: can recharge a nearby plant's health by 1. with bush and grass.
        // extend: when a bush is placed next to it, passive ability extends.
        this.hasActive = false;
        this.hasExtended = false;

        // to set limit of active skill usage in one turn. reset at end of turn.
        this.useLeft = 1;
        this.maxUse = 1;
    }

    getPassiveString() {
        if (this.hasExtended) {
            return "Stops an incoming tornado from nearby 8 cells and lose up to 2 HP.";
        }
        return "Stops an incoming tornado and lose up to 2 HP.";
    }

    getActiveString() {
        if (this.hasActive) {
            return "Heal a nearby plant's HP by 1.";
        }
        return "No active skill now.";
    }
}

class PineRenderer {
}

class PineLogic {
    static setup(bundle) {
        PineLogic.baseType = bundle.baseType;
        PineLogic.plantTypes = bundle.plantTypes;

        /** @type {typeof BoardLogic} */
        PineLogic.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     * @param {PineModel} pine
     */
    static reevaluateSkills(playBoard, cell, pine) {
        if (cell.plant !== pine) {
            console.error("reevaluateSkills of Pine has received wrong cell.");
            return;
        }

        // set all skills to false first.
        pine.hasActive = false;
        pine.hasExtended = false;

        let adjacentCells = PineLogic.BoardLogic.getAdjacent4Cells(cell.i, cell.j, playBoard.boardObjects);
        // when a bush is next to this pine, it gains extended passive skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && PineLogic.baseType(adCell.plant) === PineLogic.plantTypes.BUSH) {
                pine.hasExtended = true;
                break;
            }
        }
        // when a bush and a grass is next to this pine, it gains active.
        if (pine.hasExtended) {
            for (let adCell of adjacentCells) {
                if (adCell.plant !== null && PineLogic.baseType(adCell.plant) === PineLogic.plantTypes.GRASS) {
                    pine.hasActive = true;
                    break;
                }
            }
        }
    }
}

class PineSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "PineSeed";
        this.color = "rgb(0,255,21)";
        this.seedType = seedTypes.PINE;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

class PineSeedRenderer {
}

class PineSeedLogic {
}

export {PineModel, PineLogic, PineRenderer, PineSeedModel, PineSeedRenderer, PineSeedLogic};

if (typeof module !== 'undefined') {
    module.exports = {PineModel, PineLogic, PineRenderer, PineSeedModel, PineSeedRenderer, PineSeedLogic};
}