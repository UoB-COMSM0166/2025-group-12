import {stateCode} from "../model/GameState.js";

export class InputHandler {
    constructor(gameState) {
        this.gameState = gameState;
        this.keys = [];
        this.keyboradKeys = [];
        this.gamepadKeys = [];
        this.gamepad;
        window.addEventListener('keydown', e => {
            if ((e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === 'Enter' ||
                    e.key === ' ')
                && this.keyboradKeys.indexOf(e.key) === -1) {
                this.keyboradKeys.push(e.key);
            } else if (e.key === 'q') {
                //
            } else if (e.key === 'Escape' && this.gameState.state !== stateCode.MENU) {
                // pause the game
                this.gameState.togglePaused();
                // comment out since code change
                //this.gameState.togglePlayerCanClick();
            }
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === 'Enter' ||
                e.key === ' ') {
                this.keyboradKeys.splice(this.keyboradKeys.indexOf(e.key), 1);
            }
        });

        window.addEventListener('gamepadconnected', (e) => {
            this.gamepad = e.gamepad;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            this.gamepad = null;
        });
    }
}