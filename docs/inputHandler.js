export default class InputHandler {
    constructor(game, p5){
        this.game = game;
        this.p5 = p5;
        this.p5.mouseClicked = () => {
            this.game.spriteList[0].mouseClicked();
            this.game.enemyList[0].mouseClicked();
        };
    }

    update(){

    }

}