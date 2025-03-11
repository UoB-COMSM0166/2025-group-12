// use union find we can fetch connected regions when terrain changes (river, flood, bridge, ...)
export class UnionFind {
    constructor(N) {
        this.id = new Array(N);
        this.size = new Array(N).fill(1);
        this.count = N;

        for (let i = 0; i < this.id.length; i++) {
            this.id[i] = i;
        }
    }

    // the number of connected components
    countComponents() {
        return this.count;
    }

    // get all entries that are connected with entry x
    getComponent(x) {
        let root = this.find(x);
        let connected = [];
        for (let i = 0; i < this.id.length; i++) {
            if (this.find(i) === root) {
                connected.push(i);
            }
        }
        return connected;
    }


    connected(p, q) {
        return this.find(p) === this.find(q);
    }

    find(p) {
        if (p !== this.id[p]) {
            this.id[p] = this.find(this.id[p]); // Path compression
        }
        return this.id[p];
    }

    union(p, q) {
        let pRoot = this.find(p);
        let qRoot = this.find(q);
        if (pRoot === qRoot) {
            return;
        }
        if (this.size[pRoot] < this.size[qRoot]) {
            this.id[pRoot] = qRoot;
            this.size[qRoot] += this.size[pRoot];
        } else {
            this.id[qRoot] = pRoot;
            this.size[pRoot] += this.size[qRoot];
        }
        this.count--;
    }
}