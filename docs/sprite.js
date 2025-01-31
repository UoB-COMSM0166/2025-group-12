import Map from "./map.js";

export class Sprite {
    constructor(game) {
        this.game = game;
        this.width = 15;
        this.height = 25;
        this.position = [1, 1];
        this.relatedTile = this.game.map.tilesArray[this.position[0]][this.position[1]];
        this.x = this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2;
        this.y = this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2;
        this.vx =0.1;
        this.vy = 0.1;
        this.speed = 0.1;
        this.maxDistance = 3;
        this.showArea = false;
        this.game.p.mouseClicked = () => {
            if(this.showArea == false){
                if(this.mouseOver()){
                    this.showValidArea('green');
                    this.showArea = true;
                }

            }
            else{
                this.moveToNewTiles();
                this.showValidArea('white');
                this.showArea = false;
            }
        };
    }

    update() {
        if(this.x != this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2 || this.y != this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2){
            this.x = this.lerp(this.x, this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2, this.speed);
            this.y = this.lerp(this.y, this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2, this.speed);
        }
    }

    draw() {
        this.game.p.push();
        this.game.p.fill(255, 0, 0);
        this.game.p.rect(this.x, this.y, this.width, this.height);
        this.game.p.fill(0, 0, 0);
        this.game.p.text("example sprite", this.x + 5, this.y + 20);
        this.game.p.pop();
    }

    mouseOver() {
        if (this.game.p.mouseX > this.x && this.game.p.mouseX < this.x + this.width && this.game.p.mouseY > this.y && this.game.p.mouseY < this.y + this.height) {
            return true;
        }
        else {
            return false;
        }
    }

    showValidArea(color) {

            for (let j = 0; j < 8; j++) {
                for (let i = 0; i < 8; i++) {
                    let dx = (this.position[0] - j) * (this.position[0] - j);
                    let dy = (this.position[1] - i) * (this.position[1] - i);
                    let d = Math.sqrt(dx + dy);
                    if (d <= this.maxDistance) {
                        this.game.map.tilesArray[j][i].changeColor(color);
                    }
                }
            }    
    }

    moveToNewTiles() {
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                let dx = (this.position[0] - j) * (this.position[0] - j);
                let dy = (this.position[1] - i) * (this.position[1] - i);
                let d = Math.sqrt(dx + dy);
                if (this.game.map.tilesArray[j][i].isMouseOver) {
                    console.log("true");
                }
                if (d <= this.maxDistance && this.game.map.tilesArray[j][i].mouseOver()) {
                    this.showValidArea('white');
                    this.showArea = false;
                    this.position[0] = j;
                    this.position[1] = i;
                    this.relatedTile = this.game.map.tilesArray[this.position[0]][this.position[1]];
                    return true;
                }
            }
        }
        return false;
    }

    lerp(start, end, amt){
        return start + (end - start) * amt;
    }

}