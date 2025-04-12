//
// export class Tsunami1PlayBoard extends BlizzardPlayBoard {
//     constructor(gameState) {
//         super(gameState);
//         this.stageGroup = stageGroup.TSUNAMI;
//         this.stageNumbering = 1;
//         // grid parameters
//         this.gridSize = 16;
//         [this.cellWidth, this.cellHeight] = myUtil.relative2absolute(1 / 20, 4 / 45);
//
//         // board objects array
//         this.boardObjects = new BoardCells(this.gridSize);
//
//         // turn counter
//         this.turn = 1;
//         this.maxTurn = 30;
//     }
//
//     setSeedCountdown(x, y) {
//         let cell = this.boardObjects.getCell(x, y);
//         if (cell.seed && this.fertilized[x][y]) {
//             cell.seed.countdown = 1;
//         }
//     }
//
//     // set stage inventory at entering, called by controller
//     setStageInventory(p5) {
//         this.gameState.inventory.pushItem2Inventory(p5, "Palm", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Tree", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Bush", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Orchid", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "FireHerb", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Bamboo", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Plum", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "Kiku", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "TreeSeed", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "BushSeed", 10);
//         this.gameState.inventory.pushItem2Inventory(p5, "OrchidSeed", 10);
//     }
//
//     // set stage terrain, called when the stage is loaded or reset
//     setStageTerrain(p5) {
//         for (let i = 0; i < this.gridSize; i++) {
//             for (let j = 0; j < this.gridSize; j++) {
//                 if (j >= 8) {
//                     this.boardObjects.setCell(i, j, new Steppe(p5));
//                 } else {
//                     this.boardObjects.setCell(i, j, new Sea(p5));
//                 }
//             }
//         }
//         this.boardObjects.setCell(8, 15, new PlayerBase(p5));
//         this.boardObjects.setCell(7, 8, new Mountain(p5));
//         this.boardObjects.setCell(7, 9, new PlayerBase(p5));
//     }
//
//     nextTurnItems(p5) {
//         if(this.turn === 2) TsunamiAnimation.createNewTsunami(p5, this, 1, -1, 5);
//         if(this.turn === 3) TsunamiAnimation.createNewTsunami(p5, this, 2, -1, 5);
//         if(this.turn === 4) TsunamiAnimation.createNewTsunami(p5, this, 3, -1, 5);
//         if(this.turn === 5) TsunamiAnimation.createNewTsunami(p5, this, 4, -1, 5);
//     }
//
//     modifyBoard(p5, code) {
//     }
//
//     setFloatingWindow(p5) {
//         if (this.turn === this.maxTurn + 1) {
//             if (this.allFloatingWindows.has("000")) {
//                 this.floatingWindow = this.allFloatingWindows.get("000");
//                 this.allFloatingWindows.delete("000");
//                 return;
//             }
//         }
//     }
//
//     initAllFloatingWindows(p5) {
//         let afw = new Map();
//
//         myUtil.commonFloatingWindows(p5, afw);
//
//         this.allFloatingWindows = afw;
//     }
// }
