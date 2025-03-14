import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {loadImages, loadSounds} from "./Preloader.js";

new p5((p) => {

    p.preload = () => {
        p.images = loadImages(p);
        p.soundFormats('mp3');
        p.mySounds = loadSounds(p);
    };

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        p.controller = new Controller(p);
        p.controller.setup(p);
    };

    p.mouseWheel = (event) => {
        p.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        p.controller.clickListener(p);
    }
    p.draw = () => {
        p.background(100);

        // create play stage
        p.controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        p.controller.setData(p, p.controller.gameState.getState());

        // replace following tmp view handling later
        p.controller.view(p);

        // keep a copy of current state
        p.controller.saveState = p.controller.gameState.getState();

    };
});
