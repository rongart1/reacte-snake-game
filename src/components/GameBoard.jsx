import React, { useState, useEffect, useImperativeHandle } from 'react';
import portalImg from '../assests/portal.gif';
const GameBoard = ({ scoreDisplay, gameState, setGameState, teleporters }) => {
    let playerPositions = [new Position(2, 2)]; // Starting with one block at position (2,2)
    let playerDirection; // Starting direction is right
    let lastDirection; // Saves the last direction of the player
    let gameRunning = false;
    let score;
    let foodPosition = null;
    let teleporterPositions = [];

    const changeDirection = (keyCode) => {
        console.log(`change dir called with: ${keyCode}`);
        switch (keyCode) {
            case "KeyD":
            case "ArrowRight":
                if (lastDirection != "left") playerDirection = "right";
                break;
            case "KeyA":
            case "ArrowLeft":
                if (lastDirection != "right") playerDirection = "left";
                break;
            case "KeyW":
            case "ArrowUp":
                if (lastDirection != "down") playerDirection = "up";
                break;
            case "KeyS":
            case "ArrowDown":
                if (lastDirection != "up") playerDirection = "down";
                break;
            default:
                console.log("didn't catch movement key");
                break;
        }
        console.log(playerDirection);
    };
    

    // Adding event listener for change direction
    const handleKeyDown = (key) => {
        console.log(`Key pressed: ${key.code}`);
        changeDirection(key.code);
    };

    console.log("Adding event listener");
    document.addEventListener("keydown", handleKeyDown);

    const boardWidth = 15;
    const boardHeight = 15;
    let board = [];
    for (let row = 0; row < boardHeight; row++) {
        board.push([]);
        for (let col = 0; col < boardWidth; col++) {
            board[row].push({ row: row, col: col });
        }
    }

    const mappedBlocks = board.flat().map(block => (
        <div
            key={`row${block.row + 1}col${block.col + 1}`}
            className="board-block"
            id={`row${block.row + 1}col${block.col + 1}`}
        />
    ));

    const colorPlayer = () => {
        playerPositions.forEach((position) => {
            try {
                const current = document.getElementById(`row${position.row}col${position.col}`);
                current.style.backgroundColor = "black";
            } catch {
                // Handle error
            }
        });
    };

    const colorFood = () => {
        if (foodPosition) {
            try {
                const foodBlock = document.getElementById(`row${foodPosition.row}col${foodPosition.col}`);
                foodBlock.style.backgroundColor = "red";
            } catch {
                // Handle error
            }
        }
    };

    const generateFood = () => {
        let randomPos;
        do {
            randomPos = Position.generateRandomPos(boardHeight, boardWidth);
        } while (playerPositions.some(pos => pos.equals(randomPos)));

        foodPosition = randomPos;
        colorFood();
    };

    let lastPosition = null;

    const move = () => {
        const playerHead = playerPositions[0];
        const tail = playerPositions[playerPositions.length - 1];
        lastPosition = new Position(tail.row, tail.col); // Save the tail position

        // Moving the body
        for (let i = playerPositions.length - 1; i >= 1; i--) {
            playerPositions[i].col = playerPositions[i - 1].col;
            playerPositions[i].row = playerPositions[i - 1].row;
        }

        switch (playerDirection) { // Moving the head
            case "right":
                if (playerHead.col < 15) {
                    playerHead.col++;
                    lastDirection = "right";
                } else {
                    gameOver();
                }
                break;
            case "down":
                if (playerHead.row < 15) {
                    playerHead.row++;
                    lastDirection = "down";
                } else {
                    gameOver();
                }
                break;
            case "left":
                if (playerHead.col > 1) {
                    playerHead.col--;
                    lastDirection = "left";
                } else {
                    gameOver();
                }
                break;
            case "up":
                if (playerHead.row > 1) {
                    playerHead.row--;
                    lastDirection = "up";
                } else {
                    gameOver();
                }
                break;
            default:
                console.log("didn't move");
                break;
        }

        checkEat(); // After each move checking if you are on food and action based on it
        checkOverlap();
        if(teleporters){
            checkTeleport();
        }
    };

    const clearBlocks = () => {
        const allBlocks = document.querySelectorAll(".board-block");
        allBlocks.forEach(block => {
            const blockId = block.id;
            const blockPosition = Position.extractPositionFromString(blockId);
            if (!playerPositions.some(pos => pos.equals(blockPosition)) &&
                (!foodPosition || !foodPosition.equals(blockPosition))) {
                block.style.backgroundColor = "white";
            }
            if(!teleporterPositions.some(pos => pos.equals(blockPosition))){
                block.innerHTML="";
            }
        });

    };

    // Checking overlap and ending game if true
    const checkOverlap = () => {
        if (playerPositions.slice(1).some(pos => pos.equals(playerPositions[0]))) {
            gameOver();
        }
    };

    // Method for updating the gameState
    const updateGameState = () => {
        if (gameRunning)
            setGameState("running");
        else
            setGameState("gameOver");
    };

    useEffect(() => {
        if (gameState == "running" && !gameRunning) {
            reStartGame();
        }
    }, [gameState]);

    // Checks if the player ate and increase player size
    const checkEat = () => {
        if (foodPosition && playerPositions[0].equals(foodPosition)) {
            foodPosition = null;
            playerPositions.push(lastPosition);
            score += 200;
            scoreDisplay(score);
            generateFood();
        }
    };

    // Print the positions for debugging
    const printPositions = () => {
        let positons = [];
        playerPositions.forEach(pos => {
            positons.push(pos);
        });
        console.log(`food: ${foodPosition}`);
        console.log(`player: ${positons}`);
    };

    const gemerateTeleporter = () =>{
        let randomPos1;
        let randomPos2;
        do {
            randomPos1 = Position.generateRandomPos(boardHeight, boardWidth);
        } while (playerPositions.some(pos => pos.equals(randomPos1)));
        do {
            randomPos2 = Position.generateRandomPos(boardHeight, boardWidth);
        } while (playerPositions.some(pos => pos.equals(randomPos2)));

        teleporterPositions = [randomPos1,randomPos2];
        colorTeleporters();
    }

    const colorTeleporters = ()=>{
        if (teleporterPositions) {
            try {
                // Fetch the teleporter blocks
                const teleporterBlock1 = document.getElementById(`row${teleporterPositions[0].row}col${teleporterPositions[0].col}`);
                const teleporterBlock2 = document.getElementById(`row${teleporterPositions[1].row}col${teleporterPositions[1].col}`);
                
                teleporterBlock1.innerHTML=`<img class="portal-img" src=${portalImg} alt="portal" />` ;
                teleporterBlock2.innerHTML=`<img class="portal-img" src=${portalImg} alt="portal" />` ;
                
                
            } catch (error) {
                console.error("An error occurred while setting the teleporter blocks: ", error);
            }
            
        }
    }

    const checkTeleport = () =>{
        if(teleporterPositions.length =2){
            if(playerPositions[0].equals(teleporterPositions[0])){
                playerPositions[0].row = teleporterPositions[1].row;
                playerPositions[0].col = teleporterPositions[1].col;
                teleporterPositions=[];
            }
            else if(playerPositions[0].equals(teleporterPositions[1])){
                playerPositions[0].row = teleporterPositions[0].row;
                playerPositions[0].col = teleporterPositions[0].col;
                teleporterPositions=[];
            }
        }
        if(teleporterPositions.length==0){
            gemerateTeleporter();
        }
    }

    //starts game
    let intervals = [];
    const reStartGame = () => {
        if(teleporters){
            gemerateTeleporter();
        }
        clearBlocks();
        const gameTick = 200; // Game ticks every x milliseconds
        playerPositions = [new Position(2, 2)];
        generateFood(); // Generate initial food position
        intervals.push(setInterval(move, gameTick));
        intervals.push(setInterval(colorPlayer, gameTick));
        intervals.push(setInterval(clearBlocks, gameTick));
        intervals.push(setInterval(colorFood, gameTick));
        // intervals.push(setInterval(printPositions, gameTick)); //for debugging
        score = 0;
        scoreDisplay(score);
        gameRunning = true;
        intervals.push(setInterval(updateGameState, gameTick));
    };

    //does a wave effect on board
    const startWaveEffect = () => {
        clearBlocks(); // Clear any existing colors on the board
        let waveRow = 1; // Start the wave from the first row
        const waveInterval = setInterval(() => {
            if (waveRow <= boardHeight) {
                for (let col = 1; col <= boardWidth; col++) {
                    const block = document.getElementById(`row${waveRow}col${col}`);
                    if (block) {
                        block.style.backgroundColor = "darkgray";
                    }
                }
                waveRow++;
            } else {
                clearInterval(waveInterval); // Stop the wave once it reaches the last row
            }
        }, 100);
    };
    const newRecord = () =>{
        const currentRecord = localStorage.getItem("high-score")
        if(!currentRecord || currentRecord<score){
            localStorage.setItem("high-score",score);
        }
    }

    //ends game by ending all intervals
    const gameOver = () => {
        intervals.forEach(interval => {
            clearInterval(interval);
        });
        console.log("gameover");
        gameRunning = false;
        updateGameState();
        startWaveEffect();
        newRecord();
    };

    return (
        <div id="board-container">
            {mappedBlocks}
        </div>
    );
};

class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    static extractPositionFromString(str) {
        const rowAndCol = str.match(/\d+/g).map(Number);
        return new Position(rowAndCol[0], rowAndCol[1]);
    }

    static generateRandomPos(maxRow, maxCol) {
        const randomRow = Math.floor(Math.random() * (maxRow - 1)) + 1;
        const randomCol = Math.floor(Math.random() * (maxCol - 1)) + 1;
        return new Position(randomRow, randomCol);
    }

    equals(other) {
        if(other){
            return this.row === other.row && this.col === other.col;
        }
        return false;
    }

    toString() {
        return `${this.row}-${this.col}`;
    }
}

export default GameBoard;
