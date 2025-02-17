import {Enemy} from "./Enemy.js";
import {UnionFind} from "../controller/UnionFind.js";
import {IndexPriorityQueue, PriorityQueue} from "../controller/PriorityQueue.js";
import {PlayBoard} from "../model/Play.js";
import {myutil} from "../../lib/myutil.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";

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
        let path = this.pickLuckyPlant(playBoard);
        if (path === null || path.length === 0) {
            return;
        }

        let nextEdge = path[0];
        let nextCell = playBoard.boardObjects.getCell(nextEdge.to() % playBoard.gridSize, Math.floor(nextEdge.to() / playBoard.gridSize));

        // if this and target plant is adjacent, do not move but attack
        if (path.length === 1) {
            plantEnemyInteractions.plantIsAttacked(playBoard, nextCell.plant !== null ? nextCell.plant : nextCell.seed, 1);
            this.hasMoved = true;
            return;
        }

        this.targetCell = nextCell;
        this.direction = [this.targetCell.x - this.cell.x, this.targetCell.y - this.cell.y];
    }

    pickLuckyPlant(playBoard) {
        let cellsWithPlant = playBoard.boardObjects.getAllCellsWithPlant();
        let cellsWithSeed = playBoard.boardObjects.getAllCellsWithSeed();
        let allTargets = [...cellsWithPlant, ...cellsWithSeed];

        if (allTargets.length === 0) {
            return null;
        }

        // pick the one with the lowest path weight
        let dijkstraSP = new DijkstraSP(this.graph(playBoard), this.cell.x + this.cell.y * playBoard.gridSize)
        let minWeight = dijkstraSP.minWeightTo(allTargets[0].x + allTargets[0].y * playBoard.gridSize);
        let index = 0;
        for (let i = 0; i < allTargets.length; i++) {
            let vertex = allTargets[i].x + allTargets[i].y * playBoard.gridSize;
            if (dijkstraSP.minWeightTo(vertex) < minWeight) {
                index = i;
            }
        }

        // return the whole path
        return dijkstraSP.pathTo(allTargets[index].x + allTargets[index].y * playBoard.gridSize);

        // refactor later: use union-find to check if pq.poll() is accessible.
        // if all plants in the priority queue is inaccessible, return null.
    }

    graph(playBoard) {
        let N = playBoard.gridSize;
        let G = new EdgeWeightedDigraph(N * N);

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
        return G;
    }

}

export class DijkstraSP {
    constructor(digraph, start) {
        this.G = digraph;
        this.distTo = new Array(this.G.V);
        this.edgeTo = new Array(this.G.V);
        this.pq = new IndexPriorityQueue((weight1, weight2) => weight1 - weight2);
        for (let v = 0; v < this.G.V; v++) {
            this.distTo[v] = Number.POSITIVE_INFINITY;
        }
        this.distTo[start] = 0;
        this.pq.insert(start, 0);
        while (!this.pq.isEmpty()) {
            let v = this.pq.pollIndex();
            if (v === null) {
                break;
            }
            this.relax(v);
        }
    }

    relax(v) {
        for (let edge of this.G.adj[v]) {
            let w = edge.to();
            if (this.distTo[w] > this.distTo[v] + edge.weight) {
                this.distTo[w] = this.distTo[v] + edge.weight;
                this.edgeTo[w] = edge;
                if (this.pq.contains(w)) {
                    this.pq.change(w, this.distTo[w]);
                } else {
                    this.pq.insert(w, this.distTo[w]);
                }
            }
        }
    }

    hasPathTo(v) {
        return this.distTo[v] < Number.POSITIVE_INFINITY;
    }

    pathTo(v) {
        if (!this.hasPathTo(v)) {
            return null;
        }
        let path = [];
        for (let edge = this.edgeTo[v]; edge != null; edge = this.edgeTo[edge.from()]) {
            path.push(edge);
        }
        return path.reverse();
    }

    minWeightTo(v) {
        let path = this.pathTo(v);
        if (!path) {
            return Number.POSITIVE_INFINITY;
        }
        return path.reduce((sum, edge) => sum + edge.weight, 0);
    }

}

export class EdgeWeightedDigraph {
    constructor(V) {
        this.V = V;
        this.E = 0;
        this.adj = Array.from({length: V}, () => []);
    }

    addEdge(e) {
        let v = e.from();
        //if (this.adj[v] === undefined) this.adj[v] = [];
        this.adj[v].push(e);
        this.E++;
    }

    edges() {
        let edges = [];
        for (let v = 0; v < this.V; v++) {
            for (let edge of this.adj[v]) {
                edges.push(edge);
            }
        }
        return edges;
    }
}

export class DirectedEdge {
    constructor(v, w, weight) {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }

    from() {
        return this.v;
    }

    to() {
        return this.w;
    }

    compareTo(that) {
        if (this.weight < that.weight) {
            return -1;
        } else if (this.weight > that.weight) {
            return 1;
        } else {
            return 0;
        }
    }
}