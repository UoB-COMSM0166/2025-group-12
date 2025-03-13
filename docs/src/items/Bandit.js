import {Enemy} from "./Enemy.js";
import {PlayBoard} from "../model/Play.js";
import {myutil} from "../../lib/myutil.js";
import {plantEnemyInteractions} from "./PlantEnemyInter.js";
import {DijkstraSP, EdgeWeightedDigraph, DirectedEdge} from "../controller/GraphSP.js";
import {enemyTypes, terrainTypes} from "./ItemTypes.js";
import {Terrain} from "./Terrain.js";

export class Bandit extends Enemy {
    constructor(p5, x, y) {
        super(x, y);
        this.name = "Bandit";
        this.img = p5.images.get(`${this.name}`);

        this.enemyType = enemyTypes.BANDIT;

        this.health = 3;
        this.maxHealth = 3;
        this.status = true;

        // at the beginning of end turn movement, isMoving = false, targetCell = null
        // during movement, isMoving = true, targetCell != null
        // at the end of movement, isMoving = true, targetCell = null
        this.cell = null;
        this.targetCell = null;
        this.isMoving = false;
        this.hasMoved = true;
        this.direction = [];
        this.moveSpeed = 5;
    }

    draw(p5){
        let imgSize = myutil.relative2absolute(1 / 32, 0)[0];
        p5.image(this.img, this.x - imgSize / 2, this.y - imgSize, imgSize, imgSize);
    }

    static createNewBandit(p5, playBoard, i, j) {
        if(playBoard.boardObjects.getCell(i,j).enemy !== null){
            return;
        }
        let [avgX, avgY] = myutil.cellIndex2Pos(p5, playBoard, i, j, p5.CENTER);
        let bandit = new Bandit(p5, avgX, avgY);
        playBoard.movables.push(bandit);
        playBoard.boardObjects.getCell(i, j).enemy = bandit;
        bandit.cell = playBoard.boardObjects.getCell(i, j);
    }

    movements(p5, playBoard) {
        if (!this.status || this.hasMoved) {
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
        let [dx, dy] = this.direction;
        let oldX = myutil.oldCoorX(playBoard, this.x, this.y) + this.moveSpeed * dx;
        let oldY = myutil.oldCoorY(playBoard, this.x, this.y) + this.moveSpeed * dy;
        let newX = myutil.newCoorX(playBoard, oldX, oldY);
        let newY = myutil.newCoorY(playBoard, oldX, oldY);
        this.x = newX;
        this.y = newY;

        let [targetX, targetY] = myutil.cellIndex2Pos(p5, playBoard, this.targetCell.x, this.targetCell.y, p5.CENTER);

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
        // if the bandit is at the same cell with a plant, it first tries to leave.
        if (this.cell.plant !== null) {
            let G = this.graph(playBoard);
            let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            let possibleDirections = [];
            for (let [dx, dy] of directions) {
                // skip out-of-bound
                if (this.cell.x + dx < 0 || this.cell.x + dx >= playBoard.gridSize || this.cell.y + dy < 0 || this.cell.y + dy >= playBoard.gridSize) {
                    continue;
                }
                // the target cell must not be occupied by another enemy or plant already
                if (G.edges().find(e => {
                    return e.from() === this.cell.x + this.cell.y * playBoard.gridSize
                        && e.to() === (this.cell.x + dx) + (this.cell.y + dy) * playBoard.gridSize
                }).weight < 100 && playBoard.boardObjects.getCell(this.cell.x + dx, this.cell.y + dy).plant === null
                && playBoard.boardObjects.getCell(this.cell.x + dx, this.cell.y + dy).seed === null) {
                    possibleDirections.push([dx, dy]);
                }
            }
            if (possibleDirections.length > 0) {
                let index = Math.floor(Math.random() * possibleDirections.length);
                this.targetCell = playBoard.boardObjects.getCell(this.cell.x + possibleDirections[index][0], this.cell.y + possibleDirections[index][1]);
                this.direction = [this.targetCell.y - this.cell.y, this.targetCell.x - this.cell.x];
                return;
            }
            // if no way out, the bandit dies of forest insects and animal attacks.
            // they may deserve a better ending? refactor
            this.status = false;
            plantEnemyInteractions.findMovableAndDelete(playBoard, this);
            return;
        }

        // get all living plants and seeds
        let cellsWithPlant = playBoard.boardObjects.getAllCellsWithPlant();
        let cellsWithSeed = playBoard.boardObjects.getAllCellsWithSeed();
        let allTargets = [...cellsWithPlant, ...cellsWithSeed];

        if (allTargets.length === 0) {
            return;
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
        this.direction = [this.targetCell.y - this.cell.y, this.targetCell.x - this.cell.x]; // the row and col is reversed to fit the board's matrix-like cell positioning
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

        let path = dijkstraSP.pathTo(allTargets[index].x + allTargets[index].y * playBoard.gridSize);

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

        // set weight to avoid tornado.
        let cellsWithEnemy = playBoard.boardObjects.getAllCellsWithEnemy();
        for (let cwe of cellsWithEnemy) {
            let x = cwe.x;
            let y = cwe.y;
            
            if (cwe.enemy && cwe.enemy.enemyType === enemyTypes.TORNADO) {
                for (let i = 0; i < N - 1; i++) { 
                    if (G.adj[i + y * N]?.find(e => e.to() === (i + 1) + y * N)) {
                        G.setWeight(i + y * N, (i + 1) + y * N, 10, 'a');
                    }
                }
                for (let j = 0; j < N - 1; j++) { 
                    if (G.adj[x + j * N]?.find(e => e.to() === x + (j + 1) * N)) {
                        G.setWeight(x + j * N, x + (j + 1) * N, 10, 'a');
                    }
                }
            }
        
            // Avoid enemy clashes
            if (x !== this.cell.x || y !== this.cell.y) {
                let directions = [
                    [(x - 1), y],
                    [(x + 1), y],
                    [x, (y - 1)],
                    [x, (y + 1)]
                ];
                
                for (let [nx, ny] of directions) {
                    if (nx >= 0 && nx < N && ny >= 0 && ny < N) {
                        if (G.adj[x + y * N]?.find(e => e.to() === nx + ny * N)) {
                            G.setWeight(x + y * N, nx + ny * N, 1000, "ab");
                        }
                    }
                }
            }
        }

        return G;
    }

}

export class Lumbering extends Terrain {
    constructor(p5) {
        super();
        this.name = "Lumbering";
        this.color = "black";
        this.terrainType = terrainTypes.LUMBERING;
        this.img = p5.images.get(`${this.name}`);
    }

    getWeight() {
        return 0;
    }
}