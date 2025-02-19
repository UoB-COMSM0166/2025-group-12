/* A* search, which is more efficient than BFS */

class PriorityQueue {
    constructor() {
        this.elements = [];
    }
    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }
    // get the priority item
    dequeue() {
        return this.elements.shift().item;
    }
    isEmpty() {
        return this.elements.length === 0;
    }
}


class Graph {
    constructor(grid) {
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    neighbours(node) {
        /*
        equal to 
        let x = node.x;
        let y = node.y;
        */
        let { x, y } = node;
        let directions = [
            [1, 0], [0, 1], [-1, 0], [0, -1]
        ];
        let result = [];
        /*
        equal to
        let dx = directions[i][0];
        let dy = directions[i][1];
        */
        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;
            if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols && this.grid[newX][newY] === 0) {
                result.push(new Node(newX, newY));
            }
        }
        return result;
    }

    cost(node1, node2) {
        // grid cost is constant 1
        return 1;
    }
}

function heuristic(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}



class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isEqual(node) {
        return this.x === node.x && this.y === node.y;
    }
    hash() {
        return `${this.x},${this.y}`;
    }
}

/* 
usage:
function receive 4 parameters, an object contains one 2d array, a start object contains coordinate [x, y], 
a target object contains coordinate[x, y], a step.
reuturn an array contains all the coordinate in object
*/

function aStarSearch(graph, startIn, goalIn, step) {
    //let graph = new Graph(graphIn);
    let start = new Node(startIn.x, startIn.y);
    let goal = new Node(goalIn.x, goalIn.y);
    let frontier = new PriorityQueue();
    frontier.enqueue(start, 0);

    let cameFrom = new Map();
    let costSoFar = new Map();

    let startKey = start.hash();
    let goalKey = goal.hash();

    cameFrom.set(startKey, null);
    costSoFar.set(startKey, 0);

    while (!frontier.isEmpty()) {
        let current = frontier.dequeue();
        let currentKey = current.hash();
        if (current.isEqual(goal)) {
            break;
        }

        for (let next of graph.neighbours(current)) {
            let nextKey = next.hash();
            let newCost = costSoFar.get(currentKey) + graph.cost(current, next);

            if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)) {
                costSoFar.set(nextKey, newCost);
                let priority = newCost + heuristic(goal, next);
                frontier.enqueue(next, priority);
                cameFrom.set(nextKey, currentKey);
            }
        }
    }
    return reconstructPath(cameFrom, startKey, goalKey, step);
}

function reconstructPath(cameFrom, startKey, goalKey, step) {
    if (!cameFrom.has(goalKey)) {
        return [];
    }
    let path = [];
    let currentKey = goalKey;
    while (currentKey !== startKey) {
        let [x, y] = currentKey.split(',').map(Number);
        path.push(new Node(x, y));
        currentKey = cameFrom.get(currentKey);
    }

    // transform string 'x,y' to [x, y] (x, y are numbers) comment out if start is not needed
    // path.push(new Node(...startKey.split(',').map(Number)));
    path.reverse();
    if(step > path.length){
        return [];
    }
    path.splice(step, path.length-step);
    return path;
}

class TestObj{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 100;
    }
    ashgio(){

    }

    asdgjaosid(){

    }
}

// test
let grid = [
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
];

let test1 = new TestObj(0, 0);
let graph = new Graph(grid);
let start = new Node(0, 0);

let goal = new TestObj(4, 4);

let path = aStarSearch(graph, test1, goal, 1);
console.log(path);
console.log("PATH:", path.map(n => `(${n.x}, ${n.y})`).join(" -> "));

