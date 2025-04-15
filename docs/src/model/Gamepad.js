import {CanvasSize} from "../CanvasSize.js";
import {StandbyMenu} from "./Standby.js";
import {stateCode} from "./GameState.js";

let gamepadIndex = null;
let buttonStates = {};
let gamepadListeners = {};
let globalButtonListener = null;
let lastAxes = [0, 0, 0, 0];
let analogStickListener = null;
let analogButtonListener = null;

let leftStick = false;
let rightStick = false;


window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
    buttonStates = {};
    gamepadListeners = {};
});

export function Gamepad(buttonIndex, callback) {
    if (!gamepadListeners[buttonIndex]) {
        gamepadListeners[buttonIndex] = [];
    }
    gamepadListeners[buttonIndex].push(callback);
}

export function anyGamepadButtonPressed(callback) {
    globalButtonListener = callback;
}

export function analogStickMoved(callback) {
    analogStickListener = callback;
}

export function analogStickPressed(callback) {
    analogButtonListener = callback;
}

export function pollGamepad(p5, currentMenu, saveState) {
    if (gamepadIndex === null) return;

    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;

    const currentAxes = gamepad.axes.slice(0, 4);

    if(analogStickListener){
        analogStickListener(currentAxes);
    }
    lastAxes = currentAxes;


    gamepad.buttons.forEach((btn, index) => {
        const wasPressed = buttonStates[index] || false;
        const isPressed = btn.pressed;

        if (!wasPressed && isPressed && gamepadListeners[index]) {
            gamepadListeners[index].forEach(fn => fn());
        }

        if(!wasPressed && isPressed) {
            globalButtonListener(index);
        }

        buttonStates[index] = isPressed;
    });

    if((Math.abs(currentAxes[0]) > 0.2 || Math.abs(currentAxes[1]) > 0.2) && !leftStick) {
        analogButtonListener(currentAxes);
        leftStick = true;
    }

    if(Math.abs(currentAxes[0]) < 0.2 && Math.abs(currentAxes[1]) < 0.2){
        leftStick = false;
    }
}
