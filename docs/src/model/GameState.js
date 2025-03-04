import {Inventory} from "./Inventory.js";
import {Tornado1PlayBoard} from "./stages/Tor1.js";
import {Tornado2PlayBoard} from "./stages/Tor2.js";
import {Volcano1PlayBoard} from "./stages/Vol1.js";
import {LanguageManager} from "../LanguageManager.js";
import {Tornado3PlayBoard} from "./stages/Tor3.js";
import * as playboard from "./GameState.js";

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
    TORNADO: 1,
    VOLCANO: 2,
}

// game state should not handle any switching logic but only stores information
export class GameState {
    constructor(p5) {
        this.p5 = p5;
        this.state = stateCode.MENU; // default
        this.currentStageGroup = stageGroup.NO_STAGE; // no stage is selected
        this.currentStage = null;
        this.inventory = new Inventory(this.p5);
        this.playerCanClick = true; // set this to false during end turn enemy activity
        this.paused = false;
        this.loaded = false;
        this.clearedStages = new Map();

        this.gsf = new GameStageFactory();
        this.languageManager = new LanguageManager();
        this.showOptions = false;
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

    // invoked by controller.
    newGameStage() {
        return this.gsf.newGameStage(this.currentStageGroup, this);
    }
}

class GameStageFactory {
    constructor() {
        this.stageClasses = Array.from({length: 20}, () => []);
        this.stageClasses[stageGroup.TORNADO].push(Tornado1PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado2PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado3PlayBoard);
        this.stageClasses[stageGroup.VOLCANO].push(Volcano1PlayBoard);
    }

    // allocate game stage dynamically
    newGameStage(newStage, gameState) {
        let StageClasses = this.stageClasses[gameState.currentStageGroup];
        let index = gameState.clearedStages.get(gameState.currentStageGroup);
        let StageClass = StageClasses[index !== undefined ? index : 0];
        return StageClass ? new StageClass(gameState) : null;
    }
}
