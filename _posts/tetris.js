
const width_canvas = 200
const height_canvas = 400
const num_rows = 20
const num_cols = 10
const length_sq = width_canvas / num_cols
const color_vacant = 'white'

const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const scoreBoard = document.getElementById("scoreBoard");
const ctx_score = scoreBoard.getContext("2d");
ctx_score.font = "15px Arial";
ctx_score.fillStyle = "#000000"
ctx_score.textAlign = "center";
ctx_score.fillText("Wellcome", 40, 25);

function updateScoreBoard() {
    ctx_score.fillStyle = 'white'
    ctx_score.fillRect(0, 0, 80, 50);
    ctx_score.fillStyle = 'black'
    ctx_score.fillText("score : " + score, 40, 25);
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * length_sq, y * length_sq, length_sq, length_sq);
    ctx.strokeStyle = "black"
    ctx.strokeRect(x * length_sq, y * length_sq, length_sq, length_sq);
}

function initBoard() {
    let board = [];
    for (var i = 0; i < num_cols; i++) {
        board[i] = [];
        for (var j = 0; j < num_rows; j++) {
            board[i][j] = color_vacant;
        }
    }
    return board;
}

function drawBoard(board) {
    for (var i = 0; i < num_cols; i++) {
        for (var j = 0; j < num_rows; j++) {
            drawSquare(i, j, board[i][j]);
        }
    }
}

function rotate(shape, length) {
    let ret = [];
    for (var i = 0; i < length; i++) {
        ret[i] = [];
    }

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            ret[i][j] = shape[length - j - 1][i];
        }
    }
    return ret;
}

function isVacantPos(x, y) {
    return 0 <= x && x < num_cols && 0 <= y && y < num_rows && board[x][y] == color_vacant;
}

function drawBlock(x, y, shape, color) {
    const length = shape.length;
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            if (shape[i][j]) {
                drawSquare(x + i, y + j, color);
            }
        }
    }
}

function cleanLines() {
    let num_cleaned = 0;
    for (let i = num_rows - 1; i >= 0; i--) {
        let isLineFull = true;
        for (let j = 0; j < num_cols; j++) {
            if (board[j][i] == color_vacant) {
                isLineFull = false;
                break;
            }
        }

        if (isLineFull) {
            num_cleaned++;
            for (let k = i; k > 0; k--) {
                for (let j = 0; j < num_cols; j++) {
                    board[j][k] = board[j][k - 1];
                }
            }
            i++;
        }
    }
    return num_cleaned;
}

function activeBlock(tet_idx, x, y) {
    this.shape = tetrominos[tet_idx].shape,
        this.color = tetrominos[tet_idx].color,
        this.x = x,
        this.y = y,
        this.canMove = function (dx, dy) {
            const length = this.shape.length
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (this.shape[i][j] && !isVacantPos(this.x + i + dx, this.y + j + dy)) {
                        return false;
                    }
                }
            }
            return true;
        },

        this.move = function (dx, dy) {
            const length = this.shape.length
            if (this.canMove(dx, dy)) {
                drawBlock(this.x, this.y, this.shape, color_vacant);
                this.x += dx;
                this.y += dy;
                drawBlock(this.x, this.y, this.shape, this.color);
                return true;
            }
            else {
                return false;
            }
        },
        this.draw = function () {
            drawBlock(this.x, this.y, this.shape, this.color);
        }
    this.attach = function () {
        const length = this.shape.length
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (this.shape[i][j]) {
                    board[this.x + i][this.y + j] = this.color;
                }
            }
        }
    }

    this.canRotate = function () {
        this.shape = rotate(this.shape, this.shape.length);
        let canRo = this.canMove(0, 0);

        this.shape = rotate(this.shape, this.shape.length);
        this.shape = rotate(this.shape, this.shape.length);
        this.shape = rotate(this.shape, this.shape.length);

        return canRo;
    }

    this.rotate = function () {
        if (this.canRotate()) {
            drawBlock(this.x, this.y, this.shape, color_vacant);
            this.shape = rotate(this.shape, this.shape.length);
            drawBlock(this.x, this.y, this.shape, this.color);
        }
    }
    this.fall = function () {
        const length = this.shape.length
        while (this.canMove(0, 1)) {
            drawBlock(this.x, this.y, this.shape, color_vacant);
            this.y += 1;
            drawBlock(this.x, this.y, this.shape, this.color);
        }
    }
}

let board = initBoard();
console.log(board)

drawBoard(board);

let tetrominos = [];
tetrominos[0] = { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: 'blue' };
tetrominos[1] = { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: 'indigo' };
tetrominos[2] = { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: 'green' };
tetrominos[3] = { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: 'purple' };
tetrominos[4] = { shape: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], color: 'red' };
tetrominos[5] = { shape: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], color: 'gray' };
tetrominos[6] = { shape: [[1, 1, 0], [1, 1, 0], [0, 0, 0]], color: 'brown' };
console.log(tetrominos);

let isGameOver = false;

let score = 0;

let randomIdx = Math.floor(Math.random() * 7);
let currBlock = new activeBlock(randomIdx, num_cols / 2 - 2, 0);
currBlock.draw();

let isAttached = false;
let dropStart = Date.now();
function drop() {
    let now = Date.now();
    let delta_drop = now - dropStart;
    if (delta_drop > 1000) {
        isAttached = currBlock.move(0, 1) == false;
        dropStart = Date.now();
    }
    if (isAttached) {
        if (currBlock.y == 0) {
            isGameOver = true;
        }

        currBlock.attach();
        console.log(board);
        drawBoard(board);

        score += Math.pow(cleanLines(), 2) * 10;
        updateScoreBoard();
        drawBoard(board);

        randomIdx = Math.floor(Math.random() * 7);
        currBlock = new activeBlock(randomIdx, num_cols / 2 - 2, 0);

        isAttached = false;
    }

    if (!isGameOver) {
        requestAnimationFrame(drop);
    }
    else {
        alert("Game Over!!");
    }
}
drop();

document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
    if (event.keyCode == 37) {
        currBlock.move(-1, 0);
    }
    else if (event.keyCode == 38) {
        currBlock.rotate();
    }
    else if (event.keyCode == 39) {
        currBlock.move(+1, 0);
    }
    else if (event.keyCode == 40) {
        currBlock.move(0, +1);
    }
    else if (event.keyCode == 32) {
        currBlock.fall();
        isAttached = true;
    }
}
