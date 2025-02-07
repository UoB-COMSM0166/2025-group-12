export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.p5 = this.game.p5;
        this.p5.mouseClicked = () => {
            this.game.spriteList[0].mouseClicked();
            this.game.enemyList[0].mouseClicked();
            // if (this.game.scene === "loading") {
            //     this.game.scene = "menu";
            // } else if (this.game.scene === "menu") {
            //     this.game.scene = "mainPage";
            // }
            // else if(this.game.scene === "mainPage"){
            //     this.game.scene = 'game';
            // }
            // else this.game.scene = 'loading';
        };
    }

    update() {

    }

}