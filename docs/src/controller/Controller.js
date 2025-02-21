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
        this.gsf = new GameStageFactory(this.gameState);
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
            && (this.menus[stateCode.PLAY] === null || this.menus[stateCode.PLAY].stageCode !== this.gameState.currentStageCode)) {
            this.menus[stateCode.PLAY] = this.gsf.newGameStage(this.gameState.currentStageCode);
            this.menus[stateCode.PLAY].setup(p5);
            this.gameState.currentStage = this.menus[stateCode.PLAY];
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

        // if we quit PLAY to STANDBY, reset inventory and board
        if (this.saveState === stateCode.PLAY && newState === stateCode.STANDBY) {
            // reset inventory
            this.gameState.inventory.loadInventory(this.menus[stateCode.PLAY].tmpInventoryItems);
            // destroy the play board directly
            this.menus[stateCode.PLAY] = null;
        }

        // if a game stage is cleared, we shift from PLAY to FINISH (in endTurnActivity), then go to STANDBY
        if (newState === stateCode.FINISH) {
            this.menus[stateCode.PLAY] = null;
            this.gameState.setState(stateCode.STANDBY);
        }

        // if we go back to start menu from standby, we set New Game button into Resume Game.
        if (this.saveState === stateCode.STANDBY && newState === stateCode.MENU) {
            let newGameButton = this.menus[stateCode.MENU].buttons.find(button => button.text.startsWith("New Game"));
            if (newGameButton !== null && newGameButton !== undefined) {
                newGameButton.text = "Resume Game";
            }
        }
    }

}

class GameStageFactory {
    constructor(gameState) {
        this.gameState = gameState;
        this.stageClasses = {
            [stageCode.STAGE1]: Stage1PlayBoard,
            [stageCode.STAGE2]: Stage2PlayBoard,
        };
    }

    newGameStage(newStage) {
        let StageClass = this.stageClasses[newStage];
        return StageClass ? new StageClass(this.gameState) : null;
    }
}




