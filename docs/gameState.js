/* all the game model are put in here*/

import Button from "./button.js";
import { Board } from "./board.js";

const gameStates = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}

class GameState {
    constructor(state){
        this.state = state;
        this.buttonList = [];
    }
}

export class MainMenu extends GameState {
    constructor(){
        super('MAINMENU');
        this.startButton = new Button(1920 / 2 - 100/2, 700, 100, 40, "New Game");
        console.log(this.startButton);
        this.buttonList[0] = this.startButton;
    }
    enter(){
        
    }
}

export class HomePage extends GameState {
    constructor(){
        super('HOMEPAGE');
        this.startlevelButton = new Button(1920 - 200, 900, 100, 40, "Start level");
        this.mapButton = new Button(1920 / 2 - 100/2, 400, 500, 500, "Map buttom");
        this.buttonList[0] = this.startlevelButton;
        this.buttonList[1] = this.mapButton;
    }
    enter(){
        
    }
}


export class LevelPage extends GameState {
    constructor(){
        super('LEVELAPGE');
        this.board = new Board();
        this.plantList = [];
        this.mode = 'view';
        this.round = 1;
        this.maxRound = 10;
        this.roundButton = new Button(1000, 20, 300, 200, "Round " + this.round  + " / " + this.maxRound);
    }
    enter(){
        
    }
}