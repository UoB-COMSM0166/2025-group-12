const canvas = document.getElementById('canvas1');  // 取得 HTML頁面中 id="canvas1"中的 <canvas>標籤
const ctx = canvas.getContext('2d');  // 用於 2D 的繪圖API，因欸Canvas本身不會畫圖，適合基本形狀、文字、影像
canvas.width = 900;
canvas.height = 600;
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

// global variables
const cellSize=100;  // 每個網格（Cell）的寬度與高度都是 100 px
const cellGap=3;  // 定義網格之間的間距，目前沒有實際使用
const gameGrid=[];  // 存放所有 Cell物件的陣列，用來儲存遊戲中的網格
const defenders = [];
let numberOfResources = 300;

// mouse 滑鼠物件
const mouse = {
    x: undefined,  // 滑鼠 x座標，初始設定未定義
    y: undefined,  // 滑鼠 y座標，初始設定未定義
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();  
// canvas.getBoundingClientRect() 會返回 Canvas在整個視窗內的位置資訊
//    {
//        x: 100,
//        y: 50,
//        width: 900,
//        height: 600,
//        top: 50,
//        left: 100,
//        right: 1000,
//        bottom: 650
//    }

canvas.addEventListener('mousemove', function(e){
    // console.log('滑鼠座標：(${e.x}, ${e.y})');
    
    // 控制滑鼠座標為 滑鼠相對於 canvas上的內部座標（mouse.x, mouse.y）
    mouse.x = e.x - canvasPosition.left;  // e.x: 滑鼠相對於視窗的 x座標
    mouse.y = e.y - canvasPosition.top;  // e.y: 滑鼠相對於視窗的 y座標
});
canvas.addEventListener('mouseleave', function(){
    // 當滑鼠離開 canvas時，把 mouse.x 和 mouse.y 設為 undefined
    // 當滑鼠離開 canvas 時，不會繼續偵測滑鼠位置
    mouse.x = undefined;
    mouse.y = undefined;
});

// game board 控制面板
const controlsBar = {
    width: canvas.width,  // 控制面板寬度 = Canvas的寬度
    height: cellSize,  // 控制面板高度 = cellSize (100px)
}

// The Element of grid: 每個 Cell代表一個方格
class Cell {
    constructor(x,y){
        this.x = x;  // 方格左上角的 x座標
        this.y = y;  // 方格左上角的 y座標
        this.width = cellSize;  // 方格寬度 100px
        this.height = cellSize;  // 方格高度 100px
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle='black';  // 設定邊框顏色
            ctx.strokeRect(this.x, this.y, this.width, this.height);   // strokeRect(x,y,width,height): 在(this.x,this.y)的位置，畫出長寬為100px的方形邊框
        }
    }
}

// 建立網格：填滿 gameGrid陣列，建立網格
function createGrid(){
    for (let y=cellSize; y < canvas.height; y += cellSize){  // 跳過第一行：y=cellSize
        for (let x=0; x < canvas.width; x+=cellSize){
            gameGrid.push(new Cell(x,y));  // 在 (x,y)位置創建一個 Cell物件，並加入 gameGird陣列
        }
    }
}

// projectiles
// defenders
class Defneder {
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=cellSize;
        this.height=cellSize;
        this.shooting=false;
        this.mp=100;
        this.projectiles = [];
        this.timer=0;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.mp), this.x, this.y);
    }
}
canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);

    if (gridPositionY < cellSize) return;

    for (let i=0; i< defenders.length; i++){
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }

    let defenderCost=100;
    if (numberOfResources >= defenderCost){
        defenders.push(new Defneder(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});
function handleDefenders(){
    for (let i=0; i < defenders.length; i++) {
        defenders[i].draw();
    }
}

// enemies
// resources


// 繪製網格：遍歷 gameGrid陣列中的每個 Cell物件，並且呼叫 draw()方法來繪製
function handleGameGrid(){
    /* 可簡化
    for (let i=0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
    */
    gameGrid.forEach(cell => cell.draw());  // 使用 forEach 代替 for 迴圈
    // 可以使用 gameGrid.forEach(function(cell){cell.draw()}); 替代
    // gameGrid.forEach() 會對陣列中的每一個元素執行一次函數，不需要 index variable: i.
}



// utilities
function handleGameStatus(){
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Resources: '+numberOfResources, 20, 55);
}

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle='blue';
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height);  // 在 (0,0) 繪製 藍色方框作為 game board
    handleGameGrid();  // 調用 handleGameGrid() 繪製所有網格
    handleDefenders();
    handleGameStatus();
    requestAnimationFrame(animate);  // 讓 animate()每秒自動執行60次，實現動畫
}
animate();

function collision(first, second){
    if (
        !(
            first.x > second.x+second.width || first.x+first.width < second.x ||
            first.y > second.y+second.height || first.y+first.height < second.y
         )
    ) {
        return true;
    };
}


// Initalize
createGrid();
console.log(gameGrid);
console.table(gameGrid);