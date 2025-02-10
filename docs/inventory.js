import Button from "./button.js";

export default class Inventory {
    constructor(){
        this.x = 1700;
        this.y = 200;
        this.width = 200;
        this.height = 700;
        this.plantNum = 1;
        this.seedNum = 1;
        this.plantList = [];
        this.plantButtonList = [new PlantButton(this.x + 10, this.y + 10, 180, 100, 'tree \n Left: ' + this.plantNum)];

    }

}

export class PlantButton extends Button{

    checkClick() {
        if (this.isHovered) {
            this.isPressed = true;
            //simulate the effect of pressing
            setTimeout(() => this.isPressed = false, 100);
            return true;
        }
        return false;
    }
}