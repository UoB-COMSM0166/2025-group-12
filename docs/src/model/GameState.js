import {Inventory} from "./Inventory.js";
import {Tornado1PlayBoard} from "./stages/Tor1.js";
import {Tornado2PlayBoard} from "./stages/Tor2.js";
import {Volcano1PlayBoard} from "./stages/Vol1.js";
import {LanguageManager} from "../LanguageManager.js";
import {Tornado3PlayBoard} from "./stages/Tor3.js";
import {Tornado4PlayBoard} from "./stages/Tor4.js";
import {Tornado5PlayBoard} from "./stages/Tor5.js";
import {Earthquake1PlayBoard} from "./stages/Ear1.js";
import {Blizzard1PlayBoard} from "./stages/Bli1.js";
import {Tsunami1PlayBoard} from "./stages/Tsu1.js";

export const stateCode = {
    MENU: 1,
    STANDBY: 2,
    MAP: 3,
    PLAY: 4,
    FINISH: 8
};

// game stages are now grouped and the code refers to affiliated group
// the game stage factory, combining with this.clearedStages handles which concrete stage to be allocated.
export const stageGroup = {
    NO_STAGE: 0,
    TORNADO: 1,     // 5 stages expected
    VOLCANO: 2,     // 1
    EARTHQUAKE: 4,  // 5?
    BLIZZARD: 8,   // 5?
    TSUNAMI: 16     // 1
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

class GameStageFactory {
    constructor() {
        this.stageClasses = Array.from({length: 20}, () => []);
        this.stageClasses[stageGroup.TORNADO].push(Tornado1PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado2PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado3PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado4PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado5PlayBoard);

        this.stageClasses[stageGroup.VOLCANO].push(Volcano1PlayBoard);

        this.stageClasses[stageGroup.EARTHQUAKE].push(Earthquake1PlayBoard);

        this.stageClasses[stageGroup.BLIZZARD].push(Blizzard1PlayBoard);

        this.stageClasses[stageGroup.TSUNAMI].push(Tsunami1PlayBoard);
    }

    // allocate game stage dynamically
    newGameStage(newStage, gameState) {
        let StageClasses = this.stageClasses[gameState.currentStageGroup];
        let index = gameState.clearedStages.get(gameState.currentStageGroup);
        let StageClass = StageClasses[index !== undefined ? index : 0];
        return StageClass ? new StageClass(gameState) : null;
    }
}
