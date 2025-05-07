import {_setTestGamepad, pollGamepad} from "../../src/controller/GamepadHandler.js";

function createMockP5() {
    const fn = () => { };

    return {
        // General drawing
        stroke: fn,
        strokeWeight: fn,
        noStroke: fn,
        noCursor: fn,
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
        circle: fn,

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

        millis: fn,
        loadedAll: true,

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
            setAlpha: (alpha) => { }
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
        images: new Map([
            ["TitleBackground", {height: 100, width: 100}],
            ["TitleBanner", {height: 100, width: 100}],
        ]),
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

function simulateGamepad(buttonIndex = 0, pressed = true, axes = [0, 0, 0, 0]) {
    const gamepad = {
        axes: axes,
        buttons: Array.from({ length: 16 }, (_, i) => ({
            pressed: i === buttonIndex ? pressed : false
        })),
        connected: true,
        index: 0
    };
    _setTestGamepad(gamepad);
    pollGamepad();
}

export { createMockP5, simulateKeyDown, simulateKeyUp, simulateKeyPress, simulateGamepad };

if (typeof module !== 'undefined') {
    module.exports = { createMockP5, simulateKeyDown, simulateKeyUp, simulateKeyPress, simulateGamepad };
}