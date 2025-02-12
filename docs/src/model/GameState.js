import {Inventory} from "./Inventory.js";

export const stateCode = {
    MENU: 1,
    STANDBY: 2,
    PLAY: 4,
    FINISH: 8
};

export class GameState {
    constructor(images) {
        this.state = stateCode.MENU; // default
        this.inventory = new Inventory();
        this.images = images; // store images so all menus can retrieve
        this.playerCanClick = true; // set this to false during end turn enemy activity
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
}

