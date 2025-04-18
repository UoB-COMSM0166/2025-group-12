function createMockP5() {
    const fn = () => { };

    return {
        // General drawing
        stroke: fn,
        strokeWeight: fn,
        noStroke: fn,
        fill: fn,
        noFill: fn,
        rect: fn,
        line: fn,
        quad: fn,
        ellipse: fn,
        triangle: fn,
        push: fn,
        pop: fn,
        tint: fn,
        filter: fn,
        background: fn,
        translate: fn,
        rotate: fn,
        cursor: fn,
        image: fn,
        imageMode: fn,
        beginShape: fn,
        endShape: fn,
        vertex: fn,

        // Text
        text: fn,
        textSize: fn,
        textAlign: fn,
        textAscent: () => 10,
        textDescent: () => 5,
        textWrap: fn,
        textWidth: () => 42, // return dummy width

        // Math
        map: (x) => x,
        noise: () => 0.5,
        sin: Math.sin,
        cos: Math.cos,
        radians: (deg) => (deg * Math.PI) / 180,
        lerp: (a, b, t) => a + (b - a) * t,
        acos: Math.acos,
        PI: Math.PI,
        HALF_PI: Math.PI / 2,

        // Constants
        CENTER: 'center',
        TOP: 'top',
        LEFT: 'left',
        BASELINE: 'baseline',
        CORNER: 'corner',
        CORNERS: 'corners',
        TRIANGLE_STRIP: 'triangle_strip',
        WORD: 'word',
        ARROW: 'arrow',
        BLUR: 'blur',

        color: (...args) => ({
            toString: () => args.join(','),
            setAlpha: (alpha) => { } // ✅ mock out p5.color(...).setAlpha(...)
        }),

        strokeColor: null,

        // Canvas-related
        drawingContext: {
            shadowBlur: 0,
            shadowColor: '',
        },

        // Mouse, Key, Gamepad
        mouseX: 0,
        mouseY: 0,
        key: '',
        keyIsPressed: false,
        gamepadX: 0,
        gamepadY: 0,
        mouseSpeed: 20,

        // Custom
        images: new Map([['Alert', {}]]),
        loadImage: fn,
        loadSound: fn,
        frameCount: 0,
    };
}

function simulateKeyDown(key) {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
}

function simulateKeyUp(key) {
    const event = new KeyboardEvent('keyup', { key });
    window.dispatchEvent(event);
}

function simulateKeyPress(key) {
    simulateKeyDown(key);
    simulateKeyUp(key);
}

export { createMockP5, simulateKeyDown, simulateKeyUp, simulateKeyPress };

if (typeof module !== 'undefined') {
    module.exports = { createMockP5, simulateKeyDown, simulateKeyUp, simulateKeyPress };
}