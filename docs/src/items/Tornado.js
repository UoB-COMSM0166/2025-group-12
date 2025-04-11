export class Tornado extends Enemy {
    constructor(p5, x, y, direction, countdown = 0) {
        super(x, y);
        this.name = "Tornado";
        this.movableType = movableTypes.TORNADO;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        if (direction === 'u') {
            this.direction = [0, -1];
        } else if (direction === 'd') {
            this.direction = [0, 1];
        } else if (direction === 'l') {
            this.direction = [-1, 0];
        } else if (direction === 'r') {
            this.direction = [1, 0];
        } else {
            console.error(`invalid direction ${direction} of Tornado`);
            return;
        }

        this.cell = null;
        this.countdown = countdown;
        this.isMoving = false;
        this.hasMoved = true;
        this.moveSpeed = 5;

        if (this.countdown > 0) {
            this.img = p5.images.get("Alert");
        } else {
            this.img = p5.images.get(`${this.name}`);
        }
    }

    drawDirection(p5){
        let direction = this.direction;
        let x = this.x;
        let y = this.y;
        let angle;
        if (direction[0] === 0 && direction[1] === -1) {
            angle = p5.radians(330); // Up-right
        } else if (direction[0] === 0 && direction[1] === 1) {
            angle = p5.radians(150); // Down-left
        } else if (direction[0] === -1 && direction[1] === 0) {
            angle = p5.radians(210); // Up-left
        } else if (direction[0] === 1 && direction[1] === 0) {
            angle = p5.radians(30); // Down-right
        }
        let offset = 10;
        let dx = offset * Math.cos(angle);
        let dy = offset * Math.sin(angle);
        p5.push();
        p5.translate(x + dx, y + dy);
        p5.rotate(angle + p5.HALF_PI);
        p5.imageMode(p5.CENTER);
        p5.image(p5.images.get("alertArrow"), 0, 0, 30, 30);
        p5.pop();
    }

    draw(p5) {
        let imgSize = myUtil.relative2absolute(1 / 32, 0)[0];
        p5.image(this.img, this.x - imgSize / 2, this.y - imgSize, imgSize, imgSize);
    }

    static createNewTornado(p5, playBoard, i, j, direction, countdown = 0) {
        if (playBoard.boardObjects.getCell(i, j).enemy !== null) {
            return;
        }
        let [avgX, avgY] = myUtil.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);
        let tornado = new Tornado(p5, avgX, avgY, direction, countdown);
        playBoard.movables.push(tornado);
        playBoard.boardObjects.getCell(i, j).enemy = tornado;
        tornado.cell = playBoard.boardObjects.getCell(i, j);
    }

    movements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('movements of Tornado has received invalid PlayBoard.');
            return false;
        }
        if (!this.status) {
            return false;
        }
        if (this.isMoving) {
            this.moveAndInvokeTornado(p5, playBoard);
            return true;
        }
        if (this.countdown > 0) {
            this.countdown--;
            this.hasMoved = true;
            if (this.countdown <= 1) this.img = p5.images.get(`${this.name}`);
            return false;
        }
        if (this.countdown === 0) {
            if (this.cell !== null) {
                this.cell.enemy = null;
                this.cell = null;
            }
            this.isMoving = true;
            this.img = p5.images.get(`${this.name}`);
            this.moveAndInvokeTornado(p5, playBoard);
            return true;
        }
    }

    // priority and logic of Tornado interactions:
    // 1. check current cell to perform Tornado-terrain interaction.
    // 2. check extended trees' existence, and randomly pick one lucky tree.
    // 3. check current cell to attack plant or seed.
    moveAndInvokeTornado(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('moveAndInvokeTornado has received invalid PlayBoard.');
            return;
        }

        let [dx, dy] = this.direction;
        let oldX = myUtil.oldCoorX(playBoard, this.x, this.y) + this.moveSpeed * dx;
        let oldY = myUtil.oldCoorY(playBoard, this.x, this.y) + this.moveSpeed * dy;
        let newX = myUtil.newCoorX(playBoard, oldX, oldY);
        let newY = myUtil.newCoorY(playBoard, oldX, oldY);
        this.x = newX;
        this.y = newY;

        // call interaction when Tornado overlays with plant (cell level)
        let index = myUtil.pos2CellIndex(playBoard, this.x, this.y);
        if (index[0] !== -1) {
            let cell = playBoard.boardObjects.getCell(index[0], index[1]);
            // 1. check current cell to perform Tornado-terrain interaction.
            if (cell.terrain.name === "Mountain") {
                this.status = false;
                InteractionLogic.findMovableAndDelete(playBoard, this);
                return;
            }

            // 2. check extended trees' existence, and randomly pick one lucky tree.
            let cells = playBoard.boardObjects.getAdjacent4Cells(index[0], index[1]);
            let trees = [];
            for (let adCell of cells) {
                if (adCell !== null && adCell.plant !== null && adCell.plant.name === "Tree") {
                    if (adCell.plant.hasExtended === true && adCell.plant.status === true) {
                        trees.push(adCell.plant);
                    }
                }
            }
            if (trees.length > 0) {
                let luckyTree = trees[Math.floor(Math.random() * trees.length)];
                InteractionLogic.plantAttackedByTornado(playBoard, luckyTree, this);
                return;
            }

            // 3. check current cell to attack plant or seed.
            if (this.status === true) {
                if (cell.plant !== null && cell.plant.status === true) {
                    InteractionLogic.plantAttackedByTornado(playBoard, cell.plant, this);
                } else if (cell.seed !== null) {
                    InteractionLogic.plantAttackedByTornado(playBoard, cell.seed, this);
                }
            }

            // 4. if player base is at this cell, destroy it.
            if (cell.terrain.terrainType === terrainTypes.BASE) {
                myUtil.gameOver(playBoard);
                return;
            }

            // 5. if a bandit is at this cell, dies.
            if (cell.enemy && cell.enemy.name === "Bandit") {
                cell.enemy.health = 0;
                cell.enemy.status = false;
                InteractionLogic.findMovableAndDelete(playBoard, cell.enemy);
                cell.enemy = null;
            }

        }

        // if the tornado goes out of the grid, it dies anyway.
        if (index[0] === -1) {
            this.status = false;
            InteractionLogic.findMovableAndDelete(playBoard, this);
        }
    }

    stringify() {
        let d;
        if (this.direction[0] === 0 && this.direction[1] === -1) d = 'u';
        if (this.direction[0] === 0 && this.direction[1] === 1) d = 'd';
        if (this.direction[0] === -1 && this.direction[1] === 0) d = 'l';
        if (this.direction[0] === 1 && this.direction[1] === 0) d = 'r';

        const object = {
            movableType: this.movableType,
            x: this.x,
            y: this.y,
            health: this.health,
            direction: d,
            cellX: this.cell?.x,
            cellY: this.cell?.y,
            countdown: this.countdown,
        }
        return JSON.stringify(object);
    }

    static parse(json, p5, playBoard) {
        const object = JSON.parse(json);
        let tornado = new Tornado(p5, object.x, object.y, object.direction, object.countdown);

        if (object.cellX != null && object.cellY != null) { // != null checks both null and undefined
            tornado.cell = playBoard.boardObjects.getCell(object.cellX, object.cellY);
        }
        tornado.health = object.health;
        return tornado;
    }
}