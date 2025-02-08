const gameStates = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}


export default class Controller{
    constructor(game, view){
        this.game = game;
        this.view = view;
    }
    
    setWidth(){
        this.game.setWidth(300);
    }

    setScene(commad){
        //
        this.game.setState(commad);
    }

    tilecontroller(){

    }

    inputListener(p5) {
        p5.mousePressed = () => {
            if (this.view.startButton.checkClick()) {
                this.game.setGameState(gameStates.HOMEPAGE);
            }
            if (this.view.startlevelButton.checkClick()) {
                this.game.setGameState(gameStates.LEVELPAGE);
            }
            if(this.view.mapButton.checkClick()) {
                this.view.startlevelButton.display = true;
            }
            else{
                this.view.startlevelButton.display = false;
            }
        }
    }
}