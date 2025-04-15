const stateCode = {
    MENU: 1,
    STANDBY: 2,
    PLAY: 4,
    FINISH: 8
};

// game stages are now grouped and the code refers to affiliated group
// the game stage factory, combining with this.clearedStages handles which concrete stage to be allocated.
// MAKE THESE CONSTANTS CONTINUOUS ! ! ! ! !
// conditions like playBoard.stageGroup >= stageGroup.BLIZZARD present.
/**
 * @global
 * @typedef {Object} stageGroup
 * @property {number} NO_STAGE
 * @property {number} TORNADO
 * @property {number} VOLCANO
 * @property {number} EARTHQUAKE
 * @property {number} BLIZZARD
 * @property {number} TSUNAMI
 */
const stageGroup = {
    NO_STAGE: 0,
    TORNADO: 1,     // 5 stages expected
    VOLCANO: 2,     // 1
    EARTHQUAKE: 3,  // 5?
    BLIZZARD: 4,   // 5?
    TSUNAMI: 5,     // 1
}

// game state should not handle any switching logic but only stores information
class GameState {
    /**
     *
     * @param p5
     * @param {GameStageFactory} gsf
     * @param {InventoryModel} inventory
     */
    constructor(p5, gsf, inventory) {
        this.state = stateCode.MENU; // default
        this.currentStageGroup = stageGroup.NO_STAGE; // no stage is selected
        /** @type {null|PlayBoardLike} */
        this.currentStage = null;
        /** @type {InventoryModel} */
        this.inventory = inventory;
        this.playerCanClick = true; // set this to false during end turn enemy activity
        this.paused = false;

        this.clearedStages = new Map();
        this.clearedStages.set(stageGroup.NO_STAGE, 1);
        /** @type {GameStageFactory} */
        this.gsf = gsf;

        // fade in fade out render
        this.isFading = false;
        this.nextState = null;

        // gamepad
        this.mode = "mouse";
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

    /**
     *
     * @param boardStageGroup
     */
    setStageCleared(boardStageGroup) {
        if (this.clearedStages.has(boardStageGroup)) {
            this.clearedStages.set(boardStageGroup, this.clearedStages.get(boardStageGroup) + 1);
        } else {
            this.clearedStages.set(boardStageGroup, 1);
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
}

export {stateCode, stageGroup, GameState};

if (typeof module !== 'undefined') {
    module.exports = {stateCode, stageGroup, GameState};
}