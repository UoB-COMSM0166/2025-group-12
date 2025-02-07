import Controller from "./controller.js";
import View from "./view.js";
import Map from "./map.js";
import { ModelList } from "./model.js";

class Game{
    constructor(p5){
        this.p5 = p5;
        this.ModelList = new ModelList();
        this.controller = new Controller(this.model);
        this.view = new View(this.model, this.p5, this.controller);
        this.map = new Map();
    }
}


const mainSketch = (p) => {
    //main function here
    let game = new Game(p);

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
        game.view.paintComponent(p);
        game.view.inputListener(p);
    }
}

//create a p5.js instance
const p = new p5(mainSketch);