import {itemTypes} from "../items/ItemTypes.js";

export class BoardCells{
    constructor(size) {
        // initially the array is empty since we have to
        // manually set terrain for every cell
        this.boardObjects = Array.from({ length: size },
            () => Array.from({ length: size }, () => null));
    }

    // to set terrain, invoke this function
    setCell(x, y, terrain){
        this.boardObjects[x][y] = new Cells(x, y, terrain);
    }

    // plant on a cell
    plantCell(x, y, plant){
        if(!this.boardObjects[x][y].incompatible(plant)){
            console.log("incompatible plant with terrain, failed to plant.");
            return false;
        }
        this.boardObjects[x][y].plant = plant;
        return true;
    }

    getCell(x, y){
        return this.boardObjects[x][y];
    }

    // a temporary test function body.
    getCellString(x, y){

        if(this.boardObjects[x][y] === null){
            return `cell at (${x},${y}) is null!`
        }

        let t = this.boardObjects[x][y].terrain;
        let p = this.boardObjects[x][y].plant;

        if(t === null){
            return `cell at (${x},${y}) is missing terrain!`;
        }

        if(p === null){
            return `cell at (${x},${y}) is of terrain ${t.name}.`;
        }

        return `cell at (${x},${y}) is of terrain ${t.name} and has a plant ${p.name}.`;
    }
}

class Cells{
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

    // check if plant is compatible with the terrain.
    incompatible(plant){
        if(this.terrain.name === "Mountain" || this.terrain.name === "PlayerBase"){
            console.log("cannot plant on this terrain.");
            return false;
        }
        return true;
    }

}