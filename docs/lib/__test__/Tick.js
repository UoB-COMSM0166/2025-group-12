/**
 * Simulates one full frame of the game's main loop.
 * Mirrors the actual `p.draw` in game entrypoint.
 *
 * @param {Container} container - your wired game container
 * @param p5 - the mock or real p5 instance
 * @param {number} frames - the number of total frames of ticking
 */
export function tick(p5, container, frames) {
    for (let i = 0; i < frames; i++) {
        p5.frameCount++;

        container.controller.mainLoopEntry(p5);

        container.renderer.render(p5);

        container.controller.saveState = container.gameState.getState();
    }
}
