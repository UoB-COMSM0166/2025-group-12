import Button from "./button.js";

export default class Inventory {
    constructor(){
        this.x = 1700;
        this.y = 200;
        this.width = 200;
        this.height = 700;
        this.plantList = [new PlantButton(this.x + 10, this.y + 10, 200, 100, 'tree')];
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