let gamepadIndex = null;
let buttonStates = {};
let gamepadListeners = {};
let globalButtonListener = null;
let lastAxes = [0, 0, 0, 0];
let analogStickListener = null;
let analogButtonListener = null;
let analogStickIdleListener = null;

let leftStick = false;
let rightStick = false;
let gamepad;
const threshold = 50
let currentTime = 0;
let lastTime = 0;

window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
    buttonStates = {};
    gamepadListeners = {};
});

function Gamepad(buttonIndex, callback) {
    if (!gamepadListeners[buttonIndex]) {
        gamepadListeners[buttonIndex] = [];
    }
    gamepadListeners[buttonIndex].push(callback);
}

function anyGamepadButtonPressed(callback) {
    globalButtonListener = callback;
}

function analogStickMoved(callback) {
    analogStickListener = callback;
}

function analogStickPressed(callback) {
    analogButtonListener = callback;
}

function analogStickIdle(callback) {
    analogStickIdleListener = callback;
}

function pollGamepad(p5, currentMenu, saveState) {
    if (gamepadIndex !== null) gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;
    const currentAxes = gamepad.axes.slice(0, 4);

    if (analogStickListener) {
        analogStickListener(currentAxes);
    }
    //analog stick moved
    if(Math.abs(currentAxes[0] - lastAxes[0])> 0.02) lastTime = currentTime;
    if(currentTime - lastTime > threshold) {
        analogStickIdleListener(currentAxes);
    }
    lastAxes = currentAxes;

    gamepad.buttons.forEach((btn, index) => {
        const wasPressed = buttonStates[index] || false;
        const isPressed = btn.pressed;

        if (!wasPressed && isPressed && gamepadListeners[index]) {
            gamepadListeners[index].forEach(fn => fn());
        }

        if (!wasPressed && isPressed) {
            globalButtonListener(index);
        }

        buttonStates[index] = isPressed;
    });

    if ((Math.abs(currentAxes[0]) > 0.5 || Math.abs(currentAxes[1]) > 0.5) && !leftStick) {
        analogButtonListener(currentAxes);
        leftStick = true;
    }

    if (Math.abs(currentAxes[0]) < 0.5 && Math.abs(currentAxes[1]) < 0.5) {
        leftStick = false;
    }
    currentTime++;
}

function _setTestGamepad(mockGamepad) {
    gamepad = mockGamepad;
}

function vibrate(duration = 300, strong = 1.0, weak = 0.5) {
    if (gamepadIndex === null) return;

    const updatedGamepad = navigator.getGamepads()[gamepadIndex];
    if (updatedGamepad?.vibrationActuator) {
        updatedGamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration,
            strongMagnitude: strong,
            weakMagnitude: weak
        }).catch(err => {
            console.warn("fail to vibrate:", err);
        });
    }
}


export {Gamepad, anyGamepadButtonPressed, analogStickMoved, analogStickPressed, pollGamepad, _setTestGamepad, analogStickIdle, vibrate};

if (typeof module !== 'undefined') {
    module.exports = {Gamepad, anyGamepadButtonPressed, analogStickMoved, analogStickPressed, pollGamepad, _setTestGamepad, analogStickIdle, vibrate};
}