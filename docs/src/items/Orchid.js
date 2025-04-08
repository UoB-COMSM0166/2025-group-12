export class OrchidModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Orchid";
        this.color = "rgb(250,240,180)";
        this.plantType = plantTypes.ORCHID;
        this.img = p5.images.get(`${this.name}`);

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
}

export class OrchidRenderer {
    static getPassiveString(orchid) {
        return "No passive skill.";
    }

    static getActiveString(orchid) {
        if (orchid.hasActive) {
            return "Send animal friends to attack a nearby group of bandits.";
        }
        return "No active skill now.";
    }
}

export class OrchidLogic {
    static setup(bundle) {
        OrchidLogic.baseType = bundle.baseType;
        OrchidLogic.plantTypes = bundle.plantTypes;
    }

    static reevaluateSkills(bundle) {
        let orchid = bundle.plant;
        let playBoard = bundle.playBoard;
        let cell = bundle.cell;

        if (cell.plant !== this) {
            console.error("reevaluateSkills of Orchid has received wrong cell.");
            return;
        }

        // set all skills to false first.
        this.hasActive = false;
        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a Tree is next to this Orchid, it gains active skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && OrchidLogic.baseType(adCell.plant) === OrchidLogic.plantTypes.TREE) {
                this.hasActive = true;
                break;
            }
        }
    }
}

export class OrchidSerializer {
}

export class OrchidSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "OrchidSeed";
        this.color = "rgb(250,240,180)";
        this.seedType = seedTypes.ORCHID;
        this.countdown = 1;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class OrchidSeedRenderer {
}

export class OrchidSeedLogic {
}

export class OrchidSeedSerializer {
}