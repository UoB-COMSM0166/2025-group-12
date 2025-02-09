import Controller from "./controller.js";
import View from "./view.js";
import { MainMenu, HomePage, LevelPage } from "./gameState.js";
import Inventory from "./inventory.js";
class Game {
    //possible feature to adjust resolution?
    constructor(p5, width, height){
        this.p5 = p5;
        this.width = width;
        this.height = height;
        this.gameStates = [new MainMenu(), new HomePage(), new LevelPage()];
        this.view = new View(this, this.p5);
        this.controller = new Controller(this.p5, this, this.view);
        this.currentGameState = this.gameStates[2];
        this.inventory = new Inventory();
       // this.currentGameState.enter();
    }

    setGameState(state){
        this.currentGameState = this.gameStates[state];
        //this.currentGameState = enter();
    }
}

const mainSketch = (p) => {
    //main function here
    let game = new Game(p, 1920, 1080);

    p.preload = () => {
        let img = p.loadImage('tile.png');
        let map = p.loadImage('map.jpg');
        p.img = img;
        p.map = map;
    }

    p.setup = () => {
        p.createCanvas(1920, 1080);
    }
    p.draw = () => {
        p.background(255);
        game.view.drawAll(p);
        game.controller.inputListener(p);
    }
}

//create a p5.js instance
const p = new p5(mainSketch);