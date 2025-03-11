import {myutil} from "../../lib/myutil.js";

export class Icon {
    constructor(p5, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = p5.images.get('Tornado');
        this.isHovered = false;
        this.modifier = 1
        this._onClick = (p5) => {
            this.modifier = 1.2;
        };
        this.hasClikced = false;
    }

    update() {
        if (this.isHovered) {
            this.modifier = Math.min(this.modifier + 0.05, 1.2);
        } else {
            this.modifier = 1;
        }
    }

    draw(p5) {
        p5.push();
        this.isHovered = this.hasMouseOver(p5);
        p5.image(this.image, this.x, this.y, this.width * this.modifier, this.height * this.modifier);
        p5.drawingContext.shadowBlur = this.isHovered ? 15 : 5;
        p5.drawingContext.shadowColor = p5.color(0, 0, 0, 50);
        p5.pop();
    }

    set onClick(func) {
        this._onClick = func;
    }

    hasMouseOver(p5) {
        return p5.mouseX > this.x && p5.mouseX < this.x + this.width
            && p5.mouseY > this.y && p5.mouseY < this.y + this.height;
    }

    mouseClick(p5) {
        if (this.hasMouseOver(p5)) {
            this._onClick(p5);
            return true;
        }
        return false;
    }
}