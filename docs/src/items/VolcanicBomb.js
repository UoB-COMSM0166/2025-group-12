/**
 * @implements {MovableLike}
 */
class VolcanicBombModel {
    constructor(p5, superModel, itemTypes, movableTypes, i1, j1, i2, j2, x1, y1, x2, y2, countdown = 1, x = -1, y = -1) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "VolcanicBomb";
        this.img = p5.images.get(`${this.name}`);
        this.alertImg = p5.images.get("Alert");
        this.movableType = movableTypes.BOMB;

        this.i1 = i1;
        this.j1 = j1;
        this.i2 = i2;
        this.j2 = j2;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        let Y = Math.min(y1, y2);
        this.k = Y - Math.abs(y1 - y2) / 2;
        let sqrtTerm = Math.sqrt((y1 - this.k) / (y2 - this.k));
        let h1 = (x1 - sqrtTerm * x2) / (1 - sqrtTerm);
        let h2 = (x1 + sqrtTerm * x2) / (1 + sqrtTerm);
        this.h = (h1 > Math.min(x1, x2) && h1 < Math.max(x1, x2)) ? h1 : h2;
        this.a = (y1 - this.k) / ((x1 - this.h) ** 2);

        this.x = x1;
        this.y = y1;
        this.status = true;
        this.countdown = countdown;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 5;

        this.tS = VolcanicBombLogic.reparametrization(x1, y1, this);
        this.tF = VolcanicBombLogic.reparametrization(x2, y2, this);
    }

    static create(p5, superModel, playBoard, i1, j1, i2, j2, x1, y1, x2, y2, countdown = 1) {
        let bomb = new VolcanicBombModel(p5, superModel, VolcanicBombLogic.itemTypes, VolcanicBombLogic.movableTypes, i1, j1, i2, j2, x1, y1, x2, y2, countdown);
        playBoard.movables.push(bomb);
        return bomb;
    }
}

class VolcanicBombRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        VolcanicBombRenderer.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {VolcanicBombModel} bomb
     */
    static draw(p5, playBoard, bomb) {
        // parabola
        /*
        p5.stroke(2);
        p5.noFill();
        p5.beginShape();
        for (let x = 0; x < 2000; x++) {
            let y = this.getY(x);
            p5.vertex(x, y);
        }
        p5.endShape();

        // Draw points
        p5.fill(0);
        p5.ellipse(this.x1, this.y1, 10, 10);
        p5.text("S", this.x1 - 15, this.y1);

        p5.ellipse(this.x2, this.y2, 10, 10);
        p5.text("F", this.x2 + 5, this.y2);
        */
        let imgSize = Math.min(playBoard.cellWidth, playBoard.cellHeight) / 2;
        if (bomb.isMoving) {
            p5.image(bomb.img, bomb.x - imgSize / 2, bomb.y - imgSize, imgSize, imgSize);
        } else {
            p5.image(bomb.alertImg, bomb.x2 - imgSize / 2, bomb.y2 - imgSize / 2, imgSize, imgSize);
        }
    }
}

class VolcanicBombLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        VolcanicBombLogic.utilityClass = bundle.utilityClass;
        VolcanicBombLogic.baseType = bundle.baseType;
        VolcanicBombLogic.itemTypes = bundle.itemTypes;
        VolcanicBombLogic.plantTypes = bundle.plantTypes;
        VolcanicBombLogic.terrainTypes = bundle.terrainTypes;
        VolcanicBombLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        VolcanicBombLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        VolcanicBombLogic.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param playBoard
     * @param {VolcanicBombModel} bomb
     */
    static movements(p5, playBoard, bomb) {
        if (!bomb.status || bomb.hasMoved) {
            return false;
        }
        // end movement
        if (bomb.isMoving === true && VolcanicBombLogic.reached(bomb)) {
            bomb.isMoving = false;
            bomb.hasMoved = true;
            bomb.status = false;
            VolcanicBombLogic.InteractionLogic.findMovableAndDelete(playBoard, bomb);
            VolcanicBombLogic.hit(p5, playBoard, bomb);
            return false;
        }
        // during movement
        if (bomb.isMoving === true) {
            VolcanicBombLogic.move(bomb.moveSpeed, bomb);
            return true;
        }
        // before movement
        if (bomb.countdown > 0) {
            bomb.countdown--;
            bomb.hasMoved = true;
            return false;
        }
        if (bomb.countdown <= 0) {
            bomb.isMoving = true;
            VolcanicBombLogic.move(bomb.moveSpeed, bomb);
            return true;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {VolcanicBombModel} bomb
     */
    static hit(p5, playBoard, bomb) {
        let cell = VolcanicBombLogic.BoardLogic.getCell(bomb.i2, bomb.j2, playBoard.boardObjects);

        // 0: hit bandit
        if(cell.enemy && cell.enemy.movableType === VolcanicBombLogic.movableTypes.BANDIT){
            cell.enemy.health-=1;
            if(cell.enemy.health === 0) VolcanicBombLogic.InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
            return;
        }

        // 1.1. hit a cell with a tree, hit it.
        if (cell.plant !== null && VolcanicBombLogic.baseType(cell.plant) === VolcanicBombLogic.plantTypes.TREE) {
            VolcanicBombLogic.InteractionLogic.plantIsAttacked(playBoard, cell.plant, 1);
            return;
        }

        // 2.1. hit a cell with a plant (not Tree), look for a random nearby tree
        if (cell.plant !== null || cell.seed !== null) {
            let cwt = [];
            for (let c of VolcanicBombLogic.BoardLogic.getAdjacent8Cells(cell.i, cell.j, playBoard.boardObjects)) {
                if (c.plant !== null && VolcanicBombLogic.baseType(c.plant) === VolcanicBombLogic.plantTypes.TREE) {
                    cwt.push(c);
                }
            }
            // 2.2. if a tree is nearby, hit one randomly.
            if (cwt.length !== 0) {
                VolcanicBombLogic.InteractionLogic.plantIsAttacked(playBoard, cwt[Math.floor(Math.random() * cwt.length)].plant, 1);
                return;
            }
            // 2.3 no tree, hit the plant itself.
            if (cell.plant !== null) {
                VolcanicBombLogic.InteractionLogic.plantIsAttacked(playBoard, cell.plant, 1);
                return;
            }
            if (cell.seed !== null) {
                VolcanicBombLogic.InteractionLogic.plantIsAttacked(playBoard, cell.seed, 1);
                return;
            }
        }

        // 3.1 hit a cell which is playerBase:
        if (cell.terrain.terrainType === VolcanicBombLogic.terrainTypes.BASE) {
            let cwt = [];
            for (let c of VolcanicBombLogic.BoardLogic.getAdjacent8Cells(cell.i, cell.j, playBoard.boardObjects)) {
                if (c.plant !== null && VolcanicBombLogic.baseType(c.plant) === VolcanicBombLogic.plantTypes.TREE) {
                    cwt.push(c);
                }
            }
            // 3.2. if a tree is nearby, hit one randomly.
            if (cwt.length !== 0) {
                VolcanicBombLogic.InteractionLogic.plantIsAttacked(playBoard, cwt[Math.floor(Math.random() * cwt.length)].plant, 1);
                return;
            }
            // 3.3. no tree nearby, game over.
            VolcanicBombLogic.utilityClass.gameOver(playBoard);
        }

    }

    /**
     *
     * @param moveSpeed
     * @param {VolcanicBombModel} bomb
     */
    static move(moveSpeed, bomb) {
        let direction = Math.sign(bomb.x2 - bomb.x1);
        let distLeft = moveSpeed;
        while (distLeft > 0) {
            let x = bomb.x + direction;
            let y = VolcanicBombLogic.getY(x, bomb);
            let dist = Math.abs(Math.sqrt(VolcanicBombLogic.utilityClass.euclideanDistance(bomb.x, bomb.y, x, y)));
            distLeft -= dist;
            bomb.x = x;
            bomb.y = y;
        }
    }

    /**
     *
     * @param {VolcanicBombModel} bomb
     */
    static reached(bomb) {
        let parameter = VolcanicBombLogic.reparametrization(bomb.x, bomb.y, bomb);
        if (bomb.tS > bomb.tF) return parameter <= bomb.tF;
        else return parameter >= bomb.tF;
    }

    /**
     *
     * @param x
     * @param {VolcanicBombModel} bomb
     */
    static getY(x, bomb) {
        return bomb.a * (x - bomb.h) ** 2 + bomb.k;
    }

    static integrate(f, a, b) {
        let steps = 1000;
        let dx = (b - a) / steps;
        let sum = 0;

        for (let i = 1; i <= steps; i++) {
            let x1 = a + (i - 1) * dx;
            let x2 = a + i * dx;
            sum += (f(x1) + f(x2)) / 2 * dx;
        }

        return sum;
    }

    /**
     *
     * @param x
     * @param y
     * @param {VolcanicBombModel} bomb
     */
    static reparametrization(x, y, bomb) {
        if (Math.abs(y - VolcanicBombLogic.getY(x, bomb)) > 1e-6) {
            console.error("Point (x, y) is not on the parabola!");
            return null;
        }

        // Integrate from vertex h to x
        return VolcanicBombLogic.integrate(u => Math.sqrt(1 + (2 * bomb.a * (u - bomb.h)) ** 2), bomb.h, x);
    }
}

export {VolcanicBombModel, VolcanicBombLogic, VolcanicBombRenderer};

if (typeof module !== 'undefined') {
    module.exports = {VolcanicBombModel, VolcanicBombLogic, VolcanicBombRenderer};
}