import {IndexPriorityQueue} from "./PriorityQueue.js";

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
        this.adj[v].push(e);
        this.E++;
    }

    // return all edges of the graph
    edges() {
        let edges = [];
        for (let v = 0; v < this.V; v++) {
            for (let edge of this.adj[v]) {
                edges.push(edge);
            }
        }
        return edges;
    }

    // modify the weight of edge v -> w.
    setWeight(v, w, weight, mode) {
        // if v or w is not in the graph, return false.
        if (v < 0 || w < 0 || v >= this.V || w >= this.V) {
            return;
        }

        let edge = this.adj[v].find(e => e.to() === w);
        // if v->w is not in the graph, insert it.
        if (edge === null || edge === undefined) {
            this.addEdge(new DirectedEdge(v, w, weight));
        } else {
            if (mode === 'a') {
                edge.weight += weight;
            } else if (mode === "ab") {
                // append to both directions
                edge.weight += weight;
                this.adj[w].find(e => e.to() === v).weight += weight;
            } else {
                edge.weight = weight;
            }
        }
    }

    hasEdge(v, w){
        return this.adj[v]?.find(e => e.to() === w);
    }

    setWeightIfHasEdge(v, w, weight, mode){
        if(this.hasEdge(v, w)){
            this.setWeight(v, w, weight, mode);
        }
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
