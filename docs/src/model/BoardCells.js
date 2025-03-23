import {baseType, enemyTypes, itemTypes, plantTypes, seedTypes, terrainTypes} from "../items/ItemTypes.js";
import {Plant} from "../items/Plant.js";
import {Seed} from "../items/Seed.js";
import {Bandit, Lumbering} from "../items/Bandit.js";
import {Tornado} from "../items/Tornado.js";
import {FloatingWindow} from "./FloatingWindow.js";
import {UnionFind} from "../controller/UnionFind.js";
import {myutil} from "../../lib/myutil.js";
import {Bamboo} from "../items/Bamboo.js";
import {Hill, Landslide} from "../items/Earthquake.js";
import {stageGroup} from "./GameState.js";
import {Plum, Snowfield} from "../items/Blizzard.js";
import {Steppe} from "../items/Steppe.js";
import {Tree, TreeSeed} from "../items/Tree.js";
import {Grass, GrassSeed} from "../items/Grass.js";
import {Terrain} from "../items/Terrain.js";
import {Bush, BushSeed} from "../items/Bush.js";
import {Lava, Volcano} from "../items/Volcano.js";
import {PlayerBase} from "../items/PlayerBase.js";
import {Mountain} from "../items/Mountain.js";

export class BoardCells {
    constructor(size) {
        this.size = size;
        // initially the array is empty since we have to
        // manually set terrain for every cell
        this.boardObjects = Array.from({length: this.size},
            () => Array.from({length: this.size}, () => null));
    }

    // to set terrain, invoke this function
    setCell(x, y, terrain) {
        this.boardObjects[x][y] = new Cell(x, y, terrain);
    }

    // plant on a cell
    plantCell(p5, playBoard, x, y, item) {
        let cell = this.getCell(x, y);

        if (item.type !== itemTypes.PLANT && item.type !== itemTypes.SEED) {
            console.error("plantCell received invalid input.");
            return false;
        }

        if (!cell.isCompatible(playBoard, item)) {
            return false;
        }

        // the implementation of ecosystem skill: grow faster
        if (item.type === itemTypes.SEED) {
            cell.seed = item;
            if (cell.ecosystem !== null && cell.ecosystem.growFaster) {
                cell.seed.countdown = cell.seed.countdown - 1 < 1 ? 1 : cell.seed.countdown - 1;
            }
            if (cell.terrain.terrainType === terrainTypes.LAVA) {
                cell.seed.countdown = 1;
            }

            return true;
        }

        cell.plant = item;

        // reconstruct ecosystem for every transplanting
        this.setEcosystem();

        // plums dissolve snowfield
        if (item.plantType === plantTypes.PLUM) {
            for (let nCell of this.getNearbyCells(cell.x, cell.y, Plum.plumRange)) {
                if (nCell.terrain.terrainType === terrainTypes.SNOWFIELD) {
                    nCell.terrain = new Steppe(p5);
                }
            }
        }

        return true;
    }

    removePlant(x, y) {
        this.getCell(x, y).removePlant();
        this.setEcosystem();
    }

    getCell(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return null;
        }
        return this.boardObjects[x][y];
    }

    getAllCellsWithPlant() {
        let cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.getCell(i, j).plant !== null) {
                    cells.push(this.getCell(i, j));
                }
            }
        }
        return cells;
    }

    getAllCellsWithSeed() {
        let cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.getCell(i, j).seed !== null) {
                    cells.push(this.getCell(i, j));
                }
            }
        }
        return cells;
    }

    getAllCellsWithEnemy() {
        let cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.getCell(i, j).enemy !== null) {
                    cells.push(this.getCell(i, j));
                }
            }
        }
        return cells;
    }

    // return a descriptive string
    getCellString(x, y) {
        if (this.getCell(x, y) === null) {
            return `cell at (${x},${y}) is null!`
        }

        let t = this.getCell(x, y).terrain;
        let p = this.getCell(x, y).plant;
        let s = this.getCell(x, y).seed;
        let e = this.getCell(x, y).enemy;

        if (t === null) {
            return `cell at (${x},${y}) is missing terrain!`;
        }

        if (p === null && s === null && e === null) {
            //return `cell at (${x},${y}) is of terrain ${t.name}.`;
            return `terrain ${t.name}`;
        }

        if (e !== null) {
            //return `cell at (${x},${y}) is of terrain ${t.name} and has a ${e.name} with health ${e.health}.`;
            return `terrain ${t.name} and has a ${e.name} of health ${e.health}.`;
        }

        if (s !== null) {
            //return `cell at (${x},${y}) is of terrain ${t.name} and has a ${s.name} which grows up in ${s.countdown} turns.`;
            return `terrain ${t.name} and has a ${s.name} which grows up in ${s.countdown} turns.`;
        }

        //return `cell at (${x},${y}) is of terrain ${t.name} and has a plant ${p.name} with health ${p.health}.`;
        return `terrain ${t.name} and has a plant ${p.name} of health ${p.health}.`;
    }

    setEcosystem() {
        let allPlants = this.getAllCellsWithPlant();
        let uf = new UnionFind(allPlants.length);

        let cellIndexMap = new Map(); // the variables of UF data structure are integers
        allPlants.forEach((c, index) => cellIndexMap.set(c, index));

        // step1: construct UF. if one plant is in adjacent 8 of another, they are connected.
        for (let i = 0; i < allPlants.length; i++) {
            for (let j = i + 1; j < allPlants.length; j++) {
                let cell1 = allPlants[i];
                let cell2 = allPlants[j];
                if (Math.abs(cell1.x - cell2.x) <= 1 && Math.abs(cell1.y - cell2.y) <= 1) {
                    uf.union(i, j);
                }
            }
        }

        // step2: get all connected components.
        let connectedComponents = new Map(); // <RootID, componentArray>
        for (let i = 0; i < allPlants.length; i++) {
            let root = uf.find(i);
            if (connectedComponents.has(root)) continue;
            connectedComponents.set(root, uf.getComponent(i).map(index => allPlants[index]));
        }

        // step3: Determine which components qualify for an ecosystem
        let ecosystemQualification = new Map();

        for (let [root, component] of connectedComponents.entries()) {

            // 1. loop through all plants
            for (let cell of component) {
                let plantTypesSet = new Set();
                plantTypesSet.add(baseType(cell.plant));
                // 2. loop through 4 adjacent cells
                for (let adCell of this.getAdjacent4Cells(cell.x, cell.y)) {
                    if (adCell.plant === null) continue;
                    plantTypesSet.add(baseType(adCell.plant));
                    // 3. further loop through 4 adjacent cells
                    for (let adAdCell of this.getAdjacent4Cells(adCell.x, adCell.y)) {
                        if (adAdCell.plant === null) continue;
                        plantTypesSet.add(baseType(adAdCell.plant));
                    }
                }
                // If 3 different plant types exist, mark as ecosystem
                if (plantTypesSet.size >= 3) {
                    ecosystemQualification.set(root, true);
                    break;
                }
            }
        }

        // step4: create and assign ecosystem.
        for (let [root, component] of connectedComponents.entries()) {
            if (!ecosystemQualification.get(root)) continue;

            let ecosystem = this.createEcosystem(component);
            for (let cell of component) {
                cell.ecosystem = ecosystem;
                for (let adCell of this.getAdjacent8Cells(cell.x, cell.y)) {
                    // tiebreaker: when two ecosystems are overlapped but not connected
                    if (adCell.ecosystem !== null && adCell.ecosystem !== ecosystem && adCell.ecosystem.countPlants >= ecosystem.countPlants) {
                        continue;
                    }
                    adCell.ecosystem = ecosystem;
                }
            }
        }
    }

    createEcosystem(component) {
        let ecosystem = new Ecosystem(component.length);

        // Assign special abilities
        for (let cell of component) {
            if (cell.plant.plantType === plantTypes.FIRE_HERB && component.length >= 10) {
                ecosystem.rejectLava = true;
                ecosystem.withstandSnow = true;
            }
        }
        return ecosystem;
    }


    getAdjacent8Cells(x, y) {
        let cells = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                if (0 <= x + i && x + i < this.size && 0 <= y + j && y + j < this.size) {
                    cells.push(this.getCell(x + i, y + j));
                }
            }
        }
        return cells;
    }

    getAdjacent4Cells(x, y) {
        let cells = [];
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [i, j] of directions) {
            if (0 <= x + i && x + i < this.size && 0 <= y + j && y + j < this.size) {
                cells.push(this.getCell(x + i, y + j));
            }
        }
        return cells;
    }

    getNearbyCells(x, y, range) {
        let cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (range(x, y, i, j)) {
                    cells.push(this.getCell(i, j));
                }
            }
        }
        return cells;
    }

    stringify() {
        const object = {
            size: this.size,
            boardObjects: Array.from({length: this.size},
                () => Array.from({length: this.size}, () => null))
        }
        for (let i = 0; i < object.boardObjects.length; i++) {
            for (let j = 0; j < object.boardObjects[i].length; j++) {
                object.boardObjects[i][j] = this.getCell(i, j).stringify();
            }
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let board = new BoardCells(object.size);
        for (let i = 0; i < object.size; i++) {
            for (let j = 0; j < object.size; j++) {
                board.boardObjects[i][j] = Cell.parse(object.boardObjects[i][j], i, j, p5);
            }
        }
        return board;
    }
}

class Cell {
    // constructor only involves terrain since
    // we will manually set terrain for all stages
    // but the right to plant is handed over to player.
    constructor(x, y, terrain) {
        if (terrain.type !== itemTypes.TERRAIN) {
            console.error(`failed to set cell at (${x},${y}) since the input is not terrain.`);
            return;
        }

        this.x = x;
        this.y = y;
        this._terrain = terrain;
        this._plant = null;
        this._seed = null;
        this._enemy = null;
        this.ecosystem = null;
    }

    // however we still need to change terrain
    // for game extensibility.
    set terrain(terrain) {
        if (terrain.type !== itemTypes.TERRAIN) {
            console.error(`failed to set cell at (${this.x},${this.y}) since the input is not terrain.`);
            return;
        }
        this._terrain = terrain;
    }

    get terrain() {
        return this._terrain;
    }

    // to remove a plant from a cell, use removePlant below.
    set plant(plant) {
        if (plant.type !== itemTypes.PLANT) {
            console.error(`failed to set cell at (${this.x},${this.y}) since the input is not plant.`);
            return;
        }
        this._plant = plant;
    }

    get plant() {
        return this._plant;
    }

    removePlant() {
        this._plant = null;
    }

    set seed(seed) {
        if (seed.type !== itemTypes.SEED) {
            console.error(`failed to set cell at (${this.x},${this.y}) since the input is not seed.`);
            return;
        }
        this._seed = seed;
    }

    get seed() {
        return this._seed;
    }

    removeSeed() {
        this._seed = null;
    }

    set enemy(enemy) {
        this._enemy = enemy;
    }

    get enemy() {
        return this._enemy;
    }

    getEcoString(playBoard) {
        if (this.ecosystem === null) {
            return "The cell is not in an ecosystem.";
        }
        return this.ecosystem.getEcoString(playBoard);
    }

    // check if plant or seed is compatible with the terrain, or if the cell is occupied by another plant.
    isCompatible(playBoard, item) {
        if (this.enemy !== null) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("010"));
            return false;
        }

        if (this.seed !== null || this.plant !== null) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("011"));
            return false;
        }

        // bamboo
        if (item?.plantType === plantTypes.BAMBOO) {
            if (this.terrain.terrainType === terrainTypes.STEPPE || this.terrain.terrainType === terrainTypes.HILL || this.terrain.terrainType === terrainTypes.LANDSLIDE) {
                return true;
            } else {
                playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
                return false;
            }
        }

        // plum
        if (item?.plantType === plantTypes.PLUM) {
            if (this.terrain.terrainType === terrainTypes.STEPPE || this.terrain.terrainType === terrainTypes.HILL || this.terrain.terrainType === terrainTypes.SNOWFIELD) {
                return true;
            } else {
                playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
                return false;
            }
        }

        // other plants
        if (this.terrain.terrainType === terrainTypes.MOUNTAIN || this.terrain.terrainType === terrainTypes.BASE
            || this.terrain.terrainType === terrainTypes.LUMBERING || this.terrain.terrainType === terrainTypes.VOLCANO
            || (this.terrain.terrainType === terrainTypes.LAVA && this.terrain.name === "Lava")
            || this.terrain.terrainType === terrainTypes.LANDSLIDE || this.terrain.terrainType === terrainTypes.SNOWFIELD) {
            playBoard.floatingWindow = FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
            return false;
        }
        return true;
    }

    drawTerrain(p5, playBoard) {
        let [x1, y1, x2, y2, x3, y3, x4, y4] = myutil.cellIndex2Pos(p5, playBoard, this.x, this.y, p5.CORNERS);
        p5.image(this.terrain.img, x1 - playBoard.cellWidth / 2, y1, playBoard.cellWidth, playBoard.cellHeight);
        if (this.ecosystem !== null && playBoard.ecoDisplay) {
            p5.fill('rgba(0%, 0%, 100%, 0.5)');
        } else {
            p5.fill(0, 0, 0, 0);
        }
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }


    stringify() {
        let object = {
            terrain: this._terrain,
            plant: this._plant,
            seed: this._seed,
            enemy: this._enemy
        }
        if (this.plant) {
            object.plant = this._plant.stringify();
        }
        if (this.seed) {
            console.log(this.seed);
            object.seed = this._seed.stringify();
            console.log(object.seed);
        }
        if (this.terrain) {
            object.terrain = this._terrain.stringify();
        }
        return JSON.stringify(object);
    }

    static parse(json, x, y, p5) {
        let object = JSON.parse(json);
        let plant;
        let terrain;
        let seed;
        if (object.plant) {
            plant = JSON.parse(object.plant);
            switch (plant.plantType) {
                case plantTypes.GRASS:
                    plant = Grass.parse(object.plant, p5);
                    break;
                case plantTypes.TREE:
                    plant = Tree.parse(object.plant, p5);
                    break;
                case plantTypes.BUSH:
                    plant = Bush.parse(object.plant, p5);
                    break;
            }
        }
        if (object.terrain) {
            terrain = JSON.parse(object.terrain);
            switch (terrain.terrainType) {
                case terrainTypes.STEPPE:
                    terrain = new Steppe(p5);
                    break;
                case terrainTypes.VOLCANO:
                    terrain = new Volcano(p5);
                    break;
                case terrainTypes.BASE:
                    terrain = new PlayerBase(p5);
                    break;
                case terrainTypes.HILL:
                    terrain = new Hill(p5);
                    break;
                case terrainTypes.LAVA:
                    terrain = new Lava(p5);
                    break;
                case terrainTypes.LANDSLIDE:
                    terrain = new Landslide(p5);
                    break;
                case terrainTypes.LUMBERING:
                    terrain = new Lumbering(p5);
                    break;
                case terrainTypes.SNOWFIELD:
                    terrain = new Snowfield(p5);
                    break;
                case terrainTypes.MOUNTAIN:
                    terrain = new Mountain(p5);
                    break;
            }
        }
        if (object.seed) {
            seed = JSON.parse(object.seed);
            console.log(seed);
            switch (seed.seedType) {
                case seedTypes.GRASS:
                    seed = GrassSeed.parse(object.seed, p5);
                    break;
                case seedTypes.TREE:
                    seed = TreeSeed.parse(object.seed, p5);
                    break;
                case seedTypes.BUSH:
                    seed = BushSeed.parse(object.seed, p5);
                    break;
            }
        }
        let cell = new Cell(x, y, terrain);
        if (plant != null) {
            cell.plant = plant;

        }
        if (seed != null) {
            cell.seed = seed;

        }
        return cell;
    }
}

class Ecosystem {
    constructor(countPlants) {
        this.countPlants = countPlants;
        this.growFaster = true;
        this.rejectLava = false;
        this.strengthenGrass = false;
        this.withstandSnow = false;
    }

    getEcoString(playBoard) {
        let str = "";
        // str += `${this.countPlants} plants in this ecosystem. `;
        if (this.growFaster) {
            str += "Seeds sowed here will grow faster. "
        }
        if (this.rejectLava && (playBoard.stageGroup === stageGroup.VOLCANO || playBoard.stageGroup === stageGroup.TSUNAMI)) {
            str += "Lava expanded here will stop. "
        }
        if (this.strengthenGrass) {
            str += "Grass deals more damage to bandits. "
        }
        if (this.withstandSnow && (playBoard.stageGroup === stageGroup.VOLCANO || playBoard.stageGroup === stageGroup.TSUNAMI)) {
            str += "Withstand blizzard. "
        }
        return str;
    }
}