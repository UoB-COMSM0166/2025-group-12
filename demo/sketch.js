import Map from "./map.js";
import {Sprite} from "./sprite.js"


class Game {
  constructor(width, height, p){
    this.width = width;
    this.height = height;
    this.p = p;
    this.map = new Map(0, 0, this.p);
    this.sprite = new Sprite(400, 400, this.p);
  }

  update(){
    this.map.update();
    this.sprite.update()
  }

  draw(){
    this.map.draw();
    this.sprite.draw();
  }
}

let game;
const mainSketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    game = new Game(400, 400, p);
  }
  p.draw = () => {
    p.background(128);
    game.update();
    game.draw();
  }
}

const p = new p5(mainSketch);