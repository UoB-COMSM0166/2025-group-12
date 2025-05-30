class Dropdown {
    static setup(bundle) {
        Dropdown.CanvasSize = bundle.CanvasSize;
    }

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.options = ["960 * 540", "1280 * 720", "1920 * 1080", "2560 * 1440"];
        this.isOpen = false;
        this._onClick = (p5) => {
            this.isOpen = !this.isOpen;
        };
        this.selectedOption = "1280 * 720";
        this.mode = "mouse";
        this.isSelected = false;
        this.index = 1;
    }

    set onClick(func) {
        this._onClick = func;
    }

    get onClick() {
        return this._onClick;
    }

    isHovered(p5) {
        if (this.mode === "mouse") {
            return p5.mouseX > this.x && p5.mouseX < this.x + this.width &&
                p5.mouseY > this.y && p5.mouseY < this.y + this.height
        } else {
            return this.isSelected;
        }
    }



    draw(p5) {
        if(this.isSelected) p5.stroke('yellow');
        else p5.stroke(0);
        p5.fill("rgb(45,78,103)");
        p5.rect(this.x, this.y, this.width, this.height);
        p5.stroke(0);
        p5.fill(0);
        p5.textSize(Dropdown.CanvasSize.getFontSize().letter);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text(this.selectedOption, this.x + 10, this.y + this.height / 2);
        p5.textAlign(p5.RIGHT, p5.CENTER);
        p5.textSize(Dropdown.CanvasSize.getFontSize().mini);
        p5.text(this.isOpen ? '▲' : '▼', this.x + this.width - 10, this.y + this.height / 2);

        if (this.isOpen) {
            for (let i = 0; i < this.options.length; i++) {
                let y = this.y + this.height * (i + 1);
                p5.fill("rgb(45,78,103)");
                p5.stroke(0);
                p5.rect(this.x, y, this.width, this.height);
                if(this.index === i && this.mode === "gamepad") {p5.fill("yellow");}
                else{p5.fill(0);}
                p5.textAlign(p5.LEFT, p5.CENTER);
                p5.textSize(Dropdown.CanvasSize.getFontSize().letter);
                p5.text(this.options[i], this.x + 10, y + this.height / 2);
            }
        }
    }

    mouseClick(p5) {
        if(this.mode === "mouse") {
            if(p5.mouseX > this.x && p5.mouseX < this.x + this.width) {
                if (p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
                    this.isOpen = !this.isOpen;
                    return true;
                } else if(this.isOpen) {
                    for (let i = 0; i < this.options.length; i++) {
                        let y = this.y + this.height * (i + 1);
                        if(p5.mouseY > y && p5.mouseY < y + this.height) {
                            this.selectedOption = this.options[i];
                            this.isOpen = false;
                            Dropdown.CanvasSize.setSize(i);
                            return true;
                        }
                    }
                }else{
                    this.isOpen = false;
                    return false;
                }
            } else{
                this.isOpen = false;
                return false;
            }
        }
        else{
            if(this.isSelected) {
                if (!this.isOpen) {
                    this.isOpen = true;
                    return true;
                } else  {
                    for (let i = 0; i < this.options.length; i++) {
                        if(this.index === i) {
                            this.selectedOption = this.options[i];
                            this.isOpen = false;
                            Dropdown.CanvasSize.setSize(i);
                            return true;
                        }
                    }
                }
            } else{
                this.isOpen = false;
                return false;
            }
        }

    }
}

export {Dropdown};

if (typeof module !== 'undefined') {
    module.exports = {Dropdown};
}