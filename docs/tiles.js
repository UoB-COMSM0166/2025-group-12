export default class Tiles{
    constructor(game, x, y, size){
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = 'white';
        this.isMouseOver = false;
        this.canStand = true;
    }
    
    update(){
        this.isMouseOver = this.mouseOver(this.game.p5);
    }

    draw(p5){
        p5.push();
        p5.fill(this.color);
        p5.square(this.x, this.y, this.size);
        p5.pop();
    }

    changeColor(color){
        this.color = color;
    }

    mouseOver(p5) {
        if (p5.mouseX > this.x && p5.mouseX < this.x + this.size && p5.mouseY > this.y && p5.mouseY < this.y + this.size) {
            return true;
        }
        else {
            return false;
        }
    }
}
