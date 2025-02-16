// use union find we can fetch connected regions when terrain changes (river, flood, bridge, ...)
export class UnionFind{
    constructor(N) {
        this.id = new Array(N);
        this.size = new Array(N).fill(1);
        this._count = N;

        for (let i = 0; i < this.id.length; i++) {
            this.id[i] = i;
        }
    }

    get count() {
        return this._count;
    }

    connected(p, q){
        return this.find(p) === this.find(q);
    }

    find(p){
        if (p !== this.id[p]) {
            this.id[p] = this.find(this.id[p]); // Path compression
        }
        return this.id[p];
    }

    union(p, q){
        let pRoot = this.find(p);
        let qRoot = this.find(q);
        if(pRoot === qRoot){
            return;
        }
        if(this.size[pRoot] < this.size[qRoot]){
            this.id[pRoot] = qRoot;
            this.size[qRoot] += this.size[pRoot];
        }else{
            this.id[qRoot] = pRoot;
            this.size[pRoot] += this.size[qRoot];
        }
        this._count--;
    }
}