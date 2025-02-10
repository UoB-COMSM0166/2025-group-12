export class Panel {
    constructor(tile){
        this.plant = null;
        this.tile = tile;
        this.x = 0;
        this.y = 700;
        this.width = 300;
        this.height = 300;
        this.text = "plant" + this.tile;
    }

    toString(){
        return this.text;
    }
}