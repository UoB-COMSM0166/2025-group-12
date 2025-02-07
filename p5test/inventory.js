export default class Inventory {
    constructor(){
        this.plantList = [new Plant('tree')];
    }

}

class Plant {
    constructor(name){
        this.name = name;
        this.display = false;
    }
}