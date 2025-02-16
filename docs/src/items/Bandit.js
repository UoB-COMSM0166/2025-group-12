import {Enemy} from "./Enemy.js";
import {UnionFind} from "../controller/UnionFind.js";
import {PriorityQueue} from "../controller/PriorityQueue.js";
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

    enemyMovements(p5, playBoard){
        if (!(playBoard instanceof PlayBoard)) {
            console.error('enemyMovements of Storm has received invalid PlayBoard.');
            return false;
        }
        if (this.status === false || this.hasMoved) {
            return false;
        }

        // end movement
        if (this.isMoving === true && this.targetCell === null){
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
            if(this.targetCell === null) {
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
        if(myutil.manhattanDistance(this.x, this.y, targetX, targetY) < 2){
            this.x = targetX;
            this.y = targetY;
            this.cell = this.targetCell;
            this.targetCell = null;
        }

    }

    setTarget(playBoard){
        let targetCell = this.pickLuckyPlant(playBoard);
        if(targetCell === null){
            return;
        }

        // if this and target plant is adjacent, do not move but attack
        if(myutil.manhattanDistance(this.cell.x, this.cell.y, targetCell.x, targetCell.y) <= 1){
            plantEnemyInteractions.plantIsAttacked(playBoard, targetCell.plant!==null?targetCell.plant:targetCell.seed, 1);
            this.hasMoved = true;
            return;
        }

        // a simplified plan without graph:
        let weights = [1,1,1,1,1] // up, right, down, left, center
        let directions = [[0, -1], [1, 0], [0, 1], [-1, 0], [0, 0]];

        // check storm
        let cellWithEnemy = playBoard.boardObjects.getAllCellsWithEnemy();
        for (let enemy of cellWithEnemy) {
            if(enemy.name === "storm"){
                for (let i = 0; i < directions.length; i++) {
                    let [dx, dy] = directions[i];
                    let x = this.cell.x + dx;
                    let y = this.cell.y + dy;
                    if(x === enemy.cell.x || y === enemy.cell.y){
                        weights[i] += 10;
                    }
                }
            }
        }

        for (let i = 0; i < directions.length; i++) {
            let [dx, dy] = directions[i];
            let x = this.cell.x + dx;
            let y = this.cell.y + dy;
            // check inaccessible terrain
            let cell = playBoard.boardObjects.getCell(x, y);
            if (cell) {
                weights[i] += cell.terrain.getWeight();
            } else {
                weights[i] += 100000; // Penalize out-of-bounds moves heavily
            }

            // Manhattan Distance Adjustment
            let currentManhattan = myutil.manhattanDistance(this.cell.x, this.cell.y, targetCell.x, targetCell.y);
            let newManhattan = myutil.manhattanDistance(x, y, targetCell.x, targetCell.y);
            weights[i] += (newManhattan - currentManhattan) * 3; // Weighted scaling

            // Euclidean Distance Adjustment
            let currentEuclidean = myutil.euclideanDistance(this.cell.x, this.cell.y, targetCell.x, targetCell.y);
            let newEuclidean = myutil.euclideanDistance(x, y, targetCell.x, targetCell.y);
            weights[i] += (newEuclidean - currentEuclidean) * 2; // Proportional adjustment
        }

        let min = weights[0];
        this.direction = directions[0];
        for (let i = 0; i < weights.length; i++) {
            if(min > weights[i]){
                min = weights[i];
                this.direction = directions[i];
            }
        }
        this.targetCell = playBoard.boardObjects.getCell(this.cell.x + this.direction[0], this.cell.y + this.direction[1]);
        console.log(`${this.targetCell.x}, ${this.targetCell.y}`)
        this.direction = [this.targetCell.x - this.cell.x, this.targetCell.y - this.cell.y];
    }

    pickLuckyPlant(playBoard){
        // actually we pick the closest one
        let cellsWithPlant = playBoard.boardObjects.getAllCellsWithPlant();
        let cellsWithSeed = playBoard.boardObjects.getAllCellsWithSeed();
        if(cellsWithPlant.length === 0 && cellsWithSeed.length === 0){
            return null;
        }
        let pq = new PriorityQueue((cell1, cell2) =>
            myutil.euclideanDistance(this.cell.x, this.cell.y, cell1.x, cell1.y) -
            myutil.euclideanDistance(this.cell.x, this.cell.y, cell2.x, cell2.y)
        );
        for (let cwp of cellsWithPlant) {
            pq.insert(cwp);
        }
        for (let cws of cellsWithSeed) {
            pq.insert(cws);
        }
        return pq.poll();
        // refactor later: use union-find to check if pq.poll() is accessible.
        // if all plants in the priority queue is inaccessible, return null.
    }

    /*
    graph(playBoard) {
        let N = playBoard.gridSize;
        let G = new EdgeWeightedGraph(N * N);

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (i + 1 < N) {
                    G.addEdge(new Edge(i + j * N, (i + 1) + j * N, 1 + playBoard.getCell(i+1, j).terrain.getWeight()));
                }
                if (j + 1 < N) {
                    G.addEdge(new Edge(i + j * N, i + (j + 1) * N, 1 + playBoard.getCell(i, j+1).terrain.getWeight()));
                }
                if (i - 1 >= 0) {
                    G.addEdge(new Edge(i + j * N, (i - 1) + j * N, 1 + playBoard.getCell(i-1, j).terrain.getWeight()));
                }
                if (j - 1 >= 0) {
                    G.addEdge(new Edge(i + j * N, i + (j - 1) * N, 1 + playBoard.getCell(i, j-1).terrain.getWeight()));
                }
            }
        }
        return G;
    }
     */

}

export class KruskalMST{
    constructor(Graph) {
        this.mst = [];
        this.pq = new PriorityQueue((edge1, edge2) => edge2.weight - edge1.weight);
        for(let edge of Graph.edges()){
            this.pq.insert(edge);
        }
        this.uf = new UnionFind(Graph.V);

        while(!this.pq.isEmpty() && this.mst.length < Graph.V - 1){
            let edge = this.pq.poll();
            let v = edge.either();
            let w = edge.other(v);
            if(this.uf.connected(v, w)) continue;
            this.uf.union(v, w);
            this.mst.push(edge);
        }
    }

    edges(){
        return this.mst;
    }
}

export class EdgeWeightedGraph{
    constructor(V) {
        this.V = V;
        this.E = 0;
        this.adj = [];
    }

    addEdge(e){
        let v = e.either();
        let w = e.other(v);
        if (this.adj[v] === undefined) this.adj[v] = [];
        if (this.adj[w] === undefined) this.adj[w] = [];
        this.adj[v].push(e);
        this.adj[w].push(e);
        this.E++;
    }

    edges(){
        let edges = [];
        for(let v = 0; v < this.V; v++){
            for (let edge of this.adj[v]) {
                if(edge.other(v) > v){
                    edges.push(edge);
                }
            }
        }
        return edges;
    }
}

export class Edge{
    constructor(v, w, weight) {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }

    either(){
        return this.v;
    }

    other(vertex){
        if(vertex === this.v){
            return this.w;
        }else if(vertex === this.w){
            return this.v;
        }
        return null;
    }

    compareTo(that){
        if(this.weight < that.weight){
            return -1;
        }else if(this.weight > that.weight){
            return 1;
        }else{
            return 0;
        }
    }
}