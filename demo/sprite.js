export class Sprite {
    constructor(gameWith, gameHeight, p){
        this.gameWith = gameWith;
        this.gameHeight = gameHeight;
        this.p = p;
        this.width = 30;
        this.height = 50;
        this.x = 20;
        this.y = this.gameHeight - this.height;
        this.canMove = false;
    }

    update(){
        if(this.mouseOver() && this.p.mouseIsPressed){
            this.canMove = true;
        }
        if(this.canMove == true){
            this.x = this.p.mouseX - this.width/2;
            this.y = this.p.mouseY - this.height/2;
            if(!this.p.mouseIsPressed){
                this.canMove = false;
            }
        }
    }

    draw(){
        this.p.rect(this.x, this.y, this.width, this.height)
    }

    mouseOver(){
        if(this.p.mouseX > this.x && this.p.mouseX < this.x + this.width && this.p.mouseY > this.y && this.p.mouseY < this.y + this.height){
            return true;
        }
        else{
            return false;
        }
    }

}