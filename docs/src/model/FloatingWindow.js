// a semi-transparent floating window with messages.
class FloatingWindow {
    constructor(p5, triPos, text, boxParam) {
        this.p5 = p5;
        this.triPos = triPos;
        this.text = text;
        this.boxParam = boxParam;
        this.fontSize = boxParam.fontSize;
        this.padding = boxParam.padding;
        this.spacingRatio = boxParam.spacingRatio;
        this.fadingSpeed = boxParam.fadingSpeed;
        this.calculateBoxSize();
        this.x = boxParam.x - this.boxWidth / 2;
        this.y = boxParam.y - this.boxHeight / 2;

        this.playerCanClick = boxParam.playerCanClick;
        this.isFading = false;
        this.textOpacity = 255;
        this.boxOpacity = 100;
        this.textMaxOpacity = 255;
        this.boxMaxOpacity = 100;
    }


    // this is the only method user would invoke.
    draw() {
        this.p5.textAlign(this.p5.LEFT, this.p5.BASELINE);
        this.p5.textSize(this.fontSize);
        this.drawBackgroundBox(this.boxWidth, this.boxHeight, this.x, this.y);
        if (this.triPos !== null) {
            this.drawTriangle(this.x, this.y, this.boxWidth, this.boxHeight);
        }
        this.drawFormattedText(this.text, this.x + this.padding, this.y + this.padding + this.p5.textAscent());
    }

    /* black boxes. */

    calculateBoxSize() {
        this.p5.textSize(this.fontSize);
        let {totalWidth, totalHeight} = this.getTextDimensions(this.text, this.fontSize);

        this.boxWidth = totalWidth + this.padding * 2;
        this.boxHeight = totalHeight + this.padding * 2;
    }

    drawTriangle(x, y, width, height) {
        let dir = this.triPos[0];
        let pos = this.triPos[1];

        let triSize = Math.min(this.boxWidth, this.boxHeight) * 0.25;
        let px, py;
        let p1, p2, p3;

        if (dir === 'l') {
            px = x;
            py = this.getEdgePosition(y, height, pos);
            p1 = [px, py - triSize / 2];
            p2 = [px, py + triSize / 2];
            p3 = [px - triSize, py];
        } else if (dir === 'r') {
            px = x + width;
            py = this.getEdgePosition(y, height, pos);
            p1 = [px, py - triSize / 2];
            p2 = [px, py + triSize / 2];
            p3 = [px + triSize, py];
        } else if (dir === 'u') {
            px = this.getEdgePosition(x, width, pos);
            py = y;
            p1 = [px - triSize / 2, py];
            p2 = [px + triSize / 2, py];
            p3 = [px, py - triSize];
        } else if (dir === 'd') {
            px = this.getEdgePosition(x, width, pos);
            py = y + height;
            p1 = [px - triSize / 2, py];
            p2 = [px + triSize / 2, py];
            p3 = [px, py + triSize];
        }

        this.p5.fill(0, 0, 0, this.boxOpacity);
        this.p5.stroke('white');
        this.p5.strokeWeight(1);
        this.p5.triangle(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
        this.p5.noStroke();
    }

    getEdgePosition(start, size, pos) {
        if (pos === 'c') return start + size / 2;
        if (pos === 'u' || pos === 'l') return start + size * 0.25;
        if (pos === 'd' || pos === 'r') return start + size * 0.75;
        return start + size / 2;
    }

    getTextDimensions(str, fontSize) {
        this.p5.textSize(fontSize);
        let spacing = fontSize * this.spacingRatio;

        let parts = str.split("\\");

        let maxWidth = 0;
        let regex = /\{([^:}]+):([^}]+)\}/g;
        for (let line of parts) {
            let match;
            let lineWidth = 0;
            while ((match = regex.exec(line)) !== null) {
                let textContent = match[2];
                lineWidth += this.p5.textWidth(textContent) + spacing;
            }
            maxWidth = Math.max(maxWidth, lineWidth);
        }

        let lineHeight = this.p5.textAscent() + this.p5.textDescent();
        let totalHeight = parts.length * lineHeight;
        return {totalWidth: maxWidth, totalHeight: totalHeight};
    }

    drawBackgroundBox(width, height, x, y) {
        this.p5.fill(0, 0, 0, this.boxOpacity);
        this.p5.stroke('white');
        this.p5.strokeWeight(1);
        this.p5.rect(x, y, width, height, 10);
        this.p5.noStroke();
    }

    drawFormattedText(str, x0, y0) {
        let spacing = this.p5.textSize() * this.spacingRatio;
        let parts = str.split("\\");
        let y = y0;
        let lineHeight = this.p5.textAscent() + this.p5.textDescent();
        let regex = /\{([^:}]+):([^}]+)\}/g;
        for (let line of parts) {
            let match;
            let x = x0;

            while ((match = regex.exec(line)) !== null) {
                let color = this.p5.color(match[1]);
                let textContent = match[2];

                color.setAlpha(this.textOpacity);
                this.p5.fill(color);
                this.p5.text(textContent, x, y);
                x += this.p5.textWidth(textContent) + spacing;
            }

            y += lineHeight;
        }
    }

    fadeOut() {
        this.boxOpacity -= Math.ceil(this.boxMaxOpacity * this.fadingSpeed);
        this.textOpacity -= Math.ceil(this.textMaxOpacity * this.fadingSpeed);
    }

    hasFadedOut() {
        return this.boxOpacity <= 0 && this.textOpacity <= 0;
    }

    /* some floating windows are reusable: stage cleared, stage locked, invalid plant skill target, ect.
       use copyOf to create a copy of reusable window. */
    static copyOf(fw) {
        return new FloatingWindow(fw.p5, fw.triPos, fw.text, fw.boxParam);
    }
}

export {FloatingWindow};

if (typeof module !== 'undefined') {
    module.exports = {FloatingWindow};
}