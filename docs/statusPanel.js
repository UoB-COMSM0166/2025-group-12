export default class StatusPanel{
    constructor(game, sprite){
        this.game = game;
        this.sprite = sprite;
        this.x = 1300;
        this.y = 20;
        this.width = 500;
        this.height = 300;
        this.canDisplay = false;
    }

    update(){
        
    }

    draw(p5){
        if(this.canDisplay === true){
            p5.rect(this.x, this.y, this.width, this.height);
            p5.push();
            p5.fill(0, 0, 0);
            p5.text("ATTACK", this.x + 5, this.y + 20);
            p5.text("SKILL", this.x + 5, this.y + 40);
            p5.text("......", this.x + 5, this.y + 60);
            p5.pop();
        }
    }

    setStatus(bool){
        this.canDisplay = bool;
    }
}