import {stateCode, stageCode, GameState} from "../model/GameState.js";
import {StartMenu} from "../model/Menu.js";
import {StandbyMenu} from "../model/Standby.js";
import {Stage1PlayBoard} from "../model/stages/Stage1.js";
import {Stage2PlayBoard} from "../model/stages/Stage2.js";
import {InputHandler} from "./input.js";
import {PauseMenu} from "../model/PauseMenu.js";

// controller should never invoke any specific field but only encapsulated methods.
export class Controller {
    constructor(p5) {
        this.gameState = new GameState(p5);

        this.menus = {
            [stateCode.MENU]: new StartMenu(this.gameState),
            [stateCode.STANDBY]: new StandbyMenu(this.gameState),
            [stateCode.PLAY]: null
        };

        this.pauseMenu = new PauseMenu(this.gameState);
        // key input
        this.input = new InputHandler(this.gameState);
        this.saveState = stateCode.MENU; // default
    }

    setup(p5) {
        for (let menu of Object.values(this.menus)) {
            if (menu && menu.setup) {
                menu.setup(p5);
            }
        }
        this.pauseMenu.setup(p5);
    }

    clickListener(p5) {
        if (this.gameState.paused) {
            this.pauseMenu.handleClick(p5);
            return;
        }
        if (this.gameState.playerCanClick === false) {
            return;
        }
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleClick) {
            currentMenu.handleClick(p5);
        }
    }

    scrollListener(event) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleScroll) {
            currentMenu.handleScroll(event);
        }
    }

    view(p5) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.draw) {
            currentMenu.draw(p5);
        }
        if (this.gameState.paused) {
            p5.push();
            p5.filter(p5.BLUR, 3);
            p5.pop();
            this.pauseMenu.draw(p5);
        }
    }

    // when shift to PLAY from STANDBY, create the new play board
    setPlayStage(p5) {
        if (this.gameState.getState() === stateCode.PLAY
            && (this.menus[stateCode.PLAY] === null || this.menus[stateCode.PLAY].stageCode !== this.gameState.currentStageCode)) {
            this.menus[stateCode.PLAY] = this.gameState.newGameStage();
            this.menus[stateCode.PLAY].setup(p5);
            this.gameState.currentStage = this.menus[stateCode.PLAY];
            this.gameState.currentStageCode = this.menus[stateCode.PLAY].stageCode;
        }
    }

    // deal with 1. data transferring when switching menu, 2. player-enemy movement switching
    setData(p5, newState) {
        // if PLAY is in enemy movement, only call enemy movement
        if (newState === stateCode.PLAY && !this.gameState.playerCanClick) {
            this.menus[stateCode.PLAY].enemyMovements(p5);
            return;
        }

        // if we go to PLAY from STANDBY, save inventory then push stage items
        if (this.saveState === stateCode.STANDBY && newState === stateCode.PLAY) {
            this.menus[stateCode.PLAY].tmpInventoryItems = this.gameState.inventory.saveInventory();
            this.menus[stateCode.PLAY].setStageInventory(p5);
            return;
        }

        // if we quit PLAY to STANDBY, reset inventory and board
        if (this.saveState === stateCode.PLAY && newState === stateCode.STANDBY) {
            // reset inventory
            this.gameState.inventory.loadInventory(this.menus[stateCode.PLAY].tmpInventoryItems);
            // destroy the play board
            this.menus[stateCode.PLAY] = null;
            return;
        }

        // if a game stage is cleared, we shift from PLAY to FINISH (in endTurnActivity), then go to STANDBY
        if (newState === stateCode.FINISH) {
            this.menus[stateCode.PLAY] = null;
            this.gameState.setState(stateCode.STANDBY);
            return;
        }

        // if we go back to start menu from standby, we set New Game button into Resume Game.
        if (this.saveState === stateCode.STANDBY && newState === stateCode.MENU) {
            this.menus[stateCode.MENU].changeNewToResume();
            return;
        }
    }

}

