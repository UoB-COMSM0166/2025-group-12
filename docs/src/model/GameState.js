export const stateCode = {
    MENU: 1,
    STANDBY: 2,
    PLAY: 4,
    FINISH: 8
};

// game stages are now grouped and the code refers to affiliated group
// the game stage factory, combining with this.clearedStages handles which concrete stage to be allocated.
export const stageGroup = {
    NO_STAGE: 0,
    TORNADO: 1,     // 5 stages expected
    VOLCANO: 2,     // 1
    EARTHQUAKE: 3,  // 5?
    BLIZZARD: 4,   // 5?
    TSUNAMI: 5,     // 1
}

// game state should not handle any switching logic but only stores information
export class GameState {
    constructor(p5, gsf, inventory) {
        this.state = stateCode.MENU; // default
        this.currentStageGroup = stageGroup.NO_STAGE; // no stage is selected
        this.currentStage = null;
        this.inventory = inventory;
        this.playerCanClick = true; // set this to false during end turn enemy activity
        this.paused = false;

        this.clearedStages = new Map();
        this.clearedStages.set(stageGroup.NO_STAGE, 1);

        this.gsf = gsf;
    }

    setState(newState) {
        console.log(`Game state changed to: ${Object.keys(stateCode).find(key => stateCode[key] === newState)}`);
        this.state = newState;
    }

    getState() {
        return this.state;
    }

    setPlayerCanClick(bool) {
        this.playerCanClick = bool;
    }

    togglePaused() {
        this.paused = !this.paused;
    }

    setStageCleared(playBoard) {
        if (this.clearedStages.has(playBoard.stageGroup)) {
            this.clearedStages.set(playBoard.stageGroup, this.clearedStages.get(playBoard.stageGroup) + 1);
        } else {
            this.clearedStages.set(playBoard.stageGroup, 1);
        }
    }

    isStageCleared(stageGroup) {
        let index = this.clearedStages.get(stageGroup);
        return index !== undefined && index >= this.gsf.stageClasses[stageGroup].length;
    }

    isSpecificStageCleared(stageGroup, numbering) {
        let index = this.clearedStages.get(stageGroup);
        return index !== undefined && index >= numbering;
    }

    // invoked by controller.
    newGameStage() {
        return this.gsf.newGameStage(this.currentStageGroup, this);
    }
}