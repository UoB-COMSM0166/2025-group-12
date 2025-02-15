import { itemTypes } from "./ItemTypes.js";

export class Plant{
    constructor(){
        this.type = itemTypes.PLANT;
    }

    getPassiveString(){
        console.log("getPassiveString not overridden.");
    }

    getActiveString(){
        console.log("getActiveString not overridden.");
    }
}