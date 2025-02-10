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

            let nextMode = this.game.currentGameState.mode;
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
                this.game.inventory.plantButtonList.forEach(element => {
                    if (element.checkClick()) {
                        this.game.currentGameState.mode = 'plant';
                    }
                });

                if (this.game.currentGameState.mode === 'plant') {
                    this.game.currentGameState.board.tilesArray.forEach(row => {
                        row.forEach(cell => {
                            if (cell.mouseOver(this.p5)) {
                                //create a new plant 
                                this.game.currentGameState.plantList.push(new Plant(cell.x, cell.y));
                                cell.item.push(this.game.currentGameState.plantList[this.game.currentGameState.plantList.length - 1]);
                                cell.panel.plant = this.game.currentGameState.plantList[this.game.currentGameState.plantList.length - 1];
                                //prevent mouse click confilct, better ways can be found
                                setTimeout(() => {
                                    this.game.currentGameState.mode = 'view';
                                }, 100);

                                //decrease the number in the inventory
                                this.game.inventory.plantNum -= 1;
                                this.game.inventory.plantButtonList[0].label = 'tree \n Left: ' + this.game.inventory.plantNum;
                            }
                            console.log(cell.item[0]);
                        });
                    });

                }
                //show panel
                this.game.currentGameState.board.tilesArray.forEach(row => {
                    row.forEach(cell => {
                        if (this.game.currentGameState.mode === 'view') {
                            if (cell.mouseOver(this.p5)) {
                                cell.displayPanel = true;
                            }
                            else {
                                cell.displayPanel = false;
                            }
                        }
                        else{
                            cell.displayPanel = false;
                        }

                    });
                });


                if (this.game.currentGameState.roundButton.checkClick() && this.game.currentGameState.round < this.game.currentGameState.maxRound) {
                    this.game.currentGameState.round += 1;
                    this.game.currentGameState.roundButton.label = "Round " + this.game.currentGameState.round + " / " + this.game.currentGameState.maxRound;
                }
            }
        }
    }

    update() {
        if (this.game.currentGameState.board);
    }
}