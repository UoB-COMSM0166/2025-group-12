import Map from "./map.js";
import InputHandler from "./inputHandler.js";
import { Sprite } from "./sprite.js"
import Enemy from "./enemy.js";

class Game {
    constructor(width, height, p5) {
        this.p5 = p5;
        this.width = width;
        this.height = height;
        this.input = new InputHandler(this);
        this.map = new Map(this);
        this.spriteList = [];
        this.spriteList[0] = new Sprite(this);
        this.enemyList = [];
        this.enemyList[0] = new Enemy(this);
        this.scene = 'loading';
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
        if(this.scene === 'loading'){
            this.showLoading(p5);
        }
        else if(this.scene === 'menu'){
            this.showMenu(p5);
        }
        else if(this.scene === 'game'){
            this.map.draw(p5);
            this.spriteList.forEach(s =>{
                s.draw(p5);
            });
            this.enemyList.forEach(e =>{
                e.draw(p5);
            });
        }

    }
    showLoading(p5) {
        p5.push();
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Loading", this.width / 2, this.height / 2 - 40);
        p5.textSize(20);
        p5.text("Click to start", this.width / 2, this.height / 2 + 20);
        p5.pop();
      }
      
      // 场景2：游戏界面
    showMenu(p5) {
        p5.push();
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Menu", this.width / 2, this.height / 2);
        p5.pop();
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