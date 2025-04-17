class KeyboardHandler {
    static setup(bundle) {
        KeyboardHandler.p5 = bundle.p5;
        KeyboardHandler.stateCode = bundle.stateCode;
        /** @type {typeof InfoBoxLogic} */
        KeyboardHandler.InfoBoxLogic = bundle.InfoBoxLogic;
        /** @type {typeof PlayBoardLogic} */
        KeyboardHandler.PlayBoardLogic = bundle.PlayBoardLogic;
    }

    /**
     *
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.keys = [];
        this.keyboradKeys = [];
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
            } else if (e.key === 'Escape' && this.gameState.state !== KeyboardHandler.stateCode.MENU) {
                this.gameState.togglePaused();
            }
        });

        window.addEventListener("keyup", (event) => {
            let p5 = KeyboardHandler.p5;
            let playBoard = this.gameState.currentStage;
            // a keyboard shortcut to activate plant skill
            if (playBoard != null) {
                // active skill - higher priority
                if (event.key === "e" && playBoard.infoBox.activateButton !== null) {
                    playBoard.infoBox.activateButton._onClick(p5);
                }
                // toggle display ecosystem
                if (event.key === "e" && playBoard.infoBox.activateButton === null && playBoard.infoBox.displayButton !== null) {
                    playBoard.infoBox.displayButton._onClick(p5);
                }
                // turn button
                if (event.key === " " && playBoard.gameState.playerCanClick && playBoard.floatingWindow === null) {
                    playBoard.buttons.find(b => b.text.startsWith("turn"))._onClick();
                }
                // to dev team: quick skip current stage
                if (event.key === "c" && !playBoard.skip) {
                    console.log();
                    playBoard.skip = true;
                    KeyboardHandler.PlayBoardLogic.stageClearSettings(p5, playBoard);
                    playBoard.gameState.isFading = true;
                    playBoard.gameState.nextState = KeyboardHandler.stateCode.FINISH;
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
    }
}

export {KeyboardHandler};

if (typeof module !== 'undefined') {
    module.exports = {KeyboardHandler};
}