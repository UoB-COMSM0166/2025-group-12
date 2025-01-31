export default class InputHandler {
    constructor(game){
        this.game = game;
        this.game.p.mouseClicked = () => {
            this.game.spriteList[0].mouseClicked();
            this.game.enemyList[0].mouseClicked();
        };
    }

    update(){

    }

}