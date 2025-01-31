export class Sprite {
    constructor(game){
        this.game = game;
        this.width = 150;
        this.height = 250;
        this.x = 500;
        this.y = this.game.height - this.height;
        this.vx =0;
        this.vy = 10;
        this.maxDistance = 5;
        this.canMove = false;
    }

    update(){
        if()
        // if(this.mouseOver() && this.game.p.mouseIsPressed){
        //     this.canMove = true;
        // }
        // if(this.canMove == true){
        //     let shadowSprite = new ShadowSprite(this.game);
        //     this.game.spriteList.push(shadowSprite);
        //     if(!this.game.p.mouseIsPressed){
        //         this.canMove = false;
        //         this.game.spriteList.splice(this.game.spriteList.indexOf(shadowSprite), 1);
        //     }
        // }
    }

    draw(){
        this.game.p.rect(this.x, this.y, this.width, this.height);
        this.game.p.text("example sprite", this.x + 5, this.y + 20);
    }

    mouseOver(){
        if(this.game.p.mouseX > this.x && this.game.p.mouseX < this.x + this.width && this.game.p.mouseY > this.y && this.game.p.mouseY < this.y + this.height){
            return true;
        }
        else{
            return false;
        }
    }

}

// class ShadowSprite extends Sprite {

//     update(){
//         this.x = this.game.p.mouseX - this.width/2;
//         this.y = this.game.p.mouseY - this.height/2;
//     }
//     draw(){
//         this.game.p.push();
//         this.game.p.fill(255, 255, 255, 0.6);
//         this.game.p.rect(this.x, this.y, this.width, this.height);
//         this.game.p.text("example sprite", this.x + 5, this.y + 20);
//         this.game.p.pop();
//     }
// }