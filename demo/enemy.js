import { Sprite } from "./sprite";

export default class Enemy extends Sprite{
    constructor(game){
        super(game);
        this.position = [3, 3];
    }
}