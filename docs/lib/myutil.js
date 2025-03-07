import {CanvasSize} from "../src/CanvasSize.js"
import {FloatingWindow} from "../src/model/FloatingWindow.js";
import {terrainTypes} from "../src/items/ItemTypes.js";
import {Bandit} from "../src/items/Bandit.js";
import {Tornado} from "../src/items/Tornado.js";

export class myutil {
    static mod2PiPositive(x) {
        return (((x % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) / Math.PI;
    }

    static relative2absolute(xPercent, yPercent) {

        if (xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1) {
            console.error(`input of relative2absolute (${xPercent}, ${yPercent}) are not percentages.`);
            return [-1];
        }

        return [xPercent * CanvasSize.getSize()[0], yPercent * CanvasSize.getSize()[1]];
    }

    static absolute2Relative(xAbsolute, yAbsolute) {

        if (xAbsolute < 0 || xAbsolute > CanvasSize.getSize()[0] || yAbsolute < 0 || yAbsolute > CanvasSize.getSize()[1]) {
            console.error(`input of absolute2Relative (${xAbsolute}, ${yAbsolute}) is not valid position.`);
            return [-1];
        }

        return [xAbsolute / CanvasSize.getSize()[0], yAbsolute / CanvasSize.getSize()[1]];
    }

    static manhattanDistance(x0, y0, x1, y1) {
        return Math.abs(x0 - x1) + Math.abs(y0 - y1);
    }

    static euclideanDistance(x0, y0, x1, y1) {
        return Math.abs(x0 - x1) ** 2 + Math.abs(y0 - y1) ** 2;
    }

    static findAlternativeCell(sx, sy, tx, ty, x0, y0) {
        let directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let dist = myutil.manhattanDistance(x0, y0, tx, ty);
        for (let [dx, dy] of directions) {
            let x1 = sx + dx;
            let y1 = sy + dy;
            if (x1 === x0 && y1 === y0) continue;
            if (myutil.manhattanDistance(x1, y1, tx, ty) === dist) {
                return [x1, y1];
            }
        }
        return null;
    }

    static drawHealthBar(p5, item, x, y, width, height) {
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(255, 255, 255, 0);
        p5.rect(x, y, width, height);

        let p = item.health / item.maxHealth;

        p5.noStroke();
        p5.fill("green");
        p5.rect(x, y, width * p, height);

        for (let i = 1; i < item.maxHealth; i++) {
            p5.stroke(0);
            p5.strokeWeight(1);
            p5.line(x + i * width / item.maxHealth, y, x + i * width / item.maxHealth, y + height);
        }
    }

    static drawActionPoints(p5, playBoard) {
        if (playBoard.hasActionPoints) {
            let [x, y] = myutil.relative2absolute(0.9, 0.5);
            let width = playBoard.gameState.inventory.inventoryWidth/2;
            let height = playBoard.gameState.inventory.inventoryWidth/2;
            p5.stroke("#DDDDDD");
            p5.strokeWeight(2);
            p5.fill("#DDDDDD");
            p5.rect(x, y, width, height, 20);

            let p = playBoard.actionPoints / playBoard.maxActionPoints;

            p5.noStroke();
            if(playBoard.actionPoints !== 0){
                p5.fill("#6699FF");
            }
            else{
                p5.fill("rgba(102,153,255,0.5)");
            }
            p5.rect(x, y, width, height, 20);

            p5.fill(255);
            p5.textSize(18);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(playBoard.actionPoints + " / " + playBoard.maxActionPoints,x + width / 2, y + height / 2);
        }
    }

    // when the main base is destroyed, invoke this function to display game over floating window
    static gameOver(playBoard) {
        if (playBoard.allFloatingWindows.has("001")) {
            playBoard.floatingWindow = playBoard.allFloatingWindows.get("001");
            playBoard.allFloatingWindows.delete("001");
        } else {
            console.error("playBoard does not have game over floating window?");
        }
        playBoard.isGameOver = true;
    }

    static generateRandomEnemy(p5, playBoard){
        let count = 0;
        while(count<20){
            let x = Math.floor(Math.random() * playBoard.gridSize);
            let y = Math.floor(Math.random() * playBoard.gridSize);
            let cell = playBoard.boardObjects.getCell(x, y);
            if(cell.plant === null && cell.enemy=== null && cell.terrain.terrainType === terrainTypes.STEPPE){
                let r = Math.floor(Math.random() * 2);
                switch(r){
                    case 0: Bandit.createNewBandit(p5, playBoard, x, y); break;
                    case 1: Tornado.createNewTornado(p5, playBoard, x, y, myutil.randomDirection()); break;
                }
                return;
            }
            count++; // prevent infinite loops
        }
    }

    static randomDirection(){
        let r = Math.floor(Math.random() * 4);
        switch (r){
            case 0: return 'u';
            case 1: return 'd';
            case 2: return 'l';
            case 3: return 'r';
        }
    }

    // convert canvas position into cell index
    static pos2CellIndex(playBoard, x, y) {
        // edges of the grid under old grid-centered coordinates
        let leftEdge = -(playBoard.gridSize * playBoard.cellWidth) / 2;
        let rightEdge = (playBoard.gridSize * playBoard.cellWidth) / 2;
        let topEdge = -(playBoard.gridSize * playBoard.cellHeight) / 2;
        let bottomEdge = (playBoard.gridSize * playBoard.cellHeight) / 2;

        // mouse position under old grid-centered coordinates
        let oldX = myutil.oldCoorX(playBoard, x - playBoard.canvasWidth / 2, y - playBoard.canvasHeight / 2);
        let oldY = myutil.oldCoorY(playBoard, x - playBoard.canvasWidth / 2, y - playBoard.canvasHeight / 2);

        // Check if click is within the grid
        if (oldX >= leftEdge && oldX <= rightEdge
            && oldY >= topEdge && oldY <= bottomEdge) {
            let col = Math.floor((oldX + (playBoard.gridSize * playBoard.cellWidth) / 2) / playBoard.cellWidth);
            let row = Math.floor((oldY + (playBoard.gridSize * playBoard.cellHeight) / 2) / playBoard.cellHeight);
            return [row, col];
        } else {
            return [-1];
        }
    }

    // convert cell index into canvas position
    static cellIndex2Pos(p5, playBoard, i, j, mode) {
        let x = -(playBoard.gridSize * playBoard.cellWidth / 2) + j * playBoard.cellWidth;
        let y = -(playBoard.gridSize * playBoard.cellHeight / 2) + i * playBoard.cellHeight;

        let x1 = myutil.newCoorX(playBoard, x, y) + playBoard.canvasWidth / 2;
        let y1 = myutil.newCoorY(playBoard, x, y) + playBoard.canvasHeight / 2;

        if (mode === p5.CORNER) {
            return [x1, y1];
        }

        let x2 = myutil.newCoorX(playBoard, x + playBoard.cellWidth, y) + playBoard.canvasWidth / 2;
        let y2 = myutil.newCoorY(playBoard, x + playBoard.cellWidth, y) + playBoard.canvasHeight / 2;
        let x3 = myutil.newCoorX(playBoard, x + playBoard.cellWidth, y + playBoard.cellHeight) + playBoard.canvasWidth / 2;
        let y3 = myutil.newCoorY(playBoard, x + playBoard.cellWidth, y + playBoard.cellHeight) + playBoard.canvasHeight / 2;
        let x4 = myutil.newCoorX(playBoard, x, y + playBoard.cellHeight) + playBoard.canvasWidth / 2;
        let y4 = myutil.newCoorY(playBoard, x, y + playBoard.cellHeight) + playBoard.canvasHeight / 2;

        if (mode === p5.CORNERS) {
            return [x1, y1, x2, y2, x3, y3, x4, y4];
        }

        if (mode === p5.CENTER) {
            return [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
        }
    }

    // the coordinate transformation is
    // (x')   ( Sx * cos(rot)  Sy * cos(rot+span) ) ( x )
    // (  ) = (                                   ) (   )
    // (y')   ( Sx * sin(rot)  Sy * sin(rot+span) ) ( y )

    static newCoorX(playBoard, x, y) {
        return x * playBoard.Sx * Math.cos(playBoard.rot) + y * playBoard.Sy * Math.cos(playBoard.span + playBoard.rot);
    }

    static newCoorY(playBoard, x, y) {
        return playBoard.Hy * (x * playBoard.Sx * Math.sin(playBoard.rot) + y * playBoard.Sy * Math.sin(playBoard.span + playBoard.rot));
    }

    static oldCoorX(playBoard, newX, newY) {
        return (1 / (playBoard.Sx * playBoard.Sy * Math.sin(playBoard.span))) * (playBoard.Sy * Math.sin(playBoard.rot + playBoard.span) * newX - playBoard.Sy * Math.cos(playBoard.rot + playBoard.span) * newY);
    }

    static oldCoorY(playBoard, newX, newY) {
        return -(1 / (playBoard.Sx * playBoard.Sy * Math.sin(playBoard.span))) * (playBoard.Sx * Math.sin(playBoard.rot) * newX - playBoard.Sx * Math.cos(playBoard.rot) * newY);
    }

    static commonFloatingWindows(p5, afw){
        afw.set("000", new FloatingWindow(p5, null, "{white:Stage Cleared!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("001", new FloatingWindow(p5, null, "{white:Game Over}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("002", new FloatingWindow(p5, null, "{white:Out of Action Points!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("010", new FloatingWindow(p5, null, "{white:An enemy is on this cell,}\\{white:you can't grow plant here!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("011", new FloatingWindow(p5, null, "{white:A seed or plant is already on this cell,}\\{white:you can't grow plant here!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("012", new FloatingWindow(p5, null, "{white:Cannot grow plant on incompatible terrain!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("050", new FloatingWindow(p5, null, "{white:Invalid target!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("051", new FloatingWindow(p5, null, "{white:The plant cannot activate skill}\\{white:so many times in one turn!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("052", new FloatingWindow(p5, null, "{white:Target is too far away!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("053", new FloatingWindow(p5, null, "{white:You cannot heal a plant not injured!}", {
            x: myutil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myutil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));
    }
}