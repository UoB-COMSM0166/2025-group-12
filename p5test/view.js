const gameStates = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}

export default class View {
    constructor(game, p5) {
        this.game = game;
        this.p5 = p5;
        this.startButton = new Button(1920 / 2 - 100/2, 700, 100, 40, "New Game");
        this.startlevelButton = new Button(1920 - 200, 900, 100, 40, "Start level");
        this.plantButton = new Button(1920 - 200, 300, 100, 40, "plant");
        this.mapButton = new Button(1920 / 2 - 100/2, 400, 500, 500, "Map buttom");
        this.inventoryButton = new Button();
    }
    drawAll(p5) {
        if (this.game.currentGameState === this.game.gameStates[gameStates.MAINMENU]) {
            this.drawMainMenu();
        }
        else if(this.game.currentGameState === this.game.gameStates[gameStates.HOMEPAGE]){
            this.drawHomePage();
        }
        else if(this.game.currentGameState === this.game.gameStates[gameStates.LEVELPAGE]){
            this.drawLevelPage();
        }
    }

    drawMainMenu() {
        this.startButton.draw(this.p5);
    }

    drawLevelPage() {
        this.drawBoard();
        this.drawInventory();
    }

    drawBoard() {
        this.game.currentGameState.board.tilesArray.forEach(row => {
            row.forEach(cell => {
                this.p5.push();
                this.p5.image(this.p5.img, cell.x, cell.y, cell.width, cell.height,
                    0, 0, cell.spriteWidth, cell.spriteHeight);
                this.p5.pop();
            });
        });
    }

    drawHomePage(){
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
            setTimeout(() => this.isPressed = false, 100); // 模拟按下效果
            return true;
        }
        return false;
    }
}