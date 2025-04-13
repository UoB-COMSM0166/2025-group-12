import {Container} from "./controller/Container.js";
import {loadImages} from "./Preloader.js";

/** @type {Container} */
let container;

new p5((p) => {
    p.preload = () => {
        p.images = loadImages(p);
    };

    p.setup = () => {
        container = new Container(p);
        let canvasSize = container.utilityClass.relative2absolute(1, 1);
        p.createCanvas(canvasSize[0], canvasSize[1]);
    };

    p.mouseWheel = (event) => {
        container.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        container.controller.clickListener(p);
    }

    p.draw = () => {
        p.background(100);

        container.controller.handleFading(p);

        // create play stage
        container.controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        container.controller.setData(p, container.gameState.getState());

        // rendering
        container.renderer.render(p);

        // keep a copy of current state
        container.controller.saveState = container.gameState.getState();

    };
});

