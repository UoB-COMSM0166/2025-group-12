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
    }

    setup(p5) {
        for (let menu of Object.values(this.menus)) {
            if (menu.setup) {
                menu.setup(p5);
            }
        }
    }

    actionListener(p5) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleClick) {
            currentMenu.handleClick(p5);
        }
    }

    view(p5) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.draw) {
            currentMenu.draw(p5);
        }
    }
}



