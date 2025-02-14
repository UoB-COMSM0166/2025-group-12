import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {preloader} from "./Preloader.js";

new p5((p) => {

    let controller;
    p.preload = async () => { p.images = await preloader(p);};

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        controller = new Controller(p);
        controller.setup(p);
    };

    p.mouseWheel = (event) => {
        controller.scrollListener(event);
    }

    p.mouseClicked = () => {
        controller.clickListener(p);
    }
    p.draw = () => {
        p.background(100);
        
        // create play stage
        controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        controller.setData(p, controller.gameState.getState());

        // replace following tmp view handling later
        controller.view(p);

        // keep a copy of current state
        controller.saveState = controller.gameState.getState();
    };
});
