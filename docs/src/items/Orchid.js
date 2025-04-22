/**
 * @implements {PlantLike}
 */
class OrchidModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Orchid";
        this.color = "rgb(250,240,180)";
        this.plantType = plantTypes.ORCHID;
        this.img = p5.images.get("Orchid1");
        this.imgs = [];
        this.pointer = 0;
        for (let i = 1; i <= 80; i++) {
            this.imgs.push(p5.images.get("Orchid" + i.toString()));
        }

        this.seed = OrchidSeedModel;

        this.health = 1;
        this.maxHealth = 1;
        this.status = true;

        // active: send animal friends to attack outlaw.
        this.hasActive = false;

        // to set limit of active skill usage in one turn. reset at end of turn.
        this.useLeft = 1;
        this.maxUse = 1;
    }

    getPassiveString() {
        return "No passive skill.";
    }

    getActiveString() {
        if (this.hasActive) {
            return "Send animal friends to attack a nearby group of bandits.";
        }
        return "No active skill now.";
    }
}

class OrchidRenderer {
}

class OrchidLogic {
    static setup(bundle) {
        OrchidLogic.baseType = bundle.baseType;
        OrchidLogic.plantTypes = bundle.plantTypes;

        /** @type {typeof BoardLogic} */
        OrchidLogic.BoardLogic = bundle.BoardLogic;
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {CellModel} cell
     * @param {OrchidModel} orchid
     */
    static reevaluateSkills(playBoard, cell, orchid) {
        if (cell.plant !== orchid) {
            console.error("reevaluateSkills of Orchid has received wrong cell.");
            return;
        }
        // set all skills to false first.
        orchid.hasActive = false;
        let adjacentCells = OrchidLogic.BoardLogic.getAdjacent4Cells(cell.i, cell.j, playBoard.boardObjects);
        // when a Tree is next to this Orchid, it gains active skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && OrchidLogic.baseType(adCell.plant) === OrchidLogic.plantTypes.TREE) {
                orchid.hasActive = true;
                break;
            }
        }
    }
}

class OrchidSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "OrchidSeed";
        this.color = "rgb(250,240,180)";
        this.seedType = seedTypes.ORCHID;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

class OrchidSeedRenderer {
}

class OrchidSeedLogic {
}

export {OrchidModel, OrchidLogic, OrchidRenderer, OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer};

if (typeof module !== 'undefined') {
    module.exports = {OrchidModel, OrchidLogic, OrchidRenderer, OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer};
}