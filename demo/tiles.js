export default class Tiles{  // 地圖格線
    constructor(game, x, y, size){
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = 'white';
        this.isMouseOver = false;
    }
    
    update(){
        this.isMouseOver = this.mouseOver();
    }

    draw(){
        this.game.p.push();
        this.game.p.fill(this.color);
        this.game.p.square(this.x, this.y, this.size);
        this.game.p.pop();
    }

    changeColor(color){
        this.color = color;
    }

    mouseOver() {
        if (this.game.p.mouseX > this.x && 
            this.game.p.mouseX < this.x + this.size && 
            this.game.p.mouseY > this.y && 
            this.game.p.mouseY < this.y + this.size) {
            return true;
        }
        else {
            return false;
        }
    }
}
