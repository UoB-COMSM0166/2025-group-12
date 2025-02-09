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
        else if (this.game.currentGameState === this.game.gameStates[gameStates.HOMEPAGE]) {
            this.drawHomePage();
        }
        else if (this.game.currentGameState === this.game.gameStates[gameStates.LEVELPAGE]) {
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
        this.drawRound();
    }

    drawBoard() {
        this.game.currentGameState.board.tilesArray.forEach(row => {
            row.forEach(cell => {
                this.p5.push();
                this.p5.image(this.p5.img, cell.x, cell.y, cell.width, cell.height,
                    0, 0, cell.spriteWidth, cell.spriteHeight);
                if (cell.item[0]) {
                    this.p5.rect(cell.item[0].x, cell.item[0].y, cell.item[0].width, cell.item[0].height);
                }
                this.p5.pop();
            });
        });
    }

    drawHomePage() {
        this.p5.image(this.p5.map, 0, 0, 1920, 1080);
        this.game.currentGameState.mapButton.draw(this.p5);
        if (this.game.currentGameState.startlevelButton.display === true) {
            this.game.currentGameState.startlevelButton.draw(this.p5);
        }
        //this.drawInventory();
    }

    drawInventory() {
        this.p5.rect(this.game.inventory.x, this.game.inventory.y, this.game.inventory.width, this.game.inventory.height);
        this.game.inventory.plantList.forEach(element => {
            element.draw(this.p5);
        });
    }

    drawTile(tile) {
        this.p5.image(this.p5.img, tile.x, tile.y, tile.width)
    }

    drawRound() {
        this.game.currentGameState.roundButton.draw(this.p5);
    }
}