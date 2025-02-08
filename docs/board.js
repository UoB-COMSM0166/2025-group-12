import { Tile } from "./tile.js";
export class Board{
    constructor(){
        this.tilesArray = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.initTiles();
    }

    draw(p5){
        this.tilesArray.forEach(row =>{
            row.forEach(cell => {
                cell.draw(p5);
            });
        })
    }
    
    //fill the 2d array
    initTiles(){
        const size = 50;
        const d = 1;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                let x = i * d;
                let y = j * d;
                this.tilesArray[j][i] = new Tile(x, y, size);
            }
        }
    }
}