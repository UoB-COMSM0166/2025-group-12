import {Dropdown} from "../items/Dropdown.js";

/**
 * @implements ScreenLike
 */
class OptionsModel {
    static setup(bundle) {
        OptionsModel.p5 = bundle.p5;
        /** @type {typeof myUtil} */
        OptionsModel.utilityClass = bundle.utilityClass;
        OptionsModel.stateCode = bundle.stateCode;
        /** @type {typeof Button} */
        OptionsModel.Button = bundle.Button;
        /** @type {typeof GameSerializer} */
        OptionsModel.GameSerializer = bundle.GameSerializer;
        OptionsModel.Dropdown = bundle.Dropdown;
    }

    /**
     * @param {GameState} gameState
     */
    constructor(gameState) {
        this.gameState = gameState;
        this.buttons = [];
        /** @type {FloatingWindow} */
        this.floatingWindow = null;
        /** @type {Map} */
        this.allFloatingWindows = null;

        this.init();
        this.drowpdown;
    }

    init() {
        let [dropdownWidth, dropdownHeight] = OptionsModel.utilityClass.relative2absolute(0.15, 0.07);
        let [dropdownX, dropDownY] = OptionsModel.utilityClass.relative2absolute(0.6, 0.5);
        this.dropdown = new OptionsModel.Dropdown(dropdownX, dropDownY, dropdownWidth, dropdownHeight);
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.buttons.forEach(button => {
            button.mode = "gamepad";
            button.isSelected = false;
        });
        this.buttons[0].isSelected = true;
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.buttons[this.index].isSelected = false;
        this.buttons.forEach(button => {
            button.mode = "mouse";
        });
    }
}

class OptionsRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        OptionsRenderer.utilityClass = bundle.utilityClass;
        /** @type {typeof ScreenRenderer} */
        OptionsRenderer.ScreenRenderer = bundle.ScreenRenderer;
    }


    static draw(p5, optionsMenu) {
        p5.background(0, 0, 0, 80);
        p5.fill(255);

        let fontSizes = OptionsRenderer.utilityClass.getFontSize();
        p5.textSize(fontSizes.huge);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let [textX, textY] = OptionsRenderer.utilityClass.relative2absolute(0.5, 0.2);
        p5.text("Options", textX, textY);
        [textX, textY] = OptionsRenderer.utilityClass.relative2absolute(0.5, 0.5);
        p5.textSize(fontSizes.medium);
        p5.text("resolution: ", textX, textY);
        optionsMenu.dropdown.draw(p5);
    }


}

class OptionsLogic {
    static setup(bundle) {
        /** @type {typeof ScreenLogic} */
        OptionsLogic.ScreenLogic = bundle.ScreenLogic;
        OptionsLogic.FloatingWindow = bundle.FloatingWindow;
    }


    static cancel(pauseMenu){
        pauseMenu.gameState.togglePaused();
    }


    static handleGamepad(index, pauseMenu){
        switch (index) {

        }

    }

    static handleAnalogStick(p5, axes, pauseMenu) {

    }


    static handleAnalogStickPressed(axes, pauseMenu) {

    }



    // placeholder - pause menu does not control inventory scrolling
    static handleScroll() {
    }


    static handleClick(p5, optionsMenu) {
        if(optionsMenu.dropdown.mouseClick(p5)) {
            p5.windowResized();
            return;
        }
        optionsMenu.gameState.showOptions = false;

    }

}

export {OptionsModel, OptionsLogic, OptionsRenderer};

if (typeof module !== 'undefined') {
    module.exports = {OptionsModel, OptionsLogic, OptionsRenderer};
}