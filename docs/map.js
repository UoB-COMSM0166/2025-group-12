import Tiles from "./tiles.js";
export default class Map{
    constructor(game){
        this.game = game;
        this.tilesArray = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.initTiles();
    }

    update(){
        this.tilesArray.forEach(row =>{
            row.forEach(cell => {
                cell.update();
            })
        })
    }

    draw(p5){
        this.tilesArray.forEach(row =>{
            row.forEach(cell => {
                cell.draw(p5);
            })
        })
    }
    
    //fill the 2d array
    initTiles(){
        const startingX = 650;
        const startingY = 250;
        const size = 50;
        const d = 70;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                let x = startingX + i * d;
                let y = startingY + j * d;
                this.tilesArray[j][i] = new Tiles(this.game, x, y, size);
            }
        }
    }
}

