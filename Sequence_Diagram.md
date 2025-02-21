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
    participant FloatingWindow as FloatingWindow.js (浮動提示)
    participant GameSave as GameSave.js (遊戲存檔)
    participant EnemyAI as Astar.js (敵人 AI)

    %% 遊戲初始化
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

    %% 使用者互動：點擊遊戲畫面
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

    %% 存檔/讀取機制
    User ->> GameSave: 點擊 "存檔"
    activate GameSave
    GameSave ->> GameState: 讀取當前遊戲狀態
    GameSave ->> Inventory: 讀取玩家物品
    GameSave ->> Play: 讀取遊戲地圖
    GameSave -->> localStorage: 存入遊戲存檔
    GameSave -->> User: 存檔成功通知
    deactivate GameSave

    User ->> GameSave: 點擊 "讀取存檔"
    activate GameSave
    GameSave -->> localStorage: 讀取存檔
    GameSave ->> GameState: 載入遊戲狀態
    GameSave ->> Inventory: 載入玩家物品
    GameSave ->> Play: 載入遊戲地圖
    GameSave -->> User: 讀取成功通知
    deactivate GameSave

    %% 遊戲流程：敵人回合
    Play ->> GameState: `endTurn()`
    activate GameState
    GameState -->> Play: 進入敵人回合
    deactivate GameState

    Play ->> EnemyAI: `nextTurnItems()`
    activate EnemyAI
    EnemyAI ->> BoardCells: 獲取敵人資訊
    EnemyAI ->> Play: 計算敵人移動 (A* 搜索)
    deactivate EnemyAI

    Play ->> BoardCells: 更新敵人位置
    Play ->> GameState: 檢查是否有敵人攻擊
    GameState -->> Play: 傳回攻擊結果
    Play ->> FloatingWindow: 顯示戰鬥資訊

    %% 回合推進機制
    Play ->> Play: `updateTurn()`
    activate Play
    Play ->> BoardCells: 更新植物與種子狀態
    Play ->> Inventory: 獲取可用物品
    Play ->> FloatingWindow: 顯示回合開始提示
    deactivate Play

    %% 玩家互動：物品使用
    User ->> Inventory: 選擇物品
    activate Inventory
    Inventory -->> Play: 更新玩家的道具狀態
    Play ->> BoardCells: 放置植物
    Play ->> FloatingWindow: 顯示放置植物的通知
    deactivate Inventory

    %% 玩家行動：回合推進
    User ->> Play: 點擊 "結束回合"
    activate Play
    Play ->> GameState: 觸發敵人回合
    Play ->> FloatingWindow: 顯示回合結束提示
    deactivate Play

    %% 遊戲結束邏輯
    Play ->> GameState: `checkGameOver()`
    GameState -->> Play: 確認遊戲是否結束
    alt 遊戲結束
        Play ->> FloatingWindow: 顯示 "Stage Cleared!"
        FloatingWindow -->> User: 顯示遊戲完成提示
        User ->> StartMenu: 返回主選單
        GameState ->> GameState: 變更狀態 `stateCode.FINISH`
    else 遊戲繼續
        Play ->> GameState: 進入玩家回合
    end
