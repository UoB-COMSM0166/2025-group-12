export class Renderer{
    // placeholder, injected in container
    static draw(p5){}

    static render(p5, menus, gameState, pauseMenu) {
        let currentMenu = menus[gameState.getState()];
        if (currentMenu && currentMenu.draw) {
            currentMenu.draw(p5);
        }
        if (gameState.paused) {
            p5.push();
            p5.filter(p5.BLUR, 3);
            p5.pop();
            pauseMenu.draw(p5);
        }
    }
}