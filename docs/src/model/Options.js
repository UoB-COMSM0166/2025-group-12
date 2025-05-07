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
        let [dropdownWidth, dropdownHeight] = OptionsModel.utilityClass.relative2absolute(0.1, 0.05);
        let [dropdownX, dropdownY] = OptionsModel.utilityClass.relative2absolute(0.49, 0.38);
        this.dropdown = new OptionsModel.Dropdown(dropdownX, dropdownY, dropdownWidth, dropdownHeight);
    }

    shift2Gamepad(p5) {
        p5.noCursor();
        this.dropdown.mode = "gamepad";
    }

    shift2Mouse(p5) {
        p5.cursor();
        this.dropdown.mode = "mouse";
        this.dropdown.isSelected = false;
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
        [textX, textY] = OptionsRenderer.utilityClass.relative2absolute(0.45, 0.4);

        // Draw the three main panels
        let [panelWidth, panelHeight] = OptionsRenderer.utilityClass.relative2absolute(0.2, 0.5);
        let [panelX, panelY] = OptionsRenderer.utilityClass.relative2absolute(0.2, 0.3);

        // Panel headers
       // p5.textSize(18);
        p5.textAlign(p5.CENTER, p5.CENTER);

        // First panel
        OptionsRenderer.drawPanel(p5,panelX, panelY, panelWidth, panelHeight, "Gameplay");

        // Second panel
        OptionsRenderer.drawPanel(p5,panelX + panelWidth, panelY, panelWidth, panelHeight, "Video");

        // Third panel
        OptionsRenderer.drawPanel(p5,panelX + 2 * panelWidth, panelY, panelWidth, panelHeight, "Gamepad");

        p5.textSize(fontSizes.letter);
        p5.text("resolution: ", textX, textY);
        optionsMenu.dropdown.draw(p5);

    }


    static drawPanel(p5, x, y, width, height, title) {
        // Panel background
        p5.fill("rgba(13,15,23,0.66)");
        p5.noStroke();
        p5.rect(x, y, width, height, 3);

        // Panel border
        p5.stroke(80, 120, 160);
        p5.strokeWeight(1);
        p5.noFill();
        p5.rect(x, y, width, height, 3);

        // Panel title
        p5.textSize(OptionsRenderer.utilityClass.getFontSize().letter);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(255);
        p5.noStroke();
        p5.text(title, x + width/2, y + OptionsRenderer.utilityClass.relative2absolute(0.015, 0.5)[0]);
    }


}

class OptionsLogic {
    static setup(bundle) {
        /** @type {typeof ScreenLogic} */
        OptionsLogic.ScreenLogic = bundle.ScreenLogic;
        OptionsLogic.FloatingWindow = bundle.FloatingWindow;
    }


    static cancel(optionsMenu) {
        if(optionsMenu.dropdown.isOpen) {
            optionsMenu.dropdown.isOpen = false;
            optionsMenu.dropdown.index = optionsMenu.dropdown.options.indexOf(optionsMenu.dropdown.selectedOption);
            return;
        }
        else if(optionsMenu.gameState.showOptions){
            optionsMenu.gameState.showOptions = false
        }
    }


    static handleGamepad(index, optionsMenu){
        switch (index) {
            case 1:
                OptionsLogic.cancel(optionsMenu);
                break;
            case 12:
                if(optionsMenu.dropdown.isSelected === false) {
                    optionsMenu.dropdown.isSelected = true;
                    return;
                }
                if(optionsMenu.dropdown.isSelected) {
                    if(optionsMenu.dropdown.index ===0 ) optionsMenu.dropdown.index = optionsMenu.dropdown.options.length - 1;
                    else optionsMenu.dropdown.index -= 1;
                }
                break;
            case 13:
                if(optionsMenu.dropdown.isSelected === false) {
                    optionsMenu.dropdown.isSelected = true;
                    return;
                }
                if(optionsMenu.dropdown.isSelected) {
                    if(optionsMenu.dropdown.index === optionsMenu.dropdown.options.length - 1) optionsMenu.dropdown.index = 0;
                    else optionsMenu.dropdown.index += 1;
                }
                break;
        }

    }

    static handleAnalogStick(p5, axes, pauseMenu) {

    }


    static handleAnalogStickPressed(axes, optionsMenu) {
        if (axes[1] < 0) {
            if(optionsMenu.dropdown.isSelected === false) {
                optionsMenu.dropdown.isSelected = true;
                return;
            }
            if(optionsMenu.dropdown.isSelected) {
                if(optionsMenu.dropdown.index ===0 ) optionsMenu.dropdown.index = optionsMenu.dropdown.options.length - 1;
                else optionsMenu.dropdown.index -= 1;
            }
        } else {
            if(optionsMenu.dropdown.isSelected === false) {
                optionsMenu.dropdown.isSelected = true;
                return;
            }
            if(optionsMenu.dropdown.isSelected) {
                if(optionsMenu.dropdown.index === optionsMenu.dropdown.options.length - 1) optionsMenu.dropdown.index = 0;
                else optionsMenu.dropdown.index += 1;
            }
        }
    }



    // placeholder - pause menu does not control inventory scrolling
    static handleScroll() {
    }


    static handleClick(p5, optionsMenu) {
        if(optionsMenu.dropdown.mouseClick(p5)) {
            p5.windowResized();
            return;
        }
        if(optionsMenu.gameState.mode==="mouse") optionsMenu.gameState.showOptions = false;

    }

    static resize(optionsMenu){
        let [dropdownWidth, dropdownHeight] = OptionsModel.utilityClass.relative2absolute(0.1, 0.05);
        let [dropdownX, dropdownY] = OptionsModel.utilityClass.relative2absolute(0.49, 0.38);
        optionsMenu.dropdown.x = dropdownX;
        optionsMenu.dropdown.y = dropdownY;
        optionsMenu.dropdown.width = dropdownWidth;
        optionsMenu.dropdown.height = dropdownHeight;
    }

}

export {OptionsModel, OptionsLogic, OptionsRenderer};

if (typeof module !== 'undefined') {
    module.exports = {OptionsModel, OptionsLogic, OptionsRenderer};
}