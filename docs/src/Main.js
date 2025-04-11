import {Container} from "./controller/Container.js";

new p5((p) => {
    let container = new Container(p);

    p.preload = () => {
        container.preloader(p);
    };

    p.setup = () => {

        let canvasSize = container.utilityClass.relative2absolute(1, 1);
        p.createCanvas(canvasSize[0], canvasSize[1]);

        container.controller.setup(p);
    };

    p.mouseWheel = (event) => {
        container.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        container.controller.clickListener(p);
    }
    p.draw = () => {
        p.background(100);

        // create play stage
        container.controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        container.controller.setData(p, container.gameState.getState());

        // replace following tmp view handling later
        container.renderer(p);

        // keep a copy of current state
        container.controller.saveState = container.gameState.getState();

    };
});

