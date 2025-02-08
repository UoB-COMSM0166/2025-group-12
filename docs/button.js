export default class Button {
    constructor(x, y, w, h, label) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.isHovered = false;
        this.isPressed = false;
        this.display = false;
    }

    draw(p5) {
        p5.push();
        // check if the mouse is over
        this.isHovered = p5.mouseX > this.x && p5.mouseX < this.x + this.w &&
            p5.mouseY > this.y && p5.mouseY < this.y + this.h;

        //color effect
        let baseColor = p5.color(100, 150, 255);
        let hoverColor = p5.color(150, 200, 255);
        let pressColor = p5.color(80, 130, 235);
        let buttonColor = this.isPressed ? pressColor : (this.isHovered ? hoverColor : baseColor);

        // shadow
        p5.drawingContext.shadowBlur = this.isHovered ? 15 : 5;
        p5.drawingContext.shadowColor = p5.color(0, 0, 0, 50);

        // draw
        p5.noStroke();
        p5.fill(buttonColor);
        p5.rect(this.x, this.y, this.w, this.h, 10);

        // text
        p5.fill(255);
        p5.textSize(18);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
        p5.pop();
    }

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