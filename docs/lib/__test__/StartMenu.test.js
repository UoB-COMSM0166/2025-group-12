import {createMockP5} from "./Persona5.js";
import {StartMenuModel, StartMenuLogic} from "../../src/model/StartMenu.js";

import {Container} from "../../src/controller/Container.js";

let p, container;
beforeAll(() => {
    p = createMockP5();
    container = new Container(p);
});


test('description', () => {
    let startMenu = container.startMenu;
    startMenu.buttons.forEach(button => console.log(`x: ${button.x}, y: ${button.y}, width: ${button.width}, height: ${button.height}`));
});