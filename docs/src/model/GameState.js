import {Inventory} from "./Inventory.js";
import {Stage1PlayBoard} from "./stages/Stage1.js";
import {Stage2PlayBoard} from "./stages/Stage2.js";
import {Volcano1PlayBoard} from "./stages/V1.js";

export const stateCode = {
    MENU: 1,
    STANDBY: 2,
    PLAY: 4,
    FINISH: 8
};

export const stageCode = {
    NO_STAGE: 0,
    STAGE1: 1,
    STAGE2: 2,
    STAGE3: 3,
    STAGE4: 4,
    STAGE5: 5
}

export class GameState {
    constructor(p5) {
        this.p5 = p5;
        this.state = stateCode.MENU; // default
        this.currentStageCode = stageCode.NO_STAGE; // no stage is selected
        this.currentStage = null;
        this.inventory = new Inventory(this.p5);
        this.playerCanClick = true; // set this to false during end turn enemy activity
        this.paused = false;
        this.loaded = false;
        this.clearedStages = new Map();

        this.gsf = new GameStageFactory();
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

    togglePlayerCanClick() {
        this.playerCanClick = !this.playerCanClick;
    }

    togglePaused() {
        this.paused = !this.paused;
    }

    setStageCleared(playBoard) {
        if (this.clearedStages.has(playBoard.stageCode)) {
            this.clearedStages.set(playBoard.stageCode, this.clearedStages.get(playBoard.stageCode) + 1);
        } else {
            this.clearedStages.set(playBoard.stageCode, 1);
        }
    }

    isStageCleared(stageCode) {
        let index = this.clearedStages.get(stageCode);
        return index !== undefined && index>=this.gsf.stageClasses[stageCode].length;
    }

    newGameStage() {
        return this.gsf.newGameStage(this.currentStageCode, this);
    }
}

class GameStageFactory {
    constructor() {
        this.stageClasses = Array.from({length: 20}, ()=>[]); // long enough
        this.stageClasses[1].push(Stage1PlayBoard);
        this.stageClasses[1].push(Stage2PlayBoard);
        this.stageClasses[2].push(Volcano1PlayBoard);
    }

    newGameStage(newStage, gameState) {
        let StageClasses = this.stageClasses[gameState.currentStageCode];
        let index = gameState.clearedStages.get(gameState.currentStageCode);
        let StageClass = StageClasses[ index !== undefined? index : 0 ];
        return StageClass ? new StageClass(gameState) : null;
    }
}
