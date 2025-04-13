class Controller {
    constructor(bundle) {
        /** @type {GameState} */
        this.gameState = bundle.gameState;
        this.menus = bundle.menus;
        this.pauseMenu = bundle.pauseMenu;
        this.inputHandler = bundle.inputHandler;
        this.stateCode = bundle.stateCode;
        /** @type {stateCode} */
        this.saveState = bundle.initialState;
        /** @type {typeof ScreenLogic} */
        this.ScreenLogic = bundle.ScreenLogic;
        /** @type {typeof StartMenuLogic} */
        this.StartMenuLogic = bundle.StartMenuLogic;
        /** @type {typeof GameMapLogic} */
        this.GameMapLogic = bundle.GameMapLogic;
        /** @type {typeof PlayBoardModel} */
        this.PlayBoardModel = bundle.PlayBoardModel;
        /** @type {typeof PlayBoardLogic} */
        this.PlayBoardLogic = bundle.PlayBoardLogic;
        /** @type {typeof PauseMenuLogic} */
        this.PauseMenuLogic = bundle.PauseMenuLogic;
        /** @type {typeof InventoryLogic} */
        this.InventoryLogic = bundle.InventoryLogic;
        /** @type {typeof MovableLogic} */
        this.MovableLogic = bundle.MovableLogic;

        this.logicFactory = new Map([
            [this.stateCode.MENU, this.StartMenuLogic],
            [this.stateCode.STANDBY, this.GameMapLogic],
            [this.stateCode.PLAY, this.PlayBoardLogic],
        ])
    }

    clickListener(p5) {
        if (this.gameState.paused) {
            this.PauseMenuLogic.handleClick(p5, this.pauseMenu);
            return;
        }
        if (this.gameState.playerCanClick === false) {
            return;
        }
        let currentState = this.gameState.getState();
        let currentMenu = this.menus[currentState];
        if (currentMenu && this.logicFactory.get(currentState).handleClick) {
            this.logicFactory.get(currentState).handleClick(p5, currentMenu);
        }
    }

    scrollListener(p5, event) {
        let currentState = this.gameState.getState();
        let currentMenu = this.menus[currentState];
        if (currentMenu && this.logicFactory.get(currentState).handleScroll) {
            this.logicFactory.get(currentState).handleScroll(event, currentMenu);
        }
    }

    handleFading(p5){
        this.ScreenLogic.stateTransitionAtFading(p5, this.menus[this.gameState.getState()]);
    }

    // when shift to PLAY from STANDBY, create the new play board
    setPlayStage(p5) {
        if (this.gameState.getState() === this.stateCode.PLAY
            && (this.menus[this.stateCode.PLAY] === null || this.menus[this.stateCode.PLAY].stageGroup !== this.gameState.currentStageGroup)) {

            let stagePackage = this.gameState.gsf.newGameStage(this.gameState.currentStageGroup, this.gameState);
            this.PlayBoardModel.concreteBoardInit = stagePackage.concreteBoardInit.bind(stagePackage);
            this.PlayBoardModel.setStageInventory = stagePackage.setStageInventory.bind(stagePackage);
            this.PlayBoardModel.setStageTerrain = stagePackage.setStageTerrain.bind(stagePackage);
            this.PlayBoardModel.initAllFloatingWindows = stagePackage.initAllFloatingWindows.bind(stagePackage);
            this.PlayBoardLogic.nextTurnItems = stagePackage.nextTurnItems.bind(stagePackage);
            this.PlayBoardLogic.modifyBoard = stagePackage.modifyBoard.bind(stagePackage);
            this.PlayBoardLogic.setFloatingWindow = stagePackage.setFloatingWindow.bind(stagePackage);

            this.menus[this.stateCode.PLAY] = new this.PlayBoardModel(p5, this.gameState);
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
            this.menus[this.stateCode.PLAY].tmpInventoryItems = this.InventoryLogic.saveInventory(this.gameState.inventory);
            this.PlayBoardModel.setStageInventory(p5, this.menus[this.stateCode.PLAY]);
            return;
        }

        // if we quit PLAY to STANDBY, reset inventory and board
        if (this.saveState === this.stateCode.PLAY && newState === this.stateCode.STANDBY) {
            this.gameState.setPlayerCanClick(true);
            // reset inventory
            this.gameState.inventory.scrollIndex = 0;
            this.InventoryLogic.loadInventory(this.menus[this.stateCode.PLAY].tmpInventoryItems, this.gameState.inventory)
            // destroy the play board
            this.menus[this.stateCode.PLAY] = null;
            return;
        }

        // if we go back to start menu from standby, we set New Game button into Resume Game.
        if (this.saveState === this.stateCode.STANDBY && newState === this.stateCode.MENU) {
            this.StartMenuLogic.changeNewToResume(this.menus[this.stateCode.MENU]);
        }
    }

    handleMovables(p5) {
        // if movables has objects not moved:
        for (let movable of this.menus[this.stateCode.PLAY].movables) {
            if (!movable.hasMoved) {
                this.MovableLogic.movements(p5, this.menus[this.stateCode.PLAY], /** @type {MovableLike} */ movable);
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
            this.PlayBoardLogic.endTurnActivity(p5, this.menus[this.stateCode.PLAY]);
        }
    }

}

export {Controller};

if (typeof module !== 'undefined') {
    module.exports = {Controller};
}