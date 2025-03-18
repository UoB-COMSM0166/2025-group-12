import {itemTypes} from "./ItemTypes.js";

export class Plant {
    constructor() {
        this.type = itemTypes.PLANT;
    }

    stringify(){
    }

    parse(){
    }

    getPassiveString() {
        console.error("getPassiveString not overridden.");
    }

    getActiveString() {
        console.error("getActiveString not overridden.");
    }

    reevaluateSkills(playBoard, cell) {
        console.error("reevaluateSkills not overridden.");
    }
}