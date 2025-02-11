import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {preloader} from "./Preloader.js";

new p5((p) => {

    p.preload = preloader;

    // record mouse status to prevent redundant clicks
    let prevMousePressed = false;

    let controller = new Controller();

    p.setup = () => {
        let canvasSize = CanvasSize.getSize();
        p.createCanvas(canvasSize[0], canvasSize[1]);
        controller.setup(p);
    };

    p.mouseWheel = (event) => {
        controller.scrollListener(event);
    }

    p.draw = () => {
        p.background(100, 100, 100);

        // replace following tmp view handling later
        controller.view(p);

        // handle mouse actions
        if (p.mouseIsPressed && !prevMousePressed) {
             controller.clickListener(p);
        }
        

        // set mouse status to prevent redundant clicks
        prevMousePressed = p.mouseIsPressed;
    };
});
