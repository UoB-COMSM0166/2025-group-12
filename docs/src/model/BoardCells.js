import {itemTypes} from "../items/ItemTypes.js";

export class BoardCells{
    constructor(size) {
        this.size = size;
        // initially the array is empty since we have to
        // manually set terrain for every cell
        this.boardObjects = Array.from({ length: this.size },
            () => Array.from({ length: this.size }, () => null));
    }

    // to set terrain, invoke this function
    setCell(x, y, terrain){
        this.boardObjects[x][y] = new Cell(x, y, terrain);
    }

    // plant on a cell
    plantCell(x, y, plant){
        let cell = this.getCell(x, y);
        if(!cell.isCompatible(plant)){
            console.log("incompatible plant with terrain, failed to plant.");
            return false;
        }
        cell.plant = plant;

        // if plant is placed on an ecosystem, it expands the ecosystem.
        if(cell.isEcoSphere){
            this.setEcoSphereDFS(x,y);
            return true;
        }
        // if ecosystem is not built, first try to build one.
        let components = new Map();
        components.set(plant.name, cell);
        if(this.findEcoSphereDFS(x, y, components)){
            console.log("ecosystem built!");
            this.setEcoSphereDFS(x, y);
        }
        return true;
    }

    removePlant(x, y){
        this.getCell(x, y).removePlant();

        // when a plant is removed, an existing ecosystem may get destroyed.
        // 1. remove all ecosystem markers
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
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

    getCell(x, y){
        return this.boardObjects[x][y];
    }

    getAllCellsWithPlant(){
        let cells = [];
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(this.boardObjects[i][j].plant !== null){
                    cells.push(this.getCell(i, j));
                }
            }
        }
        return cells;
    }

    // a temporary test function body.
    getCellString(x, y){

        if(this.getCell(x, y) === null){
            return `cell at (${x},${y}) is null!`
        }

        let t = this.getCell(x, y).terrain;
        let p = this.getCell(x, y).plant;

        if(t === null){
            return `cell at (${x},${y}) is missing terrain!`;
        }

        if(p === null){
            return `cell at (${x},${y}) is of terrain ${t.name}.`;
        }

        return `cell at (${x},${y}) is of terrain ${t.name} and has a plant ${p.name} with health ${p.health}.`;
    }

    // when a new plant is placed at (x,y), recursively find an ecosystem.
    // MUST CREATE COMPONENTS AS A MAP, AND STORE THE NEW PLANT TO IT BEFORE INVOKING!!!!!!
    findEcoSphereDFS(x, y, components){
        if(!(components instanceof Map)){
            console.log("findEcoSphereDFS is mis-invoked since input component is not a map.");
            return false;
        }
        // when tree bush grass are all found, exit and return true
        if(components.size === 3){
            return true;
        }
        let adjacentCells = this.getAdjacent4Cells(x, y, components);
        for (let cell of adjacentCells) {
            if(cell.plant === null){
                continue;
            }
            if(components.has(cell.plant.name)){
                continue;
            }
            components.set(cell.plant.name, cell);
            if(this.findEcoSphereDFS(cell.x, cell.y, components)){
                return true;
            }
        }
        return false;
    }

    // recursively set ecosystem, starting from (x,y).
    setEcoSphereDFS(x, y){
        // the cell itself is set to eco.
        let cell = this.getCell(x, y);
        cell.isEcoSphere = true;

        // recursively lookup 4 surrounding cells.
        for (let adCell of this.getAdjacent4Cells(x, y)) {
            if(adCell.isEcoSphere === true){
                continue;
            }
            if(adCell.plant !== null){
                this.setEcoSphereDFS(adCell.x, adCell.y);
            }
        }

        // what's left from the 8 adjacent cells are also set to eco.
        for (let adCell of this.getAdjacent8Cells(x, y)) {
            adCell.isEcoSphere = true;
        }
    }

    getAdjacent8Cells(x, y){
        let cells = [];
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                if(i === 0 && j === 0) {continue;}
                if(0 <= x+i && x+i < this.size && 0 <= y+j && y+j < this.size){
                    cells.push(this.getCell(x+i, y+j));
                }
            }
        }
        return cells;
    }

    getAdjacent4Cells(x, y) {
        let cells = [];
        let directions = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];
        for (let [i, j] of directions) {
            if(0 <= x+i && x+i < this.size && 0 <= y+j && y+j < this.size){
                cells.push(this.getCell(x+i, y+j));
            }
        }
        return cells;
    }

}

class Cell{
    // constructor only involves terrain since
    // we will manually set terrain for all stages
    // but the right to plant is handed over to player.
    constructor(x, y, terrain){

        if(terrain.type !== itemTypes.TERRAIN){
            console.log(`failed to set cell at (${x},${y}) since the input is not terrain.`);
            return;
        }

        this.x = x;
        this.y = y;
        this._terrain = terrain;
        this._plant = null;
        this.isEcoSphere = false;
    }

    // however we still need to change terrain
    // for game extensibility.
    set terrain(terrain){

        if(terrain.type !== itemTypes.TERRAIN){
            console.log(`failed to set cell at (${this.x},${this.y}) since the input is not terrain.`);
            return;
        }

        this._terrain = terrain;
    }

    set plant(plant){

        if(plant.type !== itemTypes.PLANT){
            console.log(`failed to plant cell at (${this.x},${this.y}) since the input is not plant.`);
            return;
        }

        this._plant = plant;
    }

    get plant(){
        return this._plant;
    }

    get terrain(){
        return this._terrain;
    }

    removePlant(){
        this._plant = null;
    }

    // check if plant is compatible with the terrain.
    isCompatible(plant){
        if(this.terrain.name === "Mountain" || this.terrain.name === "PlayerBase"){
            console.log("cannot plant on this terrain.");
            return false;
        }
        return true;
    }

}