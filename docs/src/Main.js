// import {Controller} from "./controller/Controller.js";
// import {CanvasSize} from "./CanvasSize.js";
// import {loadImages, loadSounds} from "./Preloader.js";
// import {
//     analogStickMoved, analogStickPressed,
//     anyGamepadButtonPressed,
//     pollGamepad
// } from "./model/Gamepad.js";

// // const REFERENCE_WIDTH = CanvasSize.canvasWidth;    // 預設 1280
// // const REFERENCE_HEIGHT = CanvasSize.canvasHeight;  // 預設 720
// // let scaleFactor = 1; // 等比例縮放倍率


// new p5((p) => {

//     p.preload = () => {
//         p.images = loadImages(p);
//         p.soundFormats('mp3');
//         p.mySounds = loadSounds(p);
//         // p.gamepadX = CanvasSize.getSize()[0]/2;
//         // p.gamepadY = CanvasSize.getSize()[1]/2;
        
//         // 修改：改用全螢幕計算畫布中心
//         p.gamepadX = p.windowWidth / 2;
//         p.gamepadY = p.windowHeight / 2;
//         p.mouseSpeed = 20;
//     };

//     p.setup = () => {
//         // let canvasSize = CanvasSize.getSize();
//         // p.createCanvas(canvasSize[0], canvasSize[1]);

//         // 修改：使用 p.windowWidth 與 p.windowHeight 建立全螢幕畫布
//         let canvasSize = [p.windowWidth, p.windowHeight];
//         p.createCanvas(canvasSize[0], canvasSize[1]);
//         CanvasSize.setSize(canvasSize[0], canvasSize[1]); // 新增這一行


//         p.controller = new Controller(p);
//         p.controller.setup(p);

//         anyGamepadButtonPressed( (index) => {
//             if(p.controller && p.controller.gameState.mode !== "gamepad") {
//                 p.controller.gameState.mode = "gamepad";
//                 for (const [key, value] of Object.entries(p.controller.menus)) {
//                     if(!value) continue;
//                     value.setupGamepad(p);
//                 }
//                 p.controller.pauseMenu.setupGamepad(p);
//                 console.log("Input mode changed to gamepad");
//                 return;
//             }
//             if(index === 0) p.controller.clickListener(p);
//             else p.controller.gamepadListener(index);
//         });

//         analogStickMoved((axes) => {
//            p.controller.analogStickListener(axes, p);
//         });

//         analogStickPressed((axes) => {
//             if(p.controller && p.controller.gameState.mode !== "gamepad") {
//                 p.controller.gameState.mode = "gamepad";
//                 for (const [key, value] of Object.entries(p.controller.menus)) {
//                     if(!value) continue;
//                     value.setupGamepad(p);
//                 }
//                 p.controller.pauseMenu.setupGamepad(p);
//                 console.log("Input mode changed to gamepad");
//                 return;
//             }
//             p.controller.analogStickPressedListener(axes);
//         })

//         // updateScaleFactor();
//     };

//     // 修改：加入 windowResized 事件，動態調整畫布大小與更新 CanvasSize
//     p.windowResized = () => {
//         let canvasSize = [p.windowWidth, p.windowHeight];
//         p.resizeCanvas(canvasSize[0], canvasSize[1]);
//         CanvasSize.setSize(canvasSize[0], canvasSize[1]);
//         // 根據需要，可能也要重置或重新佈局部分元件：
//         if (p.controller && p.controller.reset) {
//             p.controller.reset(p);
//         }
//     };

//     p.mouseWheel = (event) => {
//         if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
//             p.controller.gameState.mode = "mouse";
//             for (const [key, value] of Object.entries(p.controller.menus)) {
//                 if(!value) continue;
//                 value.setupMouse(p);
//             }
//             p.controller.pauseMenu.setupMouse(p);
//             console.log("Input mode changed to mouse");
//             return;
//         }
//         p.controller.scrollListener(p, event);
//     }

//     p.mouseClicked = () => {
//         if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
//             p.controller.gameState.mode = "mouse";
//             for (const [key, value] of Object.entries(p.controller.menus)) {
//                 if(!value) continue;
//                 value.setupMouse(p);
//             }
//             p.controller.pauseMenu.setupMouse(p);
//             console.log("Input mode changed to mouse");
//             return;
//         }
//         p.controller.clickListener(p);
//     }

//     p.mouseMoved = () => {
//         if(p.controller && p.controller.gameState.mode !== "mouse") {
//             p.controller.gameState.mode = "mouse";
//             for (const [key, value] of Object.entries(p.controller.menus)) {
//                 if(!value) continue;
//                 value.setupMouse(p);
//             }
//             p.controller.pauseMenu.setupMouse(p);
//             console.log("Input mode changed to mouse");
//         }
//     }

//     p.draw = () => {
//         p.background(100);

//         pollGamepad(p, p.controller.menus[p.controller.gameState.getState()], p.controller.saveState);

//         // create play stage
//         p.controller.setPlayStage(p);

//         // when game state changes, load or save data accordingly
//         p.controller.setData(p, p.controller.gameState.getState());

//         // replace following tmp view handling later
//         p.controller.view(p);

//         // keep a copy of current state
//         p.controller.saveState = p.controller.gameState.getState();
//     };

// });


import {Controller} from "./controller/Controller.js";
import {CanvasSize} from "./CanvasSize.js";
import {loadImages, loadSounds} from "./Preloader.js";
import {
    analogStickMoved, analogStickPressed,
    anyGamepadButtonPressed,
    pollGamepad
} from "./model/Gamepad.js";

// 1) 先定義參考解析度
const REFERENCE_WIDTH = 1280;
const REFERENCE_HEIGHT = 720;

// 保存當前實際顯示的 canvas 寬高
let canvasWidth, canvasHeight, scaleFactor;

// 記錄上一幀的視窗尺寸，用來檢查是否需要即時更新
let lastWindowWidth = 0, lastWindowHeight = 0;


new p5((p) => {

    // 計算並更新 canvas 大小
    const updateCanvasSize = () => {
        // 2) 根據視窗大小計算等比例縮放
        let scaleX = p.windowWidth / REFERENCE_WIDTH;
        let scaleY = p.windowHeight / REFERENCE_HEIGHT;
        let scaleFactor = Math.min(scaleX, scaleY); 
        // 例如：視窗太寬時，scaleFactor 由視窗的高度決定；太高時反之

        // 3) 實際顯示的畫布大小
        canvasWidth = Math.floor(REFERENCE_WIDTH * scaleFactor);
        canvasHeight = Math.floor(REFERENCE_HEIGHT * scaleFactor);
    };


    p.preload = () => {
        p.images = loadImages(p);
        p.soundFormats('mp3');
        p.mySounds = loadSounds(p);

        // p.gamePadX = p.windowWidth / 2;
        // p.gamePadY = p.windowHeigh / 2;

        // 遊戲手把預設位置，這裡可依情況調整
        p.gamepadX = REFERENCE_WIDTH / 2;
        p.gamepadY = REFERENCE_HEIGHT / 2;

        p.mouseSpeed = 20;
    };

    p.setup = () => {
        // let canvasSize = [p.windowWidth, p.windowHeight];
        // p.createCanvas(canvasSize[0], canvasSize[1]);
        // CanvasSize.setSize(canvasSize[0], canvasSize[1]);

        updateCanvasSize(p);  // 計算初始 canvas 大小
        p.createCanvas(canvasWidth, canvasHeight);
        // 把 canvs 大小記錄在 CanvasSize 模組
        CanvasSize.setSize(canvasWidth, canvasHeight);


        p.controller = new Controller(p);
        p.controller.setup(p);

        anyGamepadButtonPressed( (index) => {
            if(p.controller && p.controller.gameState.mode !== "gamepad") {
                p.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(p.controller.menus)) {
                    if(!value) continue;
                    value.setupGamepad(p);
                }
                p.controller.pauseMenu.setupGamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            if(index === 0) p.controller.clickListener(p);
            else p.controller.gamepadListener(index);
        });

        analogStickMoved((axes) => {
           p.controller.analogStickListener(axes, p);
        });

        analogStickPressed((axes) => {
            if(p.controller && p.controller.gameState.mode !== "gamepad") {
                p.controller.gameState.mode = "gamepad";
                for (const [key, value] of Object.entries(p.controller.menus)) {
                    if(!value) continue;
                    value.setupGamepad(p);
                }
                p.controller.pauseMenu.setupGamepad(p);
                console.log("Input mode changed to gamepad");
                return;
            }
            p.controller.analogStickPressedListener(axes);
        })

    };

    p.mouseWheel = (event) => {
        if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
            return;
        }
        p.controller.scrollListener(p, event);
    }

    p.mouseClicked = () => {
        if(p.controller.gameState && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
            return;
        }
        p.controller.clickListener(p);
    }


    // 監聽瀏覽器視窗變化，重新計算等比例畫布大小
    p.windowResized = () => {
        updateCanvasSize(p);
        p.resizeCanvas(canvasWidth, canvasHeight);
        CanvasSize.setSize(canvasWidth, canvasHeight);

        if (p.controller && p.controller.reset) {
            p.controller.reset(p);
        }

        // 重新布局或 reset
        if (p.controller && p.controller.reset) {
            p.controller.reset(p);
        }
    };


    p.mouseMoved = () => {
        if(p.controller && p.controller.gameState.mode !== "mouse") {
            p.controller.gameState.mode = "mouse";
            for (const [key, value] of Object.entries(p.controller.menus)) {
                if(!value) continue;
                value.setupMouse(p);
            }
            p.controller.pauseMenu.setupMouse(p);
            console.log("Input mode changed to mouse");
        }
    }
    p.draw = () => {
        p.background(100);

        // 【實時更新】在每一幀中檢查視窗尺寸是否改變，如果改變則更新畫布尺寸
        if (p.windowWidth !== lastWindowWidth || p.windowHeight !== lastWindowHeight) {
            updateCanvasSize(p);
            p.resizeCanvas(canvasWidth, canvasHeight);
            CanvasSize.setSize(canvasWidth, canvasHeight);
            if (p.controller && p.controller.reset) {
                p.controller.reset(p);
            }
            // 更新最後記錄的視窗尺寸
            lastWindowWidth = p.windowWidth;
            lastWindowHeight = p.windowHeight;
        }
        


        // 將所有繪圖全局縮放，保持 16:9 參考邏輯
        p.push();
        p.scale(scaleFactor); 

        pollGamepad(p, p.controller.menus[p.controller.gameState.getState()], p.controller.saveState);

        // create play stage
        p.controller.setPlayStage(p);

        // when game state changes, load or save data accordingly
        p.controller.setData(p, p.controller.gameState.getState());

        // replace following tmp view handling later
        p.controller.view(p);

        // keep a copy of current state
        p.controller.saveState = p.controller.gameState.getState();

        p.pop();  // 結束縮放
    };
});