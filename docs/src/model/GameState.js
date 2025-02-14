import {Inventory} from "./Inventory.js";

export const stateCode = {
    MENU: 1,
    STANDBY: 2,
    PLAY: 4,
    FINISH: 8
};

export const stageCode = {
    NOSTAGE: 0,
    STAGE1: 1,
    STAGE2: 2,
    STAGE3: 3,
    STAGE4: 4,
    STAGE5: 5
}

export class GameState {
    constructor(images) {
        this.state = stateCode.MENU; // default
        this.currentStage = stageCode.NOSTAGE; // no stage is selected
        this.inventory = new Inventory();
        this.images = images; // store images so all menus can retrieve
        this.playerCanClick = true; // set this to false during end turn enemy activity
        this.paused = false;
        this.enemyCanMove = false;
    }

    setState(newState) {
        if (Object.values(stateCode).includes(newState)) {
            console.log(`Game state changed to: ${Object.keys(stateCode).find(key => stateCode[key] === newState)}`);
            this.state = newState;
        } else {
            console.error("Invalid state:", newState);
        }
    }

    getState() {
        return this.state;
    }

    togglePlayerCanClick(){
        this.playerCanClick = !this.playerCanClick;
    }

    togglePaused(){
        this.paused = !this.paused;
    }

    toggleEnemyCanMove(){
        this.enemyCanMove = !this.enemyCanMove;
    }
}

