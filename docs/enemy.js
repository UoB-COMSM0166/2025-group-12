import {Sprite} from "./sprite.js";

export default class Enemy extends Sprite{
    constructor(game){
        super(game);
        this.position = [3, 3];
        this.relatedTile = this.game.map.tilesArray[this.position[0]][this.position[1]];
        this.x = this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2;
        this.y = this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2;
    }

    draw(p5) {
        this.statusPanel.draw();
        p5.push();
        p5.fill(255, 0, 0);
        p5.rect(this.x, this.y, this.width, this.height);
        p5.fill(0, 0, 0);
        p5.text("example ememy", this.x + 5, this.y + 20);
        p5.pop();
    }


    mouseClicked() {
        if(this.showArea == false){
            if(this.mouseOver(this.game.p5)){
                this.showValidArea('green');
                this.showArea = true;
                this.statusPanel.setStatus(true);
            }

        }
        else{
            this.showValidArea('white');
            this.showArea = false;
            this.statusPanel.setStatus(false);
        }
    }
}