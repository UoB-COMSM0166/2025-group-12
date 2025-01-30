export default class Tiles{
    constructor(x, y, p){
        this.x = x;
        this.y = y;
        this.size = 20;
        this.p = p;
    }
    update(){

    }

    draw(){
        this.p.square(this.x, this.y, this.size);
    }

}
