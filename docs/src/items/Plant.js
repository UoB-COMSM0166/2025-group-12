import {itemTypes} from "./ItemTypes.js";

export class Plant {
    constructor() {
        this.type = itemTypes.PLANT;
    }

    getPassiveString() {
        console.error("getPassiveString not overridden.");
    }

    getActiveString() {
        console.error("getActiveString not overridden.");
    }
}