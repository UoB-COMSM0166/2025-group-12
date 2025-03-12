export class MenuItem {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.defaultX = x;
        this.targetX = x + 15;
        this.speed = 2;
        this.highlightAlpha = 0;
        this.width = width;
        this.height = height;
        this.hovering = false;
        this._onClick = (p5) => {
            console.log("button's onClick function is not overridden");
        };
    }

    set onClick(func) {
        this._onClick = func;
    }

    update(p5) {
        if(this.hovering){
            this.hovering = !this.disableHovering(p5);
        }
        else{
            this.hovering = this.isHovered(p5);
        }
        if (this.hovering) {
            if (this.x < this.targetX) {
                this.x += this.speed;
                if (this.x > this.targetX) this.x = this.targetX;
            }
        } else {
            if (this.x > this.defaultX) {
                this.x -= this.speed;
                if (this.x < this.defaultX) this.x = this.defaultX;
            }
        }

        if (this.hovering) {
            this.highlightAlpha += 15;
            if (this.highlightAlpha > 120) this.highlightAlpha = 120;
        } else {
            this.highlightAlpha -= 15;
            if (this.highlightAlpha < 0) this.highlightAlpha = 0;
        }
    }

    isHovered(p5) {
        return p5.mouseX > this.x && p5.mouseX < this.x + this.width&&
            p5.mouseY > this.y && p5.mouseY < this.y + this.height;
    }

    disableHovering(p5) {
        return p5.mouseX < this.x - this.width * 0.1 || p5.mouseX > this.x + this.width + this.width * 0.1 ||
            p5.mouseY <  this.y ||  p5.mouseY > this.y + this.height;
    }

    draw(p5) {
        p5.textSize(24);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.noStroke();
        p5.fill(255, 215, 0, this.highlightAlpha);
        p5.rect(this.defaultX, this.y, this.width * 0.1, this.height, this.width * 0.025, 0, 0, this.width * 0.025);

        let gradientWidth = this.width - this.width * 0.1;
        for (let i = 0; i < gradientWidth; i++) {
            let alpha = p5.map(i, 0, gradientWidth, this.highlightAlpha, 0);
            p5.noStroke();
            p5.fill(255, 215, 0, alpha);
            p5.rect(this.defaultX + this.width * 0.1 + i, this.y, 1, this.height);
        }

        p5.fill(255);
        p5.text(this.text, this.x, this.y + this.width * 0.14);
    }

    mouseClick(p5) {
        if (this.isHovered(p5)) {
            this._onClick(p5);
            return true;
        }
        return false;
    }
}
