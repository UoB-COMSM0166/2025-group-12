const gameState = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}

class GameState {
    constructor(state){
        this.state = state;
    }
}

class MainMenu extends GameState {
    constructor(){
        super('MAINMENU');
    }
    enter(){
        
    }
}