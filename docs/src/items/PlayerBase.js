import {itemTypes} from "./ItemTypes.js";

export class PlayerBase {
    constructor() {
        this.name = "PlayerBase";
        this.color = "red";
        this.type = itemTypes.TERRAIN;
    }
}