class myUtil {

    static setup(bundle) {
        myUtil.CanvasSize = bundle.CanvasSize;
        myUtil.FloatingWindow = bundle.FloatingWindow;
    }

    static relative2absolute(xPercent, yPercent) {

        if (xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1) {
            console.error(`input of relative2absolute (${xPercent}, ${yPercent}) are not percentages.`);
            return [-1];
        }

        return [xPercent * myUtil.CanvasSize.getSize()[0], yPercent * myUtil.CanvasSize.getSize()[1]];
    }

    static absolute2Relative(xAbsolute, yAbsolute) {

        if (xAbsolute < 0 || xAbsolute > myUtil.CanvasSize.getSize()[0] || yAbsolute < 0 || yAbsolute > myUtil.CanvasSize.getSize()[1]) {
            console.error(`input of absolute2Relative (${xAbsolute}, ${yAbsolute}) is not valid position.`);
            return [-1];
        }

        return [xAbsolute / myUtil.CanvasSize.getSize()[0], yAbsolute / myUtil.CanvasSize.getSize()[1]];
    }

    static manhattanDistance(x0, y0, x1, y1) {
        return Math.abs(x0 - x1) + Math.abs(y0 - y1);
    }

    static euclideanDistance(x0, y0, x1, y1) {
        return Math.abs(x0 - x1) ** 2 + Math.abs(y0 - y1) ** 2;
    }

    static getFontSize(){
        return myUtil.CanvasSize.getFontSize();
    }

    static getScaleFactor(){
        return myUtil.CanvasSize.getScaleFactor();
    }

    static findAlternativeCell(sx, sy, tx, ty, x0, y0) {
        let directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let dist = myUtil.manhattanDistance(x0, y0, tx, ty);
        for (let [dx, dy] of directions) {
            let x1 = sx + dx;
            let y1 = sy + dy;
            if (x1 === x0 && y1 === y0) continue;
            if (myUtil.manhattanDistance(x1, y1, tx, ty) === dist) {
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

    // convert canvas position into cell index
    static pos2CellIndex(playBoard, x, y) {
        // edges of the grid under old grid-centered coordinates
        let leftEdge = -(playBoard.gridSize * playBoard.cellWidth) / 2;
        let rightEdge = (playBoard.gridSize * playBoard.cellWidth) / 2;
        let topEdge = -(playBoard.gridSize * playBoard.cellHeight) / 2;
        let bottomEdge = (playBoard.gridSize * playBoard.cellHeight) / 2;

        // mouse position under old grid-centered coordinates
        let oldX = myUtil.oldCoorX(playBoard, x - playBoard.canvasWidth / 2, y - playBoard.canvasHeight / 2);
        let oldY = myUtil.oldCoorY(playBoard, x - playBoard.canvasWidth / 2, y - playBoard.canvasHeight / 2);

        // Check if click is within the grid
        if (oldX >= leftEdge && oldX <= rightEdge
            && oldY >= topEdge && oldY <= bottomEdge) {
            let col = Math.min(playBoard.gridSize-1, Math.floor((oldX + (playBoard.gridSize * playBoard.cellWidth) / 2) / playBoard.cellWidth));
            let row = Math.min(playBoard.gridSize-1, Math.floor((oldY + (playBoard.gridSize * playBoard.cellHeight) / 2) / playBoard.cellHeight));
            return [row, col];
        } else {
            return [-1];
        }
    }

    // convert cell index into canvas position
    static cellIndex2Pos(p5, playBoard, i, j, mode) {
        let x = -(playBoard.gridSize * playBoard.cellWidth / 2) + j * playBoard.cellWidth;
        let y = -(playBoard.gridSize * playBoard.cellHeight / 2) + i * playBoard.cellHeight;

        let x1 = myUtil.newCoorX(playBoard, x, y) + playBoard.canvasWidth / 2;
        let y1 = myUtil.newCoorY(playBoard, x, y) + playBoard.canvasHeight / 2;

        if (mode === p5.CORNER) {
            return [x1, y1];
        }

        let x2 = myUtil.newCoorX(playBoard, x + playBoard.cellWidth, y) + playBoard.canvasWidth / 2;
        let y2 = myUtil.newCoorY(playBoard, x + playBoard.cellWidth, y) + playBoard.canvasHeight / 2;
        let x3 = myUtil.newCoorX(playBoard, x + playBoard.cellWidth, y + playBoard.cellHeight) + playBoard.canvasWidth / 2;
        let y3 = myUtil.newCoorY(playBoard, x + playBoard.cellWidth, y + playBoard.cellHeight) + playBoard.canvasHeight / 2;
        let x4 = myUtil.newCoorX(playBoard, x, y + playBoard.cellHeight) + playBoard.canvasWidth / 2;
        let y4 = myUtil.newCoorY(playBoard, x, y + playBoard.cellHeight) + playBoard.canvasHeight / 2;

        if (mode === p5.CORNERS) {
            return [x1, y1, x2, y2, x3, y3, x4, y4];
        }

        if (mode === p5.CENTER) {
            return [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
        }
    }

    static isCursorInQuad(px, py, x1, y1, x2, y2, x3, y3, x4, y4) {
        function crossProduct(xa, ya, xb, yb, xc, yc) {
            return (xb - xa) * (yc - ya) - (yb - ya) * (xc - xa);
        }

        let c1 = crossProduct(x1, y1, x2, y2, px, py);
        let c2 = crossProduct(x2, y2, x3, y3, px, py);
        let c3 = crossProduct(x3, y3, x4, y4, px, py);
        let c4 = crossProduct(x4, y4, x1, y1, px, py);

        return (c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0) || (c1 < 0 && c2 < 0 && c3 < 0 && c4 < 0);
    }

    static enterFullscreen() {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
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

    static commonFloatingWindows(p5, afw) {
        afw.set("000", new myUtil.FloatingWindow(p5, null, "{white:Stage Cleared!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("001", new myUtil.FloatingWindow(p5, null, "{white:Game Over}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("002", new myUtil.FloatingWindow(p5, null, "{white:Out of Action Points!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("010", new myUtil.FloatingWindow(p5, null, "{white:An enemy is on this cell,}\\{white:you can't grow plant here!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("011", new myUtil.FloatingWindow(p5, null, "{white:A seed or plant is already on this cell,}\\{white:you can't grow plant here!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("012", new myUtil.FloatingWindow(p5, null, "{white:Cannot grow plant on incompatible terrain!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("020", new myUtil.FloatingWindow(p5, null, "{white:This will reset current turn. Click reset again if you are sure to proceed.}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("021", new myUtil.FloatingWindow(p5, null, "{white:This will undo last action. Click undo again if you are sure to proceed.}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("050", new myUtil.FloatingWindow(p5, null, "{white:Invalid target!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("051", new myUtil.FloatingWindow(p5, null, "{white:The plant cannot activate skill}\\{white:so many times in one turn!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("052", new myUtil.FloatingWindow(p5, null, "{white:Target is too far away!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("053", new myUtil.FloatingWindow(p5, null, "{white:You cannot heal a plant not injured!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("099", new myUtil.FloatingWindow(p5, null, "{white:You have cleared the game!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 6)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 6)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: false
        }));

        afw.set("NoSaveData", new myUtil.FloatingWindow(p5, null, "{white:No Save Data Found!}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 2)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 2)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));

        afw.set("GameSaved", new myUtil.FloatingWindow(p5, null, "{white:Game Saved.}", {
            x: myUtil.relative2absolute(1 / 2, 1 / 2)[0],
            y: myUtil.relative2absolute(1 / 2, 1 / 2)[1],
            fontSize: 20,
            padding: 10,
            spacingRatio: 0.3,
            fadingSpeed: 1,
            playerCanClick: true
        }));
    }
}

export {myUtil};

if (typeof module !== 'undefined') {
    module.exports = {myUtil};
}