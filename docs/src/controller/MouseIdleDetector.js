class MouseIdleDetector {
    constructor(p5, thresholdMillis = 1000) {
        this.p5 = p5;
        this.threshold = thresholdMillis;
        this.lastMoved = this.p5.millis();
    }

    detectMouseIdleness() {
        this.lastMoved = this.p5.millis();
    }

    isIdle() {
        return this.p5.millis() - this.lastMoved > this.threshold;
    }
}

export {MouseIdleDetector};

if (typeof module !== 'undefined') {
    module.exports = {MouseIdleDetector};
}