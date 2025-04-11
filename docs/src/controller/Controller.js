export class Controller {
    constructor(bundle) {
        /** @type {GameState} */
        this.gameState = bundle.gameState;
        this.menus = bundle.menus;
        this.pauseMenu = bundle.pauseMenu;
        this.inputHandler = bundle.inputHandler;
        this.stateCode = bundle.stateCode;
        /** @type {stateCode} */
        this.saveState = bundle.initialState;

        this.StartMenuLogic = bundle.StartMenuLogic;
        this.InventoryLogic = bundle.InventoryLogic;
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
    }

    // when shift to PLAY from STANDBY, create the new play board
    setPlayStage(p5) {
        if (this.gameState.getState() === this.stateCode.PLAY
            && (this.menus[this.stateCode.PLAY] === null || this.menus[this.stateCode.PLAY].stageGroup !== this.gameState.currentStageGroup)) {
            this.menus[this.stateCode.PLAY] = this.gameState.newGameStage();
            this.menus[this.stateCode.PLAY].setup(p5);
            this.gameState.currentStage = this.menus[this.stateCode.PLAY];
            this.gameState.currentStageGroup = this.menus[this.stateCode.PLAY].stageGroup;
        }
    }

    // deal with 1. player-movable switching, 2. data transferring when switching menu
    setData(p5, newState) {
        // if a game stage is cleared, we shift from PLAY to FINISH (in endTurnActivity), then go to STANDBY
        if (newState === this.stateCode.FINISH) {
            this.menus[this.stateCode.PLAY] = null;
            this.gameState.inventory.scrollIndex = 0;
            this.gameState.setState(this.stateCode.STANDBY);
            this.gameState.setPlayerCanClick(true);
            return;
        }

        // if movables has objects to move, skip other phases
        if (newState === this.stateCode.PLAY && !this.gameState.playerCanClick) {
            this.handleMovables(p5);
            return;
        }

        // if we go to PLAY from STANDBY, save inventory then push stage items
        if (this.saveState === this.stateCode.STANDBY && newState === this.stateCode.PLAY) {
            this.gameState.inventory.scrollIndex = 0;
            this.menus[this.stateCode.PLAY].tmpInventoryItems = this.InventoryLogic.saveInventory(this.gameState.inventory)
            this.menus[this.stateCode.PLAY].setStageInventory(p5);
            return;
        }

        // if we quit PLAY to STANDBY, reset inventory and board
        if (this.saveState === this.stateCode.PLAY && newState === this.stateCode.STANDBY) {
            this.gameState.setPlayerCanClick(true);
            // reset inventory
            this.gameState.inventory.scrollIndex = 0;
            this.InventoryLogic.loadInventory(this.menus[this.stateCode.PLAY].tmpInventoryItems, this.gameState.inventory);
            // destroy the play board
            this.menus[this.stateCode.PLAY] = null;
            return;
        }

        // if we go back to start menu from standby, we set New Game button into Resume Game.
        if (this.saveState === this.stateCode.STANDBY && newState === this.stateCode.MENU) {
            this.StartMenuLogic.changeNewToResume(this.menus[this.stateCode.MENU])
        }
    }

    handleMovables(p5) {
        // if movables has objects not moved:
        for (let movable of this.menus[this.stateCode.PLAY].movables) {
            if (!movable.hasMoved) {
                movable.movements(p5, this.menus[this.stateCode.PLAY]);
                return;
            }
            // don't delete dead movable object here, it distorts the iterator
            // encapsulate delete within each class
        }
        // all moved, if it not end turn, set player can click
        if (!this.menus[this.stateCode.PLAY].endTurn) {
            this.gameState.setPlayerCanClick(true);
        }
        // if it at end turn, invoke end turn stuff
        else {
            this.menus[this.stateCode.PLAY].endTurnActivity(p5);
        }
    }

}

