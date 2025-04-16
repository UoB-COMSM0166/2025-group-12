class PriorityQueue {
    // Priority Queue based on binary heap
    constructor(compareTo) {
        this.compareTo = compareTo;
        this.pq = [];
        this.N = 0;
    }

    isEmpty() {
        return this.N === 0;
    }

    size() {
        return this.N;
    }

    insert(key) {
        this.pq[++this.N] = key;
        this.swim(this.N);
    }

    poll() {
        let item = this.pq[1];
        if (item === undefined) {
            return null;
        }
        this.exchange(1, this.N--);
        this.pq[this.N + 1] = null;
        this.sink(1);
        return item;
    }

    swim(k) {
        while (k > 1 && this.less(Math.floor(k / 2), k)) {
            this.exchange(Math.floor(k / 2), k);
            k = Math.floor(k / 2);
        }
    }

    sink(k) {
        while (2 * k <= this.N) {
            let j = 2 * k;
            if (j < this.N && this.less(j, j + 1)) {
                j++;
            }
            if (!this.less(k, j)) {
                break;
            }
            this.exchange(k, j);
            k = j;
        }
    }

    less(i, j) {
        if (!this.pq[i] || !this.pq[j]) return false; // Prevent undefined access
        return this.compareTo(this.pq[i], this.pq[j]) > 0;
    }

    exchange(i, j) {
        let tmp = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = tmp;
    }
}

// refactor later, this version of IPQ is O(Nlog(N)), much worse than binary heap O(log(N)).
class IndexPriorityQueue {
    constructor(compareTo) {
        this.compareTo = compareTo; // Comparison function
        this.queue = []; // Stores [index, priority]
        this.indices = new Map(); // Maps index -> priority
    }

    insert(i, key) {
        if (this.contains(i)) throw new Error(`Index ${i} already exists`);

        this.indices.set(i, key);
        this.queue.push([i, key]);
        this.queue.sort((a, b) => this.compareTo(a[1], b[1])); // Keep sorted
    }

    pollIndex() {
        if (this.isEmpty()) return null;
        let [minIndex, _] = this.queue.shift();
        this.indices.delete(minIndex);
        return minIndex;
    }

    change(i, key) {
        if (!this.contains(i)) {
            this.insert(i, key);
        } else {
            this.indices.set(i, key);
            this.queue = this.queue.map(([idx, val]) => (idx === i ? [i, key] : [idx, val]));
            this.queue.sort((a, b) => this.compareTo(a[1], b[1])); // Re-sort after change
        }
    }

    contains(i) {
        return this.indices.has(i);
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }
}

export {PriorityQueue, IndexPriorityQueue};

if (typeof module !== 'undefined') {
    module.exports = {PriorityQueue, IndexPriorityQueue};
}