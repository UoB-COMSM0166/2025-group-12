```mermaid
sequenceDiagram
    participant User as 使用者
    participant p5 as p5.js 繪圖函式庫
    participant Main as Main.js (主控制)
    participant Preloader as Preloader.js (資源加載)
    participant Controller as Controller.js (遊戲控制器)
    participant GameState as GameState.js (遊戲狀態)
    participant StartMenu as StartMenu.js (開始選單)
    participant StandbyMenu as StandbyMenu.js (待機選單)
    participant Play as Play.js (遊戲場景)
    participant BoardCells as BoardCells.js (遊戲地圖)
    participant Inventory as Inventory.js (物品管理)

    User ->> p5: 開啟遊戲 (p5.js 初始化)
    activate p5
    p5 ->> Main: 執行 `setup()`
    activate Main

    Main ->> Preloader: 執行 `preload()` (載入遊戲圖片)
    activate Preloader
    Preloader -->> Main: 返回 `images`
    deactivate Preloader

    Main ->> Controller: 創建 `Controller(images)`
    activate Controller

    Controller ->> GameState: 創建 `GameState(images)`
    activate GameState
    GameState -->> Controller: 初始化完成
    deactivate GameState

    Controller ->> StartMenu: 創建 `StartMenu`
    activate StartMenu
    StartMenu -->> Controller: 初始化完成
    deactivate StartMenu

    Controller ->> StandbyMenu: 創建 `StandbyMenu`
    activate StandbyMenu
    StandbyMenu -->> Controller: 初始化完成
    deactivate StandbyMenu

    Controller ->> Play: 創建 `PlayBoard`
    activate Play
    Play ->> BoardCells: 創建 `BoardCells`
    activate BoardCells
    BoardCells -->> Play: 初始化地圖
    deactivate BoardCells
    Play -->> Controller: 初始化完成
    deactivate Play

    Controller -->> Main: `setup()` 完成
    deactivate Controller
    deactivate Main

    User ->> p5: 滑鼠點擊
    activate p5
    p5 ->> Controller: `clickListener()`
    activate Controller

    Controller ->> GameState: `getState()`
    GameState -->> Controller: 當前狀態

    alt 狀態為 MENU
        Controller ->> StartMenu: `handleClick()`
        StartMenu -->> Controller: 處理選單點擊
    else 狀態為 STANDBY
        Controller ->> StandbyMenu: `handleClick()`
        StandbyMenu -->> Controller: 進入遊戲
    else 狀態為 PLAY
        Controller ->> Play: `handleClick()`
        Play ->> Inventory: `handleClick()`
        Play ->> BoardCells: 點擊地圖格子
        Play -->> Controller: 處理點擊
    end

    Controller ->> GameState: 更新遊戲狀態
    GameState -->> Controller: 狀態更新完成
    Controller ->> p5: 重新繪製畫面
    deactivate Controller
    deactivate p5
