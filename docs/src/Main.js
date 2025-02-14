import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {preloader} from "./Preloader.js";

new p5((p) => {

    let controller;
    let pauseMenu;
    p.preload = async () => { p.images = await preloader(p);};

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        controller = new Controller(p);
        pauseMenu = p.createGraphics(canvasSize[0], canvasSize[1]);
        pauseMenu.background(0, 0, 0, 0);
        pauseMenu.fill(255);
        pauseMenu.textSize(50);
        pauseMenu.textAlign(p.CENTER, p.CENTER);
        pauseMenu.text("PAUSE", canvasSize[0]/2, canvasSize[1]/2);
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

        if(controller.gameState.paused){
            p.filter(p.BLUR, 5);
            p.image(pauseMenu, 0, 0);
        }
    };
});
