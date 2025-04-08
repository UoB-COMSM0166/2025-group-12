import {stageGroup} from "../GameState.js";
import {PlayBoard} from "../Play.js";
import {baseType, movableTypes, plantTypes, terrainTypes} from "../../items/ItemTypes.js";
import {Bamboo} from "../../items/Bamboo.js";
import {SlideAnimation} from "../../items/SlideAnimation.js";

export class EarthquakePlayBoard extends PlayBoard {
    constructor(gameState) {
        super(gameState);
        this.stageGroup = stageGroup.EARTHQUAKE;
    }




}