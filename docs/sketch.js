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
        else if(this.scene === 'mainPage'){
            this.showMainPage(p5);
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
        //p5.text("Loading", this.width / 2, this.height / 2 - 40);
        //p5.textSize(20);
        p5.text("Press any keys", this.width / 2, this.height / 2 + 20);
        p5.pop();
      }

    showMenu(p5) {
        p5.push();
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Menu", this.width / 2, this.height / 2);
        p5.pop();
      }

    showMainPage(p5) {
        p5.push();
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Main page", this.width / 2, this.height / 2);
        p5.pop();
      }
}


window.addEventListener('load', function(){
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    const mainSketch = (p) => {
        //main function here
        let img;
        let game = new Game(1920, 1080, p);

        p.preload = () => {
            img = p.loadImage('tile.png');
            p.img = img;
        }
        
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
});