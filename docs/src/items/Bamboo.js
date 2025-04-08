export class BambooModel {
    constructor(p5, superModel, itemTypes, plantTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "Bamboo";
        this.color = "rgb(126,255,97)";
        this.plantType = plantTypes.BAMBOO;
        this.img = p5.images.get(`${this.name}`);

        this.seed = BambooSeedModel;

        this.health = 4;
        this.maxHealth = 4;
        this.status = true;
    }
}

export class BambooRenderer {
    static getPassiveString(bamboo) {
        return "Automatically spreads to all nearby landslide terrain and repair local environment."
    }

    static getActiveString(bamboo) {
        return "No active skill.";
    }
}

export class BambooLogic {
    static setup(bundle) {
        BambooLogic.terrainTypes = bundle.terrainTypes;
        BambooLogic.itemTypes = bundle.itemTypes;
        BambooLogic.plantTypes = bundle.plantTypes;
        BambooLogic.superModel = bundle.PlantModel;
    }

    static reevaluateSkills(bundle) {
    }

    static spreadBamboo(p5, playBoard, cell) {
        if (!cell.plant && !cell.seed) {
            cell.plant = new BambooModel(p5, BambooLogic.superModel, BambooLogic.itemTypes, BambooLogic.plantTypes);
        }

        for (let adCell of playBoard.boardObjects.getAdjacent8Cells(cell.x, cell.y)) {
            if (adCell.plant || adCell.seed) continue;

            if (adCell.terrain.terrainType === BambooLogic.terrainTypes.LANDSLIDE) {
                adCell.plant = new BambooModel(p5, BambooLogic.superModel, BambooLogic.itemTypes, BambooLogic.plantTypes);
                this.spreadBamboo(p5, adCell);
            }
        }
    }
}

export class BambooSerializer {
}


export class BambooSeedModel {
    constructor(p5, superModel, itemTypes, seedTypes) {
        Object.assign(this, new superModel(itemTypes));
        this.name = "BambooSeed";
        this.color = "rgb(126,255,97)";
        this.seedType = seedTypes.BAMBOO;
        this.countdown = 3;
        this.img = this.img = p5.images.get("Seed");
    }
}

export class BambooSeedRenderer {
}

export class BambooSeedLogic {
}

export class BambooSeedSerializer {
}