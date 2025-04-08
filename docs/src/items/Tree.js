export class TreeModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Tree";
        this.color = "rgb(0,255,21)";
        this.plantType = plantTypes.TREE;
        this.img = p5.images.get(`${this.name}`);

        this.seed = TreeSeedModel;

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
}

export class TreeRenderer {
    static getPassiveString(tree) {
        if (tree.hasExtended) {
            return "Stops an incoming tornado from nearby 8 cells and lose up to 2 HP.";
        }
        return "Stops an incoming tornado and lose up to 2 HP.";
    }

    static getActiveString(tree) {
        if (tree.hasActive) {
            return "Heal a nearby plant's HP by 1.";
        }
        return "No active skill now.";
    }
}

export class TreeLogic {
    static setup(bundle) {
        TreeLogic.baseType = bundle.baseType;
        TreeLogic.plantTypes = bundle.plantTypes;
    }

    static reevaluateSkills(bundle) {
        let tree = bundle.plant;
        let playBoard = bundle.playBoard;
        let cell = bundle.cell;

        if (cell.plant !== tree) {
            console.error("reevaluateSkills of Tree has received wrong cell.");
            return;
        }

        // set all skills to false first.
        tree.hasActive = false;
        tree.hasExtended = false;

        let adjacentCells = playBoard.boardObjects.getAdjacent4Cells(cell.x, cell.y);
        // when a bush is next to this tree, it gains extended passive skill.
        for (let adCell of adjacentCells) {
            if (adCell.plant !== null && TreeLogic.baseType(adCell.plant) === TreeLogic.plantTypes.BUSH) {
                tree.hasExtended = true;
                break;
            }
        }
        // when a bush and a grass is next to this tree, it gains active.
        if (tree.hasExtended) {
            for (let adCell of adjacentCells) {
                if (adCell.plant !== null && TreeLogic.baseType(adCell.plant) === TreeLogic.plantTypes.GRASS) {
                    tree.hasActive = true;
                    break;
                }
            }
        }
    }
}

export class TreeSerializer {
}

export class TreeSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "TreeSeed";
        this.color = "rgb(0,255,21)";
        this.seedType = seedTypes.TREE;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class TreeSeedRenderer {
}

export class TreeSeedLogic {
}

export class TreeSeedSerializer {
}
