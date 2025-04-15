class MapButton {
    constructor(x, y, size, img, stageGroup) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = size;
        this.height = size;
        this.isLocked = true;
        this.isCleared = false;
        this.img = img;
        this.isHovered = false;
        this._onClick = (p5) => {
            console.error("map button's onClick function is not overridden");
        };
        this.circle = null;
        this.stageGroup = stageGroup;
        this.mode = "mouse";
    }

    draw(p5) {
        this.isHovered = this.hasMouseOver(p5);
        if ((this.isHovered || this.circle !== null) && !this.isLocked) p5.image(this.img, this.x - this.width * 0.1, this.y - this.height * 0.1, this.width * 1.2, this.height * 1.2);
        else p5.image(this.img, this.x, this.y, this.width, this.height);
        if (this.isLocked === true) {
            p5.noStroke();
            p5.fill(100, 100, 100, 100);
            p5.rect(this.x + this.width * 0.1, this.y + this.height * 0.1, this.width * 0.8, this.height * 0.8);
            p5.image(p5.images.get("Lock"), this.x + this.width / 4, this.y + this.height / 4, this.width / 2, this.height / 2);
        }
        if (this.circle) this.circle.updateAndDraw(p5);
    }

    set onClick(func) {
        this._onClick = func;
    }

    get onClick() {
        return this._onClick;
    }

    unlock(gameState) {
        if (gameState.isStageCleared(this.stageGroup - 1)) {
            this.isLocked = false;
        }
        if (gameState.isStageCleared(this.stageGroup)) {
            this.isLocked = true;
            this.isCleared = true;
        }
    }

    createNewCircle(p5) {
        this.circle = new CircleAnimation(p5, this.x, this.y, this.size);

    }

    hasMouseOver(p5) {
        if (this.mode === "mouse") {
            return p5.mouseX > this.x && p5.mouseX < this.x + this.width
                && p5.mouseY > this.y && p5.mouseY < this.y + this.height;
        } else {
            return p5.gamepadX > this.x && p5.gamepadX < this.x + this.width
                && p5.gamepadY > this.y && p5.gamepadY < this.y + this.height;
        }
    }

    mouseClick(p5) {
        if (this.hasMouseOver(p5)) {
            this.onClick(p5);
            return true;
        }
        return false;
    }
}

class CircleAnimation {
    constructor(p5, x, y, size) {
        this.angleStart = 0.2 * p5.PI;
        this.angleEnd = 0.2 * p5.PI + 2.3 * p5.PI;
        this.x = x + size * 0.2;
        this.y = y + size * 0.2;
        this.size = size * 0.7;
        this.radiusAt = (t) => this.size + this.size * (2 / 7) * p5.sin(1.01 * p5.PI * t);
        this.thicknessAt = (t) => this.size * 0.1 + this.size * 0.1 * 0.5 * p5.noise(t * 5);
        this.tMax = 0;
        this.steps = 200;
    }

    updateAndDraw(p5) {
        this.update();
        this.draw(p5);
    }

    angleAt(p5, t) {
        return p5.lerp(this.angleStart, this.angleEnd, t);
    }

    update() {
        if (this.tMax < 1) {
            this.tMax += 0.025;
        }
    }

    draw(p5) {
        p5.push();
        p5.translate(this.x + this.size / 2, this.y + this.size / 2);
        p5.strokeWeight(1);
        p5.stroke("rgb(0, 204, 0)");
        p5.fill("rgb(0, 204, 0)");
        p5.beginShape(p5.TRIANGLE_STRIP);
        for (let i = 0; i <= this.steps * this.tMax; i++) {
            let t = i / this.steps;
            let a = this.angleAt(p5, t);
            let r = this.radiusAt(t);
            let th = this.thicknessAt(t);
            let outer = r + th / 2;
            let inner = r - th / 2;

            let x1 = p5.cos(a) * outer;
            let y1 = p5.sin(a) * outer;
            let x2 = p5.cos(a) * inner;
            let y2 = p5.sin(a) * inner;

            p5.vertex(x1, y1);
            p5.vertex(x2, y2);
        }
        p5.endShape();
        p5.pop();
    }
}

export {MapButton};

if (typeof module !== 'undefined') {
    module.exports = {MapButton};
}