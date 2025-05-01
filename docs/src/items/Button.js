class Button {
    static setup(bundle) {
        Button.CanvasSize = bundle.CanvasSize;
    }

    constructor(x, y, width, height, text, gamepadButton = null) {
        // location and size properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        // mouse status
        this.isHovered = false;
        this._onClick = (p5) => {
            console.error("button's onClick function is not overridden");
        };
        this.isSelected = false;
        this.mode = "mouse";
        this.gamepadButton = gamepadButton;
        this.textSize = Button.CanvasSize.getFontSize().small;
    }

    draw(p5) {
        this.isHovered = this.hasMouseOver(p5);
        let baseColor = "rgb(0, 102, 0)";
        let hoverColor = "rgb(0, 204, 0)";
        let buttonColor = this.isHovered ? hoverColor : baseColor;
        p5.push();
        p5.drawingContext.shadowBlur = this.isHovered ? 15 : 5;
        p5.drawingContext.shadowColor = p5.color(0, 0, 0, 50);
        // rectangle shape of button
        p5.noStroke();
        p5.fill(buttonColor);
        p5.rect(this.x, this.y, this.width, this.height, 10); // 10: corner roundedness
        // draw gamepad button
        if(this.mode === "gamepad" && this.gamepadButton){
            let gbSize = this.height / 2;
            p5.image(p5.images.get(this.gamepadButton), this.x + this.width - gbSize - this.height / 8, this.y + this.height - gbSize - this.height / 8, gbSize, gbSize);
        }
        // inner text
        p5.fill(255);
        p5.textSize(this.textSize);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.text, this.x + this.width / 2, this.y + this.height / 2);
        p5.pop();
    }

    set onClick(func) {
        this._onClick = func;
    }

    get onClick() {
        return this._onClick;
    }

    hasMouseOver(p5) {
        if (this.mode === "mouse") {
            return p5.mouseX > this.x && p5.mouseX < this.x + this.width &&
                p5.mouseY > this.y && p5.mouseY < this.y + this.height
        } else {
            return this.isSelected;
        }
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

export {Button};

if (typeof module !== 'undefined') {
    module.exports = {Button};
}