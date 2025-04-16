/**
 * @implements {MovableLike}
 */
class BanditModel {
    constructor(p5, superModel, itemTypes, movableTypes, x, y) {
        Object.assign(this, new superModel(itemTypes, x, y));
        this.name = "Bandit";
        this.img = p5.images.get(`${this.name}`);

        this.movableType = movableTypes.BANDIT;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // at the beginning of end turn movement, isMoving = false, targetCell = null
        // during movement, isMoving = true, targetCell != null
        // at the end of movement, isMoving = true, targetCell = null
        /** @type {CellModel} */
        this.cell = null;
        /** @type {CellModel} */
        this.targetCell = null;
        this.isMoving = false;
        this.hasMoved = true;
        this.direction = [];
        this.moveSpeed = 5;
    }

    static create(p5, playBoard, superModel, i, j) {
        let cell = BanditLogic.BoardLogic.getCell(i, j, playBoard.boardObjects);
        if (cell.enemy !== null) {
            return cell.enemy;
        }
        let [avgX, avgY] = BanditLogic.utilityClass.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);
        let bandit = new BanditModel(p5, superModel, BanditLogic.itemTypes, BanditLogic.movableTypes, avgX, avgY);
        playBoard.movables.push(bandit);
        cell.enemy = bandit;
        bandit.cell = cell;
        return bandit;
    }
}

class BanditRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        BanditRenderer.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param p5
     * @param {BanditModel} bandit
     */
    static draw(p5, bandit) {
        let imgSize = BanditRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
        p5.image(bandit.img, bandit.x - imgSize / 2, bandit.y - imgSize, imgSize, imgSize);
    }
}

class BanditLogic {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        BanditLogic.utilityClass = bundle.utilityClass;
        /** @type {typeof DijkstraSP} */
        BanditLogic.DijkstraSP = bundle.DijkstraSP;
        /** @type {typeof EdgeWeightedDigraph} */
        BanditLogic.EdgeWeightedDigraph = bundle.EdgeWeightedDigraph;
        /** @type {typeof DirectedEdge} */
        BanditLogic.DirectedEdge = bundle.DirectedEdge;
        BanditLogic.baseType = bundle.baseType;
        BanditLogic.itemTypes = bundle.itemTypes;
        BanditLogic.plantTypes = bundle.plantTypes;
        BanditLogic.terrainTypes = bundle.terrainTypes;
        BanditLogic.movableTypes = bundle.movableTypes;

        /** @type {typeof BoardLogic} */
        BanditLogic.BoardLogic = bundle.BoardLogic;
        /** @type {typeof InteractionLogic} */
        BanditLogic.InteractionLogic = bundle.InteractionLogic;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BanditModel} bandit
     */
    static movements(p5, playBoard, bandit) {
        if (!bandit.status || bandit.hasMoved) {
            return false;
        }

        // end movement
        if (bandit.isMoving === true && bandit.targetCell === null) {
            bandit.isMoving = false;
            bandit.hasMoved = true;
            bandit.direction = [];
            return false;
        }
        // during movement
        if (bandit.isMoving === true && bandit.targetCell !== null) {
            BanditLogic.move(p5, playBoard, bandit);
            return true;
        }
        // before movement
        if (bandit.isMoving === false && bandit.targetCell === null) {
            BanditLogic.setTarget(playBoard, bandit);
            // if setting target fails, the bandit holds.
            if (bandit.targetCell === null) {
                bandit.hasMoved = true;
                return false;
            }

            if (bandit.cell) {
                bandit.cell.enemy = null;
                bandit.cell = null;
            }
            bandit.isMoving = true;
            BanditLogic.move(p5, playBoard, bandit);
            return true;
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BanditModel} bandit
     */
    static move(p5, playBoard, bandit) {
        let [dx, dy] = bandit.direction;
        let oldX = BanditLogic.utilityClass.oldCoorX(playBoard, bandit.x, bandit.y) + bandit.moveSpeed * dx;
        let oldY = BanditLogic.utilityClass.oldCoorY(playBoard, bandit.x, bandit.y) + bandit.moveSpeed * dy;
        let newX = BanditLogic.utilityClass.newCoorX(playBoard, oldX, oldY);
        let newY = BanditLogic.utilityClass.newCoorY(playBoard, oldX, oldY);
        bandit.x = newX;
        bandit.y = newY;

        let [targetX, targetY] = BanditLogic.utilityClass.cellIndex2Pos(p5, playBoard, bandit.targetCell.i, bandit.targetCell.j, p5.CENTER);

        // when arriving at target, set bandit.cell to target cell, and set targetCell -> null
        if (BanditLogic.utilityClass.manhattanDistance(bandit.x, bandit.y, targetX, targetY) < 2) {
            bandit.x = targetX;
            bandit.y = targetY;
            bandit.cell = bandit.targetCell;
            bandit.cell.enemy = bandit;
            bandit.targetCell = null;
        }

    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {BanditModel} bandit
     */
    static setTarget(playBoard, bandit) {
        // if the bandit is at the same cell with a plant, it first tries to leave.
        if (bandit.cell.plant !== null) {
            let G = BanditLogic.graph(playBoard, bandit);
            let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            let possibleDirections = [];
            for (let [dx, dy] of directions) {
                // skip out-of-bound
                if (bandit.cell.i + dx < 0 || bandit.cell.i + dx >= playBoard.gridSize || bandit.cell.j + dy < 0 || bandit.cell.j + dy >= playBoard.gridSize) {
                    continue;
                }
                // the target cell must not be occupied by another enemy or plant already
                if (G.edges().find(e => {
                        return e.from() === bandit.cell.i + bandit.cell.j * playBoard.gridSize
                            && e.to() === (bandit.cell.i + dx) + (bandit.cell.j + dy) * playBoard.gridSize
                    }).weight < 100 && BanditLogic.BoardLogic.getCell(bandit.cell.i + dx, bandit.cell.j + dy, playBoard.boardObjects).plant === null
                    && BanditLogic.BoardLogic.getCell(bandit.cell.i + dx, bandit.cell.j + dy, playBoard.boardObjects).seed === null) {
                    possibleDirections.push([dx, dy]);
                }
            }
            if (possibleDirections.length > 0) {
                let index = Math.floor(Math.random() * possibleDirections.length);
                bandit.targetCell = BanditLogic.BoardLogic.getCell(bandit.cell.i + possibleDirections[index][0], bandit.cell.j + possibleDirections[index][1], playBoard.boardObjects);
                bandit.direction = [bandit.targetCell.j - bandit.cell.j, bandit.targetCell.i - bandit.cell.i];
                return;
            }
            // if no way out, the bandit dies of forest insects and animal attacks.
            // they may deserve a better ending? refactor
            bandit.status = false;
            BanditLogic.InteractionLogic.findMovableAndDelete(playBoard, bandit);
            return;
        }

        // get all living plants and seeds
        let cellsWithPlant = BanditLogic.BoardLogic.getAllCellsWithPlant(playBoard.boardObjects);
        let cellsWithSeed = BanditLogic.BoardLogic.getAllCellsWithSeed(playBoard.boardObjects);
        let allTargets = [...cellsWithPlant, ...cellsWithSeed];

        if (allTargets.length === 0) {
            return;
        }

        // create graph and pick a target according to playground status
        let G = BanditLogic.graph(playBoard, bandit);
        let path = BanditLogic.pickLuckyPlant(playBoard, G, allTargets, bandit);
        if (path === null || path.length === 0) {
            return;
        }

        // don't go along one direction then switch to another. move zigzag
        let targetPlantCell = BanditLogic.BoardLogic.getCell(path[path.length - 1].to() % playBoard.gridSize, Math.floor(path[path.length - 1].to() / playBoard.gridSize), playBoard.boardObjects);
        let nextEdge = path[0];
        let nextCell = BanditLogic.BoardLogic.getCell(nextEdge.to() % playBoard.gridSize, Math.floor(nextEdge.to() / playBoard.gridSize), playBoard.boardObjects);
        let altCellIndex = BanditLogic.utilityClass.findAlternativeCell(bandit.cell.i, bandit.cell.j, targetPlantCell.i, targetPlantCell.j, nextCell.i, nextCell.j);
        if (altCellIndex !== null) {
            let dist = BanditLogic.utilityClass.euclideanDistance(nextCell.i, nextCell.j, targetPlantCell.i, targetPlantCell.j);
            let altDist = BanditLogic.utilityClass.euclideanDistance(altCellIndex[0], altCellIndex[1], targetPlantCell.i, targetPlantCell.j);
            if (dist > altDist &&
                G.adj[bandit.cell.i + bandit.cell.j * playBoard.gridSize].find(edge => edge.to() === nextCell.i + nextCell.j * playBoard.gridSize).weight >=
                G.adj[bandit.cell.i + bandit.cell.j * playBoard.gridSize].find(edge => edge.to() === altCellIndex[0] + altCellIndex[1] * playBoard.gridSize).weight
            ) {
                nextCell = BanditLogic.BoardLogic.getCell(altCellIndex[0], altCellIndex[1], playBoard.boardObjects);
            }
        }

        // If adjacent to the target plant, attack instead of moving
        if (path.length === 1) {
            BanditLogic.InteractionLogic.plantIsAttacked(playBoard, nextCell.plant !== null ? nextCell.plant : nextCell.seed, 1);
            bandit.hasMoved = true;
            return;
        }

        bandit.targetCell = nextCell;
        bandit.direction = [bandit.targetCell.j - bandit.cell.j, bandit.targetCell.i - bandit.cell.i]; // the row and col is reversed to fit the board's matrix-like cell positioning
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param G
     * @param {Array<CellModel>} allTargets
     * @param {BanditModel} bandit
     */
    static pickLuckyPlant(playBoard, G, allTargets, bandit) {
        // pick the one with the lowest path weight
        let dijkstraSP = new BanditLogic.DijkstraSP(G, bandit.cell.i + bandit.cell.j * playBoard.gridSize)
        let minWeight = dijkstraSP.minWeightTo(allTargets[0].i + allTargets[0].j * playBoard.gridSize);
        let index = 0;
        for (let i = 0; i < allTargets.length; i++) {
            let vertex = allTargets[i].i + allTargets[i].j * playBoard.gridSize;
            if (dijkstraSP.minWeightTo(vertex) < minWeight) {
                index = i;
            }
        }

        let path = dijkstraSP.pathTo(allTargets[index].i + allTargets[index].j * playBoard.gridSize);

        // if min weight is too high, hold still.
        // --- any weight higher than 100 will be marked inaccessible.
        if (minWeight >= 100) {
            // the bandit can keep moving as long as next step is accessible
            if (path.length === 0 || path[0].weight >= 100) {
                return null;
            }
        }

        // return the whole path
        return path;

        // refactor later: use union-find to check if pq.poll() is accessible.
        // if all plants in the priority queue is inaccessible, return null.
    }

    /**
     *
     * @param {PlayBoardLike} playBoard
     * @param {BanditModel} bandit
     */
    static graph(playBoard, bandit) {
        let N = playBoard.gridSize;
        let G = new BanditLogic.EdgeWeightedDigraph(N * N);

        // set weight according to terrain.
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (i + 1 < N) {
                    G.addEdge(new BanditLogic.DirectedEdge(i + j * N, (i + 1) + j * N, 1 + BanditLogic.BoardLogic.getCell(i + 1, j, playBoard.boardObjects).terrain.getWeight()));
                }
                if (j + 1 < N) {
                    G.addEdge(new BanditLogic.DirectedEdge(i + j * N, i + (j + 1) * N, 1 + BanditLogic.BoardLogic.getCell(i, j + 1, playBoard.boardObjects).terrain.getWeight()));
                }
                if (i - 1 >= 0) {
                    G.addEdge(new BanditLogic.DirectedEdge(i + j * N, (i - 1) + j * N, 1 + BanditLogic.BoardLogic.getCell(i - 1, j, playBoard.boardObjects).terrain.getWeight()));
                }
                if (j - 1 >= 0) {
                    G.addEdge(new BanditLogic.DirectedEdge(i + j * N, i + (j - 1) * N, 1 + BanditLogic.BoardLogic.getCell(i, j - 1, playBoard.boardObjects).terrain.getWeight()));
                }
            }
        }

        // set weight to avoid tornado.
        let cellsWithEnemy = BanditLogic.BoardLogic.getAllCellsWithEnemy(playBoard.boardObjects);
        for (let cwe of cellsWithEnemy) {
            let x = cwe.i;
            let y = cwe.j;

            if (cwe.enemy && cwe.enemy.movableType === BanditLogic.movableTypes.TORNADO) {
                for (let i = 0; i < N - 1; i++) {
                    G.setWeightIfHasEdge(i + y * N, (i + 1) + y * N, 10, 'a');
                }
                for (let j = 0; j < N - 1; j++) {
                    G.setWeightIfHasEdge(x + j * N, x + (j + 1) * N, 10, 'a');
                }
            }

            // Avoid enemy clashes
            if (x !== bandit.cell.i || y !== bandit.cell.j) {
                let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dx, dy] of directions) {
                    if (x + dx >= 0 && x + dx < N && y + dy >= 0 && y + dy < N) {
                        G.setWeightIfHasEdge(x + y * N, x + dx + (y + dy) * N, 1000, "ab");
                    }
                }
            }
        }

        return G;
    }

}

export {BanditModel, BanditLogic, BanditRenderer};

if (typeof module !== 'undefined') {
    module.exports = {BanditModel, BanditLogic, BanditRenderer};
}