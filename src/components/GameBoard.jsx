import React, { useState, useEffect } from 'react';

function GameBoard({scoreDisplay}) {
    let playerPositions = [new Position(2, 2)]; // Starting with one block at position (2,2)
    let playerDirection = "right"; // Starting direction is right
    let lastDirection = "right"; // Saves the last direction of the player
    let gameRunning = false;
    let score;
    let foodPosition = null;

    const changeDirection = (key) => {
        if (gameRunning) {
            switch (key.code) {
                case "KeyD":
                    if (lastDirection !== "left") playerDirection = "right";
                    break;
                case "KeyA":
                    if (lastDirection !== "right") playerDirection = "left";
                    break;
                case "KeyW":
                    if (lastDirection !== "down") playerDirection = "up";
                    break;
                case "KeyS":
                    if (lastDirection !== "up") playerDirection = "down";
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", changeDirection);
        return () => {
            document.removeEventListener("keydown", changeDirection);
        };
    }, []);

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
        const tail = playerPositions[playerPositions.length-1];
        lastPosition = new Position(tail.row, tail.col); // Save the tail position

        //moving the body
        for (let i = playerPositions.length - 1; i >= 1; i--) {
            playerPositions[i].col = playerPositions[i - 1].col;
            playerPositions[i].row = playerPositions[i - 1].row;
        }

        switch (playerDirection) { //moving the head
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
                if (playerHead.col > 0) {
                    playerHead.col--;
                    lastDirection = "left";
                } else {
                    gameOver();
                }
                break;
            case "up":
                if (playerHead.row > 0) {
                    playerHead.row--;
                    lastDirection = "up";
                } else {
                    gameOver();
                }
                break;
            default:
                break;
        }

        checkEat();// after each move checking if the you are on food and action based on it
        checkOverlap();
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
        });
    };

    //checking overlap and ending game if true
    const checkOverlap = () =>{
        if(playerPositions.slice(1).some(pos => pos.equals(playerPositions[0]))){
            gameOver();
        }
    }

    //checks if the player ate and increase player size
    const checkEat = () => {
        if (foodPosition && playerPositions[0].equals(foodPosition)) {
            foodPosition = null;
            playerPositions.push(lastPosition);
            score+=200;
            scoreDisplay(score);
            generateFood();
        }
    };


    //print the positions for debugging
    const printPositions = () =>{
        let positons = [];
        playerPositions.forEach(pos =>{
            positons.push(pos);
        })
        console.log(`food: ${foodPosition}`);
        console.log(`player: ${positons}`);
        
    }

    

    let intervals = [];
    const reStartGame = () => {
        const gameTick = 500; // Game ticks every x milliseconds
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
    };

    useEffect(() => {
        reStartGame();
        return () => {
            intervals.forEach(interval => {
                clearInterval(interval);
            });
        };
    }, []);

    const gameOver = () => {
        intervals.forEach(interval => {
            clearInterval(interval);
        });
        console.log("gameover");
        gameRunning = false;
    };

    return (
        <div id="board-container">
            {mappedBlocks}
        </div>
    );
}

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
        return this.row === other.row && this.col === other.col;
    }

    toString(){
        return `${this.row}-${this.col}`;
    }
}

export default GameBoard;
