export class Button {
    constructor(x, y, width, height, text) {
        // location and size properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        // mouse status
        this.isHovered = false;
        this.display = false;
        this._onClick = (p5) => {console.log("button's onClick function is not overridden");};
    }

    draw(p5) {
        p5.push();
        this.isHovered = this.hasMouseOver(p5);
        let baseColor = p5.color(100, 150, 255);
        let hoverColor = p5.color(150, 200, 255);
        let buttonColor = this.isHovered ? hoverColor : baseColor;
        p5.drawingContext.shadowBlur = this.isHovered ? 15 : 5;
        p5.drawingContext.shadowColor = p5.color(0, 0, 0, 50);
        // rectangle shape of button
        p5.noStroke();
        p5.fill(buttonColor);
        p5.rect(this.x, this.y, this.width, this.height, 10); // 10: corner roundedness
        // inner text
        p5.fill(255);
        p5.textSize(18);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.text, this.x + this.width / 2, this.y + this.height / 2);
        p5.pop();
    }

    set onClick(func) {
        this._onClick = func;
    }

    hasMouseOver(p5){
        return p5.mouseX > this.x && p5.mouseX < this.x + this.width
            && p5.mouseY > this.y && p5.mouseY < this.y + this.height;
    }

    mouseClick(p5) {
        if(this.hasMouseOver(p5)) {
            this._onClick(p5);
        }
    }
}