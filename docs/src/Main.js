import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {preloader} from "./Preloader.js";

new p5((p) => {

    p.preload = preloader;

    let controller = new Controller();

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        controller.setup(p);
    };

    p.mouseWheel = (event) => {
        controller.scrollListener(event);
    }

    p.mouseClicked = () => {
        controller.clickListener(p);
    }
    p.draw = () => {
        p.background(100, 100, 100);

        // when game state changes, load or save data accordingly
        controller.setData(controller.gameState.getState());

        // replace following tmp view handling later
        controller.view(p);

        // keep a copy of current state
        controller.saveState = controller.gameState.getState();
    };
});
