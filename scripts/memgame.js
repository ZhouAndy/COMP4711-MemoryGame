let minY = 4; //minimum number of tiles in y-axis is this value + 1
let minX = 5; //minimum number of times in x-axis

let numY = minY; // number of tiles in y-axis, initialized to minY
let numX = minX; // number of tiles in x-axis, initialized to minX
let max = 7; // max length of a row/column

let score = 1; //initialize score to 1
let numCorrectTiles = 4; //number of correct tiles
let remainingCorrectTiles; //number of unflipped correct tiles
let allCorrect = true; //boolean is true if no incorrect tiles were flipped during a round
let tileBoolArr = []; //array containing the boolean values of correct/incorrect for each tile
let scoreList = []; //array of previous scores

//Draws a board of tiles to play the memory game.
const drawBoard = (row, col) => {
    remainingCorrectTiles = numCorrectTiles;
    markTiles(row, col);
	let gameboard = document.getElementById('gameboard');

    for (let i = 0; i < row; i++) {

        let x = document.createElement('div');
        x.className = 'tile';
        
        let br = document.createElement('br');
        gameboard.appendChild(br);

        for (let j = 0; j < col; j++) {

            let y = document.createElement('div');
            y.className = 'tile';

            if (tileBoolArr[i][j]) {
                y.classList.add('true');
                x.classList.add('false');
            } else {
                y.classList.add('false');
                x.classList.add('false');
            }

            if (y.classList.contains('true')) {
                y.classList.add('trueRevealed');
                setTimeout(() => {
                    y.classList.remove('trueRevealed');
                    y.classList.add('hidden');
                }, 2000);
            }

            x.onclick = updateAfterFlip;
            y.onclick = updateAfterFlip;

            gameboard.appendChild(x);
            gameboard.appendChild(y);
        }
    }
}

//Mark tiles as being true/false
const markTiles = (tileX, tileY) => {

    //Set all tiles to false
    for(let i = 0; i < tileX; i++) {
        tileBoolArr[i] = [];
        for(let j = 0; j < tileY; j++) {
            tileBoolArr[i][j] = false;
        }
    }
    //Randomly assign which tiles are true up to numCorrectTiles
    for(let i = 0; i < numCorrectTiles; i++) {
        let x = Math.floor(Math.random() * tileX);
        let y = Math.floor(Math.random() * tileY);  
        if (!tileBoolArr[x][y]) {
            tileBoolArr[x][y] = true;
        } else {
            i--;
        } 
    }
}

//Flipping a tile
//set booleans and update score
function updateAfterFlip() {
    if (this.classList.contains('true')) {
        this.classList.remove('hidden');
        this.classList.add('trueRevealed');
        score++;
        remainingCorrectTiles--;

    } else if (this.classList.contains('false')) {
        this.classList.remove('hidden');
        this.classList.add('falseRevealed');
        score--;
        allCorrect = false;

        if(score < 1) {
            alert('Game over!');
            window.location = 'summary.html';
        }
    }

    //all correct tiles have been selected
    if (remainingCorrectTiles < 1) {
        setTimeout(() => {
            clearBoard();
        }, 2000);

        // playSound();

        setTimeout(function() {
            nextStage();
            let rotate = document.getElementById('gameboard');
            rotate.classList.remove('rotated');
        }, 5000);
    }
    document.getElementById('score').innerText = 'Score: ' + score;
}   

// Determine number of rows/columns required for next round of the game
const nextStage = () => {
    if (allCorrect) {
        if (numX < max && numY < max) {
            if (numX > numY) {
                numY++
            } else {
                numX++;
            }
            
        } 
    } else {
        if (numX <= minX && numY <= minY) {
            numX = minX;   
        } else {
            if (numX > numY) {
                numX--;
            } else {
                numY--;
            }
            
        }  
    }
    allCorrect = true;
    markTiles(numX, numY);
    drawBoard(numX, numY);
    setTimeout(() => {
        rotateBoard();
    }, 3000);
}

//Terminates the game.
const terminate = () => {
    if (confirm('Terminating will quit the game, are you sure you want to quit?')) {
        localStorage.setItem("Score", score);
        
        if(localStorage.getItem("scoreList")) {
            scoreList = JSON.parse(localStorage.getItem("scoreList"));
        }
        scoreList.push(score);
        localStorage.setItem("scoreList", JSON.stringify(scoreList));
        window.location = 'summary.html';
    }
}

//Rotates the board 90 degrees
const rotateBoard = () => {
    let board = document.getElementById('gameboard');
    board.classList.remove('rotated');
    board.classList.add('rotated');
}

//Clear all tiles from the board
const clearBoard = () => {
    const board = document.getElementById('gameboard');
    while(board.hasChildNodes()) {
        board.removeChild(board.firstChild);
    }
}

//Plays audio. Called when we refresh the matrix. 
const playAudio = () => {
    let audio = document.getElementById('soundTest');
    audio.play();
}

//Initialize board on loading of page.
window.addEventListener('load', () => {
    drawBoard(numX, numY);
    setTimeout(() => {
        this.onclick = false;
        rotateBoard();
    }, 3000);
});