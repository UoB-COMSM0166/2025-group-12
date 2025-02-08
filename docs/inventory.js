import Button from "./button.js";

export default class Inventory {
    constructor(){
        this.plantList = [new Plant('tree')];
    }

}

class Plant extends Button{
    constructor(name){
        this.name = name;
        this.display = false;
        this.x = 1000;
        this.height
    }
}