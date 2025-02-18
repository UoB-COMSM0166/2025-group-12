import {Enemy} from "./Enemy.js";
import {PlayBoard} from "../model/Play.js";
import {myutil} from "../../lib/myutil.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {DijkstraSP, EdgeWeightedDigraph, DirectedEdge} from "../controller/GraphSP.js";

export class Bandit extends Enemy {
    constructor(p5, x, y) {
        super(x, y);
        this.name = "Bandit";
        this.img = p5.images.get(`${this.name}`);

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;
        this.cell = null;

        // at the beginning of end turn movement, isMoving = false, targetCell = null
        // during movement, isMoving = true, targetCell != null
        // at the end of movement, isMoving = true, targetCell = null
        this.targetCell = null;
        this.isMoving = false;
        this.hasMoved = false;
        this.direction = [];
    }

    static createNewBandit(p5, playBoard, i, j) {
        let [avgX, avgY] = playBoard.CellIndex2Pos(p5, i, j, p5.CENTER);
        let bandit = new Bandit(p5, avgX, avgY);
        playBoard.enemies.push(bandit);
        playBoard.boardObjects.getCell(i, j).enemy = bandit;
        bandit.cell = playBoard.boardObjects.getCell(i, j);
    }

    enemyMovements(p5, playBoard) {
        if (!(playBoard instanceof PlayBoard)) {
            console.error('enemyMovements of Storm has received invalid PlayBoard.');
            return false;
        }
        if (this.status === false || this.hasMoved) {
            return false;
        }

        // end movement
        if (this.isMoving === true && this.targetCell === null) {
            this.isMoving = false;
            this.hasMoved = true;
            this.direction = [];
            return false;
        }
        // during movement
        if (this.isMoving === true && this.targetCell !== null) {
            this.move(p5, playBoard);
            return true;
        }
        // before movement
        if (this.isMoving === false && this.targetCell === null) {
            this.setTarget(playBoard);
            // if setting target fails, the bandit holds.
            if (this.targetCell === null) {
                this.hasMoved = true;
                return false;
            }

            if (this.cell) {
                this.cell.enemy = null;
                this.cell = null;
            }
            this.isMoving = true;
            this.move(p5, playBoard);
            return true;
        }
    }

    move(p5, playBoard) {
        let [dy, dx] = this.direction;
        let oldX = playBoard.oldCoorX(this.x, this.y) + 5 * dx;
        let oldY = playBoard.oldCoorY(this.x, this.y) + 5 * dy;
        let newX = playBoard.newCoorX(oldX, oldY);
        let newY = playBoard.newCoorY(oldX, oldY);
        this.x = newX;
        this.y = newY;

        let [targetX, targetY] = playBoard.CellIndex2Pos(p5, this.targetCell.x, this.targetCell.y, p5.CENTER);

        // when arriving at target, set this.cell to target cell, and set targetCell -> null
        if (myutil.manhattanDistance(this.x, this.y, targetX, targetY) < 2) {
            this.x = targetX;
            this.y = targetY;
            this.cell = this.targetCell;
            this.cell.enemy = this;
            this.targetCell = null;
        }

    }

    setTarget(playBoard) {
        // get all living plants and seeds
        let cellsWithPlant = playBoard.boardObjects.getAllCellsWithPlant();
        let cellsWithSeed = playBoard.boardObjects.getAllCellsWithSeed();
        let allTargets = [...cellsWithPlant, ...cellsWithSeed];

        if (allTargets.length === 0) {
            return null;
        }

        // create graph and pick a target according to playground status
        let G = this.graph(playBoard);
        let path = this.pickLuckyPlant(playBoard, G, allTargets);
        if (path === null || path.length === 0) {
            return;
        }

        // don't go along one direction then switch to another. move zigzag
        let targetPlantCell = playBoard.boardObjects.getCell(path[path.length - 1].to() % playBoard.gridSize, Math.floor(path[path.length - 1].to() / playBoard.gridSize));
        let nextEdge = path[0];
        let nextCell = playBoard.boardObjects.getCell(nextEdge.to() % playBoard.gridSize, Math.floor(nextEdge.to() / playBoard.gridSize));
        let altCellIndex = myutil.findAlternativeCell(this.cell.x, this.cell.y, targetPlantCell.x, targetPlantCell.y, nextCell.x, nextCell.y);
        if (altCellIndex !== null) {
            let dist = myutil.euclideanDistance(nextCell.x, nextCell.y, targetPlantCell.x, targetPlantCell.y);
            let altDist = myutil.euclideanDistance(altCellIndex[0], altCellIndex[1], targetPlantCell.x, targetPlantCell.y);
            if (dist > altDist &&
                G.adj[this.cell.x + this.cell.y * playBoard.gridSize].find(edge => edge.to() === nextCell.x + nextCell.y * playBoard.gridSize).weight >=
                G.adj[this.cell.x + this.cell.y * playBoard.gridSize].find(edge => edge.to() === altCellIndex[0] + altCellIndex[1] * playBoard.gridSize).weight
            ) {
                nextCell = playBoard.boardObjects.getCell(altCellIndex[0], altCellIndex[1]);
            }
        }

        // If adjacent to the target plant, attack instead of moving
        if (path.length === 1) {
            plantEnemyInteractions.plantIsAttacked(playBoard, nextCell.plant !== null ? nextCell.plant : nextCell.seed, 1);
            this.hasMoved = true;
            return;
        }

        this.targetCell = nextCell;
        this.direction = [this.targetCell.x - this.cell.x, this.targetCell.y - this.cell.y];
    }

    pickLuckyPlant(playBoard, G, allTargets) {
        // pick the one with the lowest path weight
        let dijkstraSP = new DijkstraSP(G, this.cell.x + this.cell.y * playBoard.gridSize)
        let minWeight = dijkstraSP.minWeightTo(allTargets[0].x + allTargets[0].y * playBoard.gridSize);
        let index = 0;
        for (let i = 0; i < allTargets.length; i++) {
            let vertex = allTargets[i].x + allTargets[i].y * playBoard.gridSize;
            if (dijkstraSP.minWeightTo(vertex) < minWeight) {
                index = i;
            }
        }

        // if min weight is too high, hold still.
        // --- any weight higher than 100 will be marked inaccessible.
        if (minWeight > 100) {
            return null;
        }

        // return the whole path
        return dijkstraSP.pathTo(allTargets[index].x + allTargets[index].y * playBoard.gridSize);

        // refactor later: use union-find to check if pq.poll() is accessible.
        // if all plants in the priority queue is inaccessible, return null.
    }

    graph(playBoard) {
        let N = playBoard.gridSize;
        let G = new EdgeWeightedDigraph(N * N);

        // set weight according to terrain.
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (i + 1 < N) {
                    G.addEdge(new DirectedEdge(i + j * N, (i + 1) + j * N, 1 + playBoard.boardObjects.getCell(i + 1, j).terrain.getWeight()));
                }
                if (j + 1 < N) {
                    G.addEdge(new DirectedEdge(i + j * N, i + (j + 1) * N, 1 + playBoard.boardObjects.getCell(i, j + 1).terrain.getWeight()));
                }
                if (i - 1 >= 0) {
                    G.addEdge(new DirectedEdge(i + j * N, (i - 1) + j * N, 1 + playBoard.boardObjects.getCell(i - 1, j).terrain.getWeight()));
                }
                if (j - 1 >= 0) {
                    G.addEdge(new DirectedEdge(i + j * N, i + (j - 1) * N, 1 + playBoard.boardObjects.getCell(i, j - 1).terrain.getWeight()));
                }
            }
        }

        // set weight to avoid storm.
        let cellsWithEnemy = playBoard.boardObjects.getAllCellsWithEnemy();
        for (let cwe of cellsWithEnemy) {
            let x = cwe.x;
            let y = cwe.y;
            if (cwe.enemy && cwe.enemy.name === "Storm") {
                for (let i = 0; i < playBoard.gridSize; i++) {
                    G.setWeight(i + y * playBoard.gridSize, i + 1 + y * playBoard.gridSize, 10, 'a');
                }
                for (let j = 0; j < playBoard.gridSize; j++) {
                    G.setWeight(x + j * playBoard.gridSize, x + (j + 1) * playBoard.gridSize, 10, 'a');
                }
            }
            // set edges connecting cells with other enemies high enough to avoid clash
            if (x !== this.cell.x || y !== this.cell.y) {
                G.setWeight(x + y * playBoard.gridSize, (x - 1) + y * playBoard.gridSize, 1000, "ab");
                G.setWeight(x + y * playBoard.gridSize, (x + 1) + y * playBoard.gridSize, 1000, "ab");
                G.setWeight(x + y * playBoard.gridSize, x + (y - 1) * playBoard.gridSize, 1000, "ab");
                G.setWeight(x + y * playBoard.gridSize, x + (y + 1) * playBoard.gridSize, 1000, "ab");
            }
        }

        return G;
    }

}