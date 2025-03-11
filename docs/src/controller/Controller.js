import {stateCode, stageGroup, GameState} from "../model/GameState.js";
import {StartMenu} from "../model/Menu.js";
import {StandbyMenu} from "../model/Standby.js";
import {InputHandler} from "./input.js";
import {PauseMenu} from "../model/PauseMenu.js";
import {Options} from "../model/Options.js";
import {GameMap} from "../model/GameMap.js";

// controller should never invoke any specific field but only encapsulated methods.
export class Controller {
    constructor(p5) {
        this.gameState = new GameState(p5);

        this.menus = {
            [stateCode.MENU]: new StartMenu(this.gameState),
            [stateCode.STANDBY]: new StandbyMenu(this.gameState),
            [stateCode.MAP]: new GameMap(this.gameState),
            [stateCode.PLAY]: null
        };

        this.pauseMenu = new PauseMenu(this.gameState);
        this.options = new Options(this);
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
        this.options.setup(p5);
    }

    clickListener(p5) {
        if (this.gameState.paused) {
            this.pauseMenu.handleClick(p5);
            return;
        }
        if (this.gameState.playerCanClick === false) {
            return;
        }
        if (this.gameState.showOptions){
            this.options.handleClick(p5);
            return;
        }
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleClick) {
            currentMenu.handleClick(p5);
        }
    }

    scrollListener(p5, event) {
        let currentMenu = this.menus[this.gameState.getState()];
        if (currentMenu && currentMenu.handleScroll) {
            currentMenu.handleScroll(p5, event);
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

        if (this.gameState.showOptions) {
            this.options.draw(p5);
        }
    }

    // when shift to PLAY from STANDBY, create the new play board
    setPlayStage(p5) {
        if (this.gameState.getState() === stateCode.PLAY
            && (this.menus[stateCode.PLAY] === null || this.menus[stateCode.PLAY].stageGroup !== this.gameState.currentStageGroup)) {
            this.menus[stateCode.PLAY] = this.gameState.newGameStage();
            this.menus[stateCode.PLAY].setup(p5);
            this.gameState.currentStage = this.menus[stateCode.PLAY];
            this.gameState.currentStageGroup = this.menus[stateCode.PLAY].stageGroup;
        }
    }

    // deal with 1. player-movable switching, 2. data transferring when switching menu
    setData(p5, newState) {
        // if a game stage is cleared, we shift from PLAY to FINISH (in endTurnActivity), then go to STANDBY
        if (newState === stateCode.FINISH) {
            this.menus[stateCode.PLAY] = null;
            this.gameState.setState(stateCode.STANDBY);
            this.gameState.setPlayerCanClick(true);
            return;
        }

        // if movables has objects to move, skip other phases
        if (newState === stateCode.PLAY && !this.gameState.playerCanClick) {
            this.handleMovables(p5);
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
            this.gameState.setPlayerCanClick(true);
            // reset inventory
            this.gameState.inventory.loadInventory(this.menus[stateCode.PLAY].tmpInventoryItems);
            // destroy the play board
            this.menus[stateCode.PLAY] = null;
            return;
        }

        // if we go back to start menu from standby, we set New Game button into Resume Game.
        if (this.saveState === stateCode.STANDBY && newState === stateCode.MENU) {
            this.menus[stateCode.MENU].changeNewToResume();
            return;
        }
    }

    handleMovables(p5) {
        // if movables has objects not moved:
        for (let movable of this.menus[stateCode.PLAY].movables) {
            if (!movable.hasMoved) {
                movable.movements(p5, this.menus[stateCode.PLAY]);
                return;
            }
            // don't delete dead movable object here, it distorts the iterator
            // encapsulate delete within each class
        }
        // all moved, if it not end turn, set player can click
        if (!this.menus[stateCode.PLAY].endTurn) {
            this.gameState.setPlayerCanClick(true);
        }
        // if it at end turn, invoke end turn stuff
        else {
            this.menus[stateCode.PLAY].endTurnActivity(p5);
        }
    }

}

