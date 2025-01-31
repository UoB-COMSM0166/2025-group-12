import Map from "./map.js";
import InputHandler from "./inputHandler.js";
import { Sprite } from "./sprite.js"

let game;
class Game {
    constructor(width, height, p) {
        this.width = width;
        this.height = height;
        this.p = p;
        this.input = new InputHandler(this);
        this.map = new Map(this);
        this.spriteList = [];
        this.spriteList[0] = new Sprite(this);
    }

    update() {
        this.map.update();
        this.spriteList.forEach(s =>{
            s.update();
        });
        this.input.update();
    }

    draw() {
        this.map.draw();
        this.spriteList.forEach(s =>{
            s.draw();
        });
    }


}


const mainSketch = (p) => {
    p.setup = () => {
        p.createCanvas(1920, 1080);
        game = new Game(1920, 1080, p);
    }
    p.draw = () => {
        p.background(128);
        game.update();
        game.draw();
    }
}

const p = new p5(mainSketch);