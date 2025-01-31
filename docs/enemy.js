import {Sprite} from "./sprite.js";

export default class Enemy extends Sprite{
    constructor(game){
        super(game);
        this.position = [3, 3];
        this.relatedTile = this.game.map.tilesArray[this.position[0]][this.position[1]];
        this.x = this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2;
        this.y = this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2;
    }

    draw() {
        this.statusPanel.draw();
        this.game.p.push();
        this.game.p.fill(255, 0, 0);
        this.game.p.rect(this.x, this.y, this.width, this.height);
        this.game.p.fill(0, 0, 0);
        this.game.p.text("example ememy", this.x + 5, this.y + 20);
        this.game.p.pop();
    }


    mouseClicked() {
        super.mouseClicked();
        console.log("Enemy mouseClicked 被调用");
    }
}