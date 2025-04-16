class Renderer {
    constructor(bundle) {
        /** @type {GameState} */
        this.gameState = bundle.gameState;
        this.menus = bundle.menus;
        this.pauseMenu = bundle.pauseMenu;
        this.stateCode = bundle.stateCode;
        /** @type {typeof StartMenuRenderer} */
        this.StartMenuRenderer = bundle.StartMenuRenderer;
        /** @type {typeof GameMapRenderer} */
        this.GameMapRenderer = bundle.GameMapRenderer;
        /** @type {typeof PlayBoardLogic} */
        this.PlayBoardRenderer = bundle.PlayBoardRenderer;
        /** @type {typeof PauseMenuRenderer} */
        this.PauseMenuRenderer = bundle.PauseMenuRenderer;
        this.renderFactory = new Map([
            [this.stateCode.MENU, this.StartMenuRenderer],
            [this.stateCode.STANDBY, this.GameMapRenderer],
            [this.stateCode.PLAY, this.PlayBoardRenderer],
        ])
    }

    render(p5) {
        let currentState = this.gameState.getState();
        let currentMenu = this.menus[currentState];
        if (currentMenu && this.renderFactory.get(currentState).draw) {
            this.renderFactory.get(currentState).draw(p5, currentMenu);
        }
        if (this.gameState.paused) {
            p5.push();
            p5.filter(p5.BLUR, 3);
            p5.pop();
            this.PauseMenuRenderer.draw(p5, this.pauseMenu);
        }
    }
}

export {Renderer};

if (typeof module !== 'undefined') {
    module.exports = {Renderer};
}