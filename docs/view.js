const gameStates = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}

export default class View {
    constructor(game, p5) {
        this.game = game;
        this.p5 = p5;
    }
    //called in the main function
    drawAll() {
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
        this.game.currentGameState.buttonList.forEach(element => {
            element.draw(this.p5);
        });
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
        this.game.currentGameState.mapButton.draw(this.p5);
        if(this.game.currentGameState.startlevelButton.display === true){
            this.game.currentGameState.startlevelButton.draw(this.p5);
        }
        this.drawInventory();
    }

    drawInventory(){
        this.p5.rect(1700, 200, 200, 700);
    }
}