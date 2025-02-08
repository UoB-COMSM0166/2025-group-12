//enum
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
    
    inputListener(p5) {
        p5.mousePressed = () => {
            if (this.game.currentGameState === this.game.gameStates[gameStates.MAINMENU]) {
                if (this.game.currentGameState.startButton.checkClick()) {
                    this.game.setGameState(gameStates.HOMEPAGE);
                }
            }
            else if(this.game.currentGameState === this.game.gameStates[gameStates.HOMEPAGE]){
                if(this.game.currentGameState.mapButton.checkClick()) {
                    this.game.currentGameState.startlevelButton.display = true;
                }
                else{
                    this.game.currentGameState.startlevelButton.display = false;
                }
                if (this.game.currentGameState.startlevelButton.checkClick()) {
                    this.game.setGameState(gameStates.LEVELPAGE);
                }
            }
            else if(this.game.currentGameState === this.game.gameStates[gameStates.LEVELPAGE]){
                
            }
        }
    }
}