import Map from "./map.js";
import InputHandler from "./inputHandler.js";
import { Sprite } from "./sprite.js"
import Enemy from "./enemy.js";

class Game {
    constructor(width, height, p5) {
        this.p5 = p5;
        this.width = width;
        this.height = height;
        this.input = new InputHandler(this, this.p5);
        this.map = new Map(this);
        this.spriteList = [];
        this.spriteList[0] = new Sprite(this);
        this.enemyList = [];
        this.enemyList[0] = new Enemy(this);
    }

    update() {
        this.map.update();
        this.spriteList.forEach(s =>{
            s.update();
        });
        this.enemyList.forEach(e =>{
            e.update();
        });
        this.input.update();
    }

    draw(p5) {
        this.map.draw(p5);
        this.spriteList.forEach(s =>{
            s.draw(p5);
        });
        this.enemyList.forEach(e =>{
            e.draw(p5);
        });
    }


}

const mainSketch = (p) => {
    //main function here
    let game = new Game(1920, 1080, p);
    
    p.setup = () => {
        p.createCanvas(1920, 1080);
    }
    p.draw = () => {
        p.background(128);
        game.update();
        game.draw(p);
    }
}

//create a p5.js instance
const p = new p5(mainSketch);