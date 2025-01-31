export default class StatusPanel{
    constructor(game, sprite){
        this.game = game;
        this.sprite = sprite;
        this.x = 1300;
        this.y = 20;
        this.width = 500;
        this.height = 300;
        this.candisplay = false;
    }

    update(){
        
    }

    draw(){
        if(this.candisplay === true){
            this.game.p.rect(this.x, this.y, this.width, this.height);
            this.game.p.push();
            this.game.p.fill(0, 0, 0);
            this.game.p.text("ATTACK", this.x + 5, this.y + 20);
            this.game.p.text("SKILL", this.x + 5, this.y + 40);
            this.game.p.text("......", this.x + 5, this.y + 60);
            this.game.p.pop();
        }
    }

    setStatus(bool){
        this.candisplay = bool;
    }
}