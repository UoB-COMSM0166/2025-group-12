import {enemyTypes, itemTypes, plantTypes, seedTypes} from "../items/ItemTypes.js";
import {Plant} from "../items/Plant.js";
import {Seed} from "../items/Seed.js";

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
    plantCell(x, y, item) {
        let cell = this.getCell(x, y);

        if (!(item instanceof Plant) && !(item instanceof Seed)) {
            console.log("plantCell received invalid input.");
            return false;
        }

        if (!cell.isCompatible(item)) {
            console.log("incompatible plant with terrain, failed to plant.");
            return false;
        }

        if (item instanceof Seed) {
            cell.seed = item;
            if (cell.isEcoSphere) {
                cell.seed.countdown = cell.seed.countdown - 1 < 1 ? 1 : cell.seed.countdown - 1;
            }
            return true;
        }

        cell.plant = item;

        // if plant is placed on an ecosystem, it expands the ecosystem.
        if (cell.isEcoSphere) {
            this.setEcoSphereDFS(x, y);
            return true;
        }
        // if ecosystem is not built, first try to build one.
        let components = new Map();
        components.set(item.name, cell);
        if (this.findEcoSphereDFS(x, y, components)) {
            console.log("ecosystem built!");
            this.setEcoSphereDFS(x, y);
        }
        return true;
    }

    removePlant(x, y) {
        this.getCell(x, y).removePlant();
        this.reconstructEcosystem();
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

    // a temporary test function body.
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
            return `cell at (${x},${y}) is of terrain ${t.name}.`;
        }

        if (e !== null) {
            return `cell at (${x},${y}) is of terrain ${t.name} and has a ${e.name} with health ${e.health}.`;
        }

        if (s !== null) {
            return `cell at (${x},${y}) is of terrain ${t.name} and has a ${s.name} which grows up in ${s.countdown} turns.`;
        }

        return `cell at (${x},${y}) is of terrain ${t.name} and has a plant ${p.name} with health ${p.health}.`;
    }

    // when a new plant is placed at (x,y), recursively find an ecosystem.
    // MUST CREATE COMPONENTS AS A MAP, AND STORE THE NEW PLANT TO IT BEFORE INVOKING!!!!!!
    findEcoSphereDFS(x, y, components) {
        if (!(components instanceof Map)) {
            console.log("findEcoSphereDFS is mis-invoked since input component is not a map.");
            return false;
        }
        // when tree bush grass are all found, exit and return true
        if (components.size === 3) {
            return true;
        }
        let adjacentCells = this.getAdjacent4Cells(x, y, components);
        for (let cell of adjacentCells) {
            if (cell.plant === null) {
                continue;
            }
            if (components.has(cell.plant.name)) {
                continue;
            }
            components.set(cell.plant.name, cell);
            if (this.findEcoSphereDFS(cell.x, cell.y, components)) {
                return true;
            }
        }
        return false;
    }

    // recursively set ecosystem, starting from (x,y).
    setEcoSphereDFS(x, y) {
        // the cell itself is set to eco.
        let cell = this.getCell(x, y);
        cell.isEcoSphere = true;

        // recursively lookup 4 surrounding cells.
        for (let adCell of this.getAdjacent4Cells(x, y)) {
            if (adCell.isEcoSphere === true) {
                continue;
            }
            if (adCell.plant !== null) {
                this.setEcoSphereDFS(adCell.x, adCell.y);
            }
        }

        // what's left from the 8 adjacent cells are also set to eco.
        for (let adCell of this.getAdjacent8Cells(x, y)) {
            adCell.isEcoSphere = true;
        }
    }

    reconstructEcosystem() {
        // when a plant is removed, an existing ecosystem may get destroyed.
        // 1. remove all ecosystem markers
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.getCell(i, j).isEcoSphere = false;
            }
        }
        // 2. loop through all remaining plants and try to reconstruct ecosystem
        let remainingPlants = this.getAllCellsWithPlant();
        for (let cell of remainingPlants) {
            let components = new Map();
            components.set(cell.plant.name, cell);
            if (this.findEcoSphereDFS(cell.x, cell.y, components)) {
                this.setEcoSphereDFS(cell.x, cell.y);
            }
        }
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

    saveBoard() {
        let tmpArray = Array.from({length: this.size},
            () => Array.from({length: this.size}, () => null));
        for (let i = 0; i < tmpArray.length; i++) {
            for (let j = 0; j < tmpArray[i].length; j++) {
                tmpArray[i][j] = this.getCell(i, j).saveCell();
            }
        }
        return tmpArray;
    }

    loadBoard(savedBoard, gameState) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (savedBoard[i][j].plantType !== null || savedBoard[i][j].seedType !== null) {
                    this.plantCell(i, j, gameState.inventory.createItem(gameState.p5, savedBoard[i][j].name));
                }
            }
        }
    }

}

class Cell {
    // constructor only involves terrain since
    // we will manually set terrain for all stages
    // but the right to plant is handed over to player.
    constructor(x, y, terrain) {

        if (terrain.type !== itemTypes.TERRAIN) {
            console.log(`failed to set cell at (${x},${y}) since the input is not terrain.`);
            return;
        }

        this.x = x;
        this.y = y;
        this._terrain = terrain;
        this._plant = null;
        this._seed = null;
        this._enemy = null;
        this.isEcoSphere = false;
    }

    // however we still need to change terrain
    // for game extensibility.
    set terrain(terrain) {
        if (terrain.type !== itemTypes.TERRAIN) {
            console.log(`failed to set cell at (${this.x},${this.y}) since the input is not terrain.`);
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
            console.log(`failed to set cell at (${this.x},${this.y}) since the input is not plant.`);
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
            console.log(`failed to set cell at (${this.x},${this.y}) since the input is not seed.`);
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

    getEcoString() {
        if (this.isEcoSphere) {
            return "The cell is in an ecosystem and seeds planted here will grow faster.";
        }
        return "The cell is not in an ecosystem.";
    }

    // check if plant or seed is compatible with the terrain.
    isCompatible(item) {
        if (this.enemy !== null) {
            console.log("an enemy is on this cell, you cant place plant here!");
            return false;
        }

        if (this.seed !== null) {
            console.log("an seed is already on this cell, you cant place plant here!");
            return false;
        }

        if (this.terrain.name === "Mountain" || this.terrain.name === "PlayerBase") {
            console.log("cannot plant on this terrain.");
            return false;
        }
        return true;
    }

    saveCell(){
        let tmpObj = {
            name: null,
            plantType: null,
            seedType: null,
            enemyType: null,
        }
        if(this.plant){
            tmpObj.plantType = this.plant.plantType;
            tmpObj.name = this.plant.name;
        }
        if(this.seed){
            tmpObj.seedType = this.seed.seedType;
            tmpObj.name = this.seed.name;
        }
        if(this.enemy){
            tmpObj.enemyType = this.enemy.enemyType;
            tmpObj.name = this.enemy.name;
        }
        return tmpObj;
    }

}