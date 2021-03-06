const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById('scoreBoard')
const ctx_score = scoreBoard.getContext('2d')
ctx_score.font = "15px Arial";
ctx_score.fillStyle = "#000000"
ctx_score.textAlign = "center";
ctx_score.fillText("Tetris", 40, 25);
const canvas_width = 200;
const canvas_height = 400;
const num_cols = 10;
const num_rows = 20;
const sq_width = canvas_width/num_cols;
const sq_height = canvas_height/num_rows;
const num_blocks = 7;
const blocks = [
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,1,1,0],[0,0,0,0]],
    [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]
]
const block_Color = [
    "#2EFEF7",
    "#0101DF",
    "#FACC2E",
    "#F7FE2E",
    "#58FA58",
    "#8000FF",
    "#FF0000"
]
var board = []
var curBLockIdx;
var curX;
var curY;
var end = false;
var block = []
var score = 0;
var time = 300;
var nextBlockIdx;
document.addEventListener("keydown",keyDownHandler,false);
function drawSquare(x,y,color){
    ctx.fillStyle = color
    ctx.fillRect(x*sq_width,y*sq_height,sq_width,sq_height);
    ctx.strokeStyle = "black"
    ctx.strokeRect(x*sq_width,y*sq_height,sq_width,sq_height);
}
function updateScoreBoard(){
    ctx_score.fillStyle = "white"
    ctx_score.fillRect(0,0,80,50)
    ctx_score.fillStyle = "black"
    ctx_score.fillText("score : " + score,40,25);  
}
function updateNextBlock(){
    nextblock = blocks[nextBlockIdx];
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            if(nextblock[i][j]==1){
                ctx.fillStyle = block_Color[nextBlockIdx];
                ctx.fillRect(220+j*sq_width,i*sq_height+100,sq_width,sq_height);
            }
            else{ 
                ctx.fillStyle = "white"
                ctx.fillRect(220+j*sq_width,i*sq_height+100,sq_width,sq_height);
            }ctx.strokeStyle = "black"
            ctx.strokeRect(220+j*sq_width,i*sq_height+100,sq_width,sq_height);
        }
    }

}


function initBoard(){
    for(var i  = 0;i<num_rows;i++){
        board[i] = []
        for(var j = 0;j<num_cols;j++){
            board[i][j] = "white"
        }
    }
    curBLockIdx = Math.floor(7*Math.random());
    block = blocks[curBLockIdx];
    color = block_Color[curBLockIdx];
    curX = -1;
    curY = num_cols/2-1;
    end = false;
    nextBlockIdx = Math.floor(7*Math.random());
    drawBoard();
}
function drawBoard(){
    for(var i = 0;i<num_rows;i++){
        for(var j = 0;j<num_cols;j++){
            drawSquare(j,i,board[i][j])
        }
    }
}
function drawCurBlock(block,curX,curY,blockIdx){
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            if(block[i][j]==1){
                drawSquare(curY+j,curX+i,block_Color[blockIdx])           
            }
        }
    }
}
function blockRotate(block){
    var x = []
    for(var i = 0;i<4;i++){
        x[i] = []
        for(var j = 0;j<4;j++){
            x[i][j] = block[j][3-i]
        }
    }
    return x
}
function canBlockDown(block,x,y){
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            if(block[i][j]==1&&(x+i>=num_rows||y+j>=num_cols)) return false;
            if(block[i][j]==1&&board[x+i][y+j]!="white"){
                return false;
            }
        }
    }
    return true;
}
function deleteline(){
    var idx = 0;
    var arr = []
    for(var i = 0;i<num_rows;i++){
        var t = 0;
        for(var j = 0;j<num_cols;j++){
            if(board[i][j]!="white") t++; 
        }
        if(t==num_cols){
            arr[idx] = i;
            idx++;
        }
    }
    var t = idx-1;
    var x = 0;
    console.log(idx)
    for(var i =num_rows-1;i>=0;i--){
        if(arr[t]==i){
            for(var k = 0;k<num_cols;k++){
                board[i][k] = "white";
            }
            t--;
            x++;
            continue;
        }
        for(var j = 0;j<num_cols;j++){           
            board[i+x][j] = board[i][j]
        }
        
    }
    return idx;
}
function addBlockToBoard(block,curX,curY,curBLockIdx){
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            if(block[i][j]==1){
                board[curX+i][curY+j] = block_Color[curBLockIdx];
            }
        }
    }
}
function play() {
    drawBoard();
    if(canBlockDown(block,++curX,curY)){
        drawCurBlock(block,curX,curY,curBLockIdx);
    }
    else{
        if(curX==0) {end = true; return;}
        console.log(end)
        curX--;
        addBlockToBoard(block,curX,curY,curBLockIdx);
        tmp = deleteline()
        score += 100*tmp*tmp;
        updateScoreBoard();
        drawBoard();
        curBLockIdx = nextBlockIdx;
        nextBlockIdx = Math.floor(7*Math.random());
        updateNextBlock();
        block = blocks[curBLockIdx];
        color = block_Color[curBLockIdx];
        curX = -1;
        curY = num_cols/2-1;
    }
}
function keyDownHandler(e){
    if(e.keyCode == 40&&!end) play(); 
    if(e.keyCode == 38&&!end) {
        tmp=blockRotate(block);
        if(canBlockDown(tmp,curX,curY)){
            block = tmp;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);
        }
    }
    if(e.keyCode == 39&&!end) {
        if(canBlockDown(block,curX,curY+1)){
            curY++;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);  
        }
    } 
    if(e.keyCode == 37&&!end){
        if(canBlockDown(block,curX,curY-1)){
            curY--;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);
        }
    }

}

initBoard()
updateNextBlock();
playAlert = setInterval(function(){play(); if(end) {alert("game over!");clearInterval(playAlert);}},time)
