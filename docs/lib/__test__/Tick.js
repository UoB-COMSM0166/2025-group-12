/**
 * Simulates one full frame of the game's main loop.
 * Mirrors the actual `p.draw` in game entrypoint.
 *
 * @param {Container} container - your wired game container
 * @param p5 - the mock or real p5 instance
 */
export function tick(p5, container) {
    container.controller.setPlayStage(p5);

    const currentState = container.gameState.getState();
    container.controller.setData(p5, currentState);

    container.controller.saveState = currentState;
}
