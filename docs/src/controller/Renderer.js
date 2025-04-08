export class Renderer{
    static render(p5) {
        let controller = p5.controller;

        let currentMenu = controller.menus[controller.gameState.getState()];
        if (currentMenu && currentMenu.draw) {
            currentMenu.draw(p5);
        }
        if (controller.gameState.paused) {
            p5.push();
            p5.filter(p5.BLUR, 3);
            p5.pop();
            controller.pauseMenu.draw(p5);
        }

        if (controller.gameState.showOptions) {
            controller.options.draw(p5);
        }
    }
}