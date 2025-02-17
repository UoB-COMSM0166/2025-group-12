import {CanvasSize} from "../src/CanvasSize.js"

export class myutil {
    static mod2PiPositive(x) {
        return (((x % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) / Math.PI;
    }

    static relative2absolute(xPercent, yPercent) {

        if (xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1) {
            console.log(`input of relative2absolute (${xPercent}, ${yPercent}) are not percentages.`);
            return [-1];
        }

        return [xPercent * CanvasSize.getSize()[0], yPercent * CanvasSize.getSize()[1]];
    }

    static absolute2Relative(xAbsolute, yAbsolute) {

        if (xAbsolute < 0 || xAbsolute > CanvasSize.getSize()[0] || yAbsolute < 0 || yAbsolute > CanvasSize.getSize()[1]) {
            console.log(`input of absolute2Relative (${xAbsolute}, ${yAbsolute}) is not valid position.`);
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
}