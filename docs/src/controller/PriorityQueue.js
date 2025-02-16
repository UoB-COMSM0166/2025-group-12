export class PriorityQueue{
    // Priority Queue based on binary pile
    constructor(compareTo){
        this.compareTo = compareTo;
        this.pq = [null];
        this.N = 0;
    }

    isEmpty(){
        return this.N === 0;
    }

    size(){
        return this.N;
    }

    insert(key){
        this.pq.push(key);
        this.N++;
        this.swim(this.N);
    }

    poll(){
        let item = this.pq[1];
        if(item === undefined){
            return null;
        }
        this.exchange(1, this.N);
        this.N--;
        this.pq[this.N+1] = undefined;
        this.sink(1);
        return item;
    }

    swim(k){
        while(k > 1 && this.less(Math.floor(k / 2), k)){
            this.exchange(Math.floor(k / 2), k);
            k = Math.floor(k / 2);
        }
    }

    sink(k){
        while(2*k <= this.N){
            let j = 2*k;
            if(j < this.N && this.less(j, j+1)){
                j++;
            }
            if(!this.less(k, j)){
                break;
            }
            this.exchange(k, j);
            k = j;
        }
    }

    less(i, j){
        if (!this.pq[i] || !this.pq[j]) return false; // Prevent undefined access
        return this.compareTo(this.pq[i], this.pq[j]) < 0;
    }

    exchange(i, j){
        let tmp = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = tmp;
    }
}