import Tiles from "./tiles.js";
export default class Map{
    constructor(gameWidth, gameHeight, p){
        this.p = p;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.tilesArray = [];
        this.initTiles();
    }

    update(){
        this.tilesArray.forEach(t =>{
            t.update();
        })
    }

    draw(){
        this.tilesArray.forEach(t =>{
            t.draw();
        });
    }
    initTiles(){
        let x = 5;
        let y = 5;
        for(let i = 0; i < 64; i++){
            this.tilesArray.push(new Tiles(x, y,this.p));
            x += 30;
            if(x===245){
                x = 5;
                y += 30;
            }
        }
    }
}

