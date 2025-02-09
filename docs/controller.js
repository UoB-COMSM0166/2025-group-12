import { Plant } from "./plant.js";
//enum
const gameStates = {
    MAINMENU: 0,
    HOMEPAGE: 1,
    LEVELPAGE: 2,
}


export default class Controller {
    constructor(p5, game, view) {
        this.p5 = p5;
        this.game = game;
        this.view = view;
    }

    inputListener() {
        this.p5.mousePressed = () => {
            if (this.game.currentGameState === this.game.gameStates[gameStates.MAINMENU]) {
                if (this.game.currentGameState.startButton.checkClick()) {
                    this.game.setGameState(gameStates.HOMEPAGE);
                }
            }
            else if (this.game.currentGameState === this.game.gameStates[gameStates.HOMEPAGE]) {
                if (this.game.currentGameState.mapButton.checkClick()) {
                    this.game.currentGameState.startlevelButton.display = true;
                }
                else {
                    this.game.currentGameState.startlevelButton.display = false;
                }
                if (this.game.currentGameState.startlevelButton.checkClick()) {
                    this.game.setGameState(gameStates.LEVELPAGE);
                }
            }
            else if (this.game.currentGameState === this.game.gameStates[gameStates.LEVELPAGE]) {
                this.game.inventory.plantList.forEach(element => {
                    if(element.checkClick()){
                        this.game.currentGameState.canPlant = true;
                        this.p5.push();
                        this.p5.fill(255);
                        this.p5.textSize(18);
                        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
                        this.p5.text("canPlant", 1000, 500);
                        this.p5.pop();
                    }

                });
                
                if(this.game.currentGameState.canPlant === true){
                    this.game.currentGameState.board.tilesArray.forEach(row => {
                        row.forEach(cell => {
                            if (cell.mouseOver(this.p5)) {
                                this.game.currentGameState.plantList.push(new Plant(cell.x, cell.y));
                                cell.item.push(this.game.currentGameState.plantList[this.game.currentGameState.plantList.length -1]);
                                this.game.currentGameState.canPlant = false;
                            }
                            console.log(cell.item[0]);
                        });
                    });
                    
                }

            }
        }
    }
}