import {stateCode, GameState} from "../model/GameState.js";
import {StartMenu} from "../model/Menu.js";
import {StandbyMenu} from "../model/Standby.js";
import {PlayBoard} from "../model/Play.js";

export class Controller {
    constructor() {
        this.gameState = new GameState();
        this.menus = {
            [stateCode.MENU]: new StartMenu(this.gameState),
            [stateCode.STANDBY]: new StandbyMenu(this.gameState),
            [stateCode.PLAY]: new PlayBoard(this.gameState)
        };
        this.saveState = stateCode.MENU; // default
    }

    setup(p5) {
        for (let menu of Object.values(this.menus)) {
            if (menu.setup) {
                menu.setup(p5);
            }
        }
    }

    clickListener(p5) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleClick) {
            currentMenu.handleClick(p5);
        }

    }

    scrollListener(event){
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleScroll) {
            currentMenu.handleScroll(event);
        }
    }

    view(p5) {
        this.setData(this.gameState.getState());
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.draw) {
            currentMenu.draw(p5);
        }
        this.saveState = this.gameState.getState();
    }

    setData(newState){
            // if we go to PLAY from STANDBY, save inventory
            if(this.saveState == stateCode.STANDBY && newState == stateCode.PLAY){
                this.menus[stateCode.PLAY].tmpInventoryItems = PlayBoard.inventory.saveInventory();
            }

            // if we quit PLAY to STANDBY, reset PlayBoard and inventory
            if(this.saveState == stateCode.PLAY && newState == stateCode.STANDBY){
                this.menus[stateCode.PLAY].resetBoard();
            }
            // if a game stage is cleared, we shift from PLAY to FINISH, then go to STANDBY
            // await implementation.


    }
}



