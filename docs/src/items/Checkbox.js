export class Checkbox {
    constructor(x, y, width, height, text) {
        // location and size properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        // mouse status
        this.isHovered = false;
        this.isChecked = false;
        this._onClick = (p5) => {
            this.isChecked = !this.isChecked;
        };
    }

    draw(p5) {
        p5.push();
        this.isHovered = this.hasMouseOver(p5);
        p5.stroke(0);
        p5.noFill();
        p5.rect(this.x, this.y, this.width, this.height);
         if(this.isChecked) {
            p5.strokeWeight(4);
            p5.line(this.x + this.width * 0.05, this.y + this.height * 0.25, this.x + this.width/2, this.y + this.height);
            p5.line(this.x + this.width/2, this.y + this.height, this.x + this.width - this.width * 0.05, this.y + this.height * 0.25);
         }
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
            // p5.mySounds.get("click").play();
            return true;
        }
        return false;
    }
}