class InputHandler {
    static setup(bundle) {
        InputHandler.p5 = bundle.p5;
        InputHandler.stateCode = bundle.stateCode;
        /** @type {typeof InfoBoxLogic} */
        InputHandler.InfoBoxLogic = bundle.InfoBoxLogic;
        /** @type {typeof PlayBoardLogic} */
        InputHandler.PlayBoardLogic = bundle.PlayBoardLogic;
    }

    /**
     *
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.keys = [];
        this.keyboradKeys = [];
        this.gamepadKeys = [];
        this.gamepad = null;
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
            } else if (e.key === 'Escape' && this.gameState.state !== InputHandler.stateCode.MENU) {
                // pause the game
                this.gameState.togglePaused();
                // comment out since code change
                //this.gameState.togglePlayerCanClick();
            }
        });


        window.addEventListener("keyup", (event) => {
            let p5 = InputHandler.p5;
            let playBoard = this.gameState.currentStage;
            // a keyboard shortcut to activate plant skill
            if (playBoard != null) {
                // active skill
                if (event.key === "e" && playBoard.infoBox.activateButton !== null) {
                    playBoard.infoBox.activateButton._onClick(p5);
                }
                // toggle display ecosystem
                if (event.key === "e" && playBoard.infoBox.displayButton !== null) {
                    playBoard.infoBox.displayButton._onClick(p5);
                }
                // turn button
                if (event.key === " " && playBoard.gameState.playerCanClick && playBoard.floatingWindow === null) {
                    playBoard.buttons.find(b => b.text.startsWith("turn"))._onClick();
                }
                // to dev team: quick skip current stage
                if (event.key === "c" && !playBoard.skip) {
                    playBoard.skip = true;
                    InputHandler.PlayBoardLogic.stageClearSettings(p5, playBoard);
                    playBoard.gameState.setState(InputHandler.stateCode.FINISH);
                }
                // info box arrows
                if (event.key === "a" && playBoard.selectedCell.length !== 0) {
                    InputHandler.InfoBoxLogic.clickLeftArrow(p5, playBoard.infoBox);
                }
                if (event.key === "ArrowLeft" && playBoard.selectedCell.length !== 0) {
                    InputHandler.InfoBoxLogic.clickLeftArrow(p5, playBoard.infoBox);
                }
                if (event.key === "d" && playBoard.selectedCell.length !== 0) {
                    InputHandler.InfoBoxLogic.clickRightArrow(p5, playBoard.infoBox);
                }
                if (event.key === "ArrowRight" && playBoard.selectedCell.length !== 0) {
                    InputHandler.InfoBoxLogic.clickRightArrow(p5, playBoard.infoBox);
                }
            }
        })
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

    updateGamepad() {
        if (this.gamepad) {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.gamepad.index];

            if (gamepad) {
                const axisX = gamepad.axes[0];

                if (axisX > 0.5 && !this.gamepadKeys.includes('d')) {
                    this.gamepadKeys.push('d');
                } else if (axisX < -0.5 && !this.gamepadKeys.includes('a')) {
                    this.gamepadKeys.push('a');
                } else if (Math.abs(axisX) < 0.5 && (this.gamepadKeys.includes('a') || this.gamepadKeys.includes('d'))) {
                    this.gamepadKeys.splice(this.gamepadKeys.indexOf('a'), 1);
                    this.gamepadKeys.splice(this.gamepadKeys.indexOf('d'), 1);
                }

                if (gamepad.buttons[0].pressed && !this.gamepadKeys.includes(' ')) {
                    this.gamepadKeys.push(' ');
                } else if (!gamepad.buttons[0].pressed && this.gamepadKeys.includes(' ')) {
                    this.gamepadKeys.splice(this.gamepadKeys.indexOf(' '), 1);
                }
            }
        }
        this.keys = [...new Set([...this.keyboradKeys, ...this.gamepadKeys])];
    }
}

export {InputHandler};

if (typeof module !== 'undefined') {
    module.exports = {InputHandler};
}