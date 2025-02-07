export default class View {
    constructor(model, p5, controller) {
        console.log(p5);
        this.model = model;
        this.p5 = p5;
        console.log()
        this.controller = controller;
        this.startButton = new Button(1920 / 2 - 100/2, 700, 100, 40, "New Game");
        this.startlevelButton = new Button(1920 - 200, 900, 100, 40, "Start level");
        this.plantButton = new Button(1920 - 200, 300, 100, 40, "plant");
        this.mapButton = new Button(1920 / 2 - 100/2, 400, 500, 500, "Map buttom");
        this.inventoryButton = new Button()
        this.tile = new Tile(2, 2);
    }
    paintComponent(p5) {
        if (this.model.scene === "mainPage") {
            this.drawMainPage();
        }
        else if(this.model.scene === 'menu'){
            this.drawMenu();
        }
        else if(this.model.scene === 'map'){
            this.drawMap();
        }
    }

    inputListener(p5) {
        p5.mousePressed = () => {
            this.controller.setWidth();
            if (this.startButton.checkClick()) {
                this.controller.setScene('map');
            }
            if (this.startlevelButton.checkClick()) {
                this.controller.setScene('mainPage');
            }
            if(this.mapButton.checkClick()) {
                this.startlevelButton.display = true;
            }
            else{
                this.startlevelButton.display = false;
            }
        }
    }

    drawMainPage() {
        this.drawBoard();
        this.drawInventory();
    }

    drawMenu() {
        this.startButton.draw(this.p5);
    }

    drawBoard() {
        this.model.board.tilesArray.forEach(row => {
            row.forEach(cell => {
                this.p5.push();
                this.p5.image(this.p5.img, cell.x, cell.y, cell.width, cell.height,
                    0, 0, cell.spriteWidth, cell.spriteHeight);
                this.p5.pop();
            });
        });
    }

    drawMap(){
        this.p5.image(this.p5.map, 0, 0, 1920, 1080);
        this.mapButton.draw(this.p5);
        if(this.startlevelButton.display === true){
            this.startlevelButton.draw(this.p5);
        }
        this.drawInventory();
    }

    drawInventory(){
        this.p5.rect(1700, 200, 200, 700);
    }
}



class Button {
    constructor(x, y, w, h, label) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.isHovered = false;
        this.isPressed = false;
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

        // shaow
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
            setTimeout(() => this.isPressed = false, 100); // 模拟按下效果
            return true;
        }
        return false;
    }
}


class Tile {
    constructor(sx, sy) {
        this.spriteWidth = 456;
        this.spriteHeight = 497;
        this.width = this.spriteWidth / 5;
        this.height = this.spriteHeight / 5;
        this.sx = sx;
        this.sy = sy;
        this.offsetX = 350 - this.width;
        this.offsetY = 250;
        this.x = this.matrix(this.sx, this.sy).x;
        this.y = this.matrix(this.sx, this.sy).y;
        this.color = 'white';
        this.canStand = true;
        this.isHovered = false;
        this.isPressed = false;
        this.display = false;
    }

    draw(p5) {
        p5.push();
        p5.image(p5.img, this.x, this.y, this.width, this.height, 0, 0, this.spriteWidth, this.spriteHeight);
        p5.pop();
    }

    mouseOver(p5) {
        let temp = this.inverseMatrix(p5.mouseX, p5.mouseY);
        // if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
        console.log(p5.mouseX);
        console.log(this.inverseMatrix(p5.mouseX, p5.mouseY).x);
        // console.log(this.inverseMatrix(p5.mouseX, p5.mouseY).y);
        const error = 0.005
        if (this.inverseMatrix(p5.mouseX, p5.mouseY).x > this.sx &&
            this.inverseMatrix(p5.mouseX, p5.mouseY).x < this.sx + 1 &&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y > this.sy &&
            this.inverseMatrix(p5.mouseX, p5.mouseY).y < this.sy + 1) {
            return true;
        }
        else {
            return false;
        }
    }

    matrix(sx, sy) {
        let x, y;
        x = sx * 1 * this.width / 2 + sy * (-1) * this.height / 2 + this.offsetX;
        y = sx * 0.5 * this.width / 2 + sy * 0.5 * this.height / 2 + this.offsetY;
        return { x, y };
    }

    inverseMatrix(sx, sy) {
        //const offsetX = 850 - this.width;
        //const offsetY = 550;
        //sx -=offsetX, sy -=offsetY;
        let x, y;
        x = sx / this.width + sy * 2 / this.height;
        y = -sx / this.width + sy * 2 / this.height;
        return { x, y };
    }
}