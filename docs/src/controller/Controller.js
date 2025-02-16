import {stateCode, stageCode, GameState} from "../model/GameState.js";
import {StartMenu} from "../model/Menu.js";
import {StandbyMenu} from "../model/Standby.js";
import {Stage1PlayBoard} from "../model/stages/Stage1.js";
import {Stage2PlayBoard} from "../model/stages/Stage2.js";
import {InputHandler} from "./input.js";
import {PauseMenu} from "../model/PauseMenu.js";

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

    setPlayStage(p5) {
        if (this.gameState.getState() === stateCode.PLAY
            && (this.menus[stateCode.PLAY] === null || this.menus[stateCode.PLAY].stageCode !== this.gameState.currentStage)) {
            this.menus[stateCode.PLAY] = this.newGameStage(this.gameState.currentStage);
            this.menus[stateCode.PLAY].setup(p5);
        }
    }

    setData(p5, newState) {
        // if PLAY is in enemy movement, only call enemy movement
        if (newState === stateCode.PLAY && this.gameState.enemyCanMove === true) {
            this.menus[stateCode.PLAY].enemyMovements(p5);
        }

        // if we go to PLAY from STANDBY, save inventory then push stage items
        if (this.saveState === stateCode.STANDBY && newState === stateCode.PLAY) {
            this.menus[stateCode.PLAY].tmpInventoryItems = this.gameState.inventory.saveInventory();
            this.menus[stateCode.PLAY].setStageInventory(p5);
        }

        // if we quit PLAY to STANDBY, reset PlayBoard and inventory
        if (this.saveState === stateCode.PLAY && newState === stateCode.STANDBY) {
            // reset inventory
            this.gameState.inventory.loadInventory(this.menus[stateCode.PLAY].tmpInventoryItems);
            // reset board later, since it also clears tmp inventory items
            this.menus[stateCode.PLAY].resetBoard(p5);
        }

        // if a game stage is cleared, we shift from PLAY to FINISH (in endTurnActivity), then go to STANDBY
        if (newState === stateCode.FINISH) {
            this.menus[stateCode.PLAY].resetBoard(p5);
            this.gameState.setState(stateCode.STANDBY);
        }

    }

    newGameStage(newStage) {
        if (newStage === stageCode.STAGE1) {
            return new Stage1PlayBoard(this.gameState);
        }
        if (newStage === stageCode.STAGE2) {
            return new Stage2PlayBoard(this.gameState);
        }
        return null;
    }
}



