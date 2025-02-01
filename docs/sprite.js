import StatusPanel from "./statusPanel.js";

//main character
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
        this.statusPanel = new StatusPanel(this.game, this);
        this.currentStatusPanel = false;
 
    }

    update() {
        if(this.x != this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2 || this.y != this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2){
            this.x = this.lerp(this.x, this.relatedTile.x + this.relatedTile.size / 2 - this.width / 2, this.speed);
            this.y = this.lerp(this.y, this.relatedTile.y + this.relatedTile.size / 2 - this.height / 2, this.speed);
        }
        else{
            this.relatedTile.canStand = false;
        }
    }

    draw(p5) {
        this.statusPanel.draw(p5);
        p5.push();
        p5.fill(255, 0, 0);
        p5.rect(this.x, this.y, this.width, this.height);
        p5.fill(0, 0, 0);
        p5.text("example sprite", this.x + 5, this.y + 20);
        p5.pop();
    }

    mouseOver(p5) {
        if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
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
                if (d <= this.maxDistance && this.game.map.tilesArray[j][i].mouseOver(this.game.p5) && this.game.map.tilesArray[j][i].canStand === true) {
                    this.showValidArea('white');
                    this.showArea = false;
                    //set tile back to true
                    this.relatedTile.canStand = true;
                    this.position[0] = j;
                    this.position[1] = i;
                    this.relatedTile = this.game.map.tilesArray[this.position[0]][this.position[1]];
                    return true;
                }
            }
        }
        return false;
    }

    //simple method to move from one point to another
    lerp(start, end, amt){
        return start + (end - start) * amt;
    }

    showStatusPanel(){
        this.statusPanel.draw();
    }

    mouseClicked(){
        if(this.showArea == false){
            if(this.mouseOver(this.game.p5)){
                this.showValidArea('green');
                this.showArea = true;
                this.statusPanel.setStatus(true);
            }

        }
        else{
            this.moveToNewTiles();
            this.showValidArea('white');
            this.showArea = false;
            this.statusPanel.setStatus(false);
        }
    }

}