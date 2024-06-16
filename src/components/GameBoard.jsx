import React,{useState,useEffect} from 'react';



function GameBoard() {
    let playerPositions =[new Position(2,2)]; //starting the player with one block on the second row and second col
    let playerDiraction ="rigth"; //starting dir is rigth
    let lastDiractrion = "rigth"; // saves the last diraction of the player
    let gameRunning = false;
    
   
    const changeDiracrion = (key) =>{
        if(gameRunning){
            switch(key.code){
                case "KeyD":
                    if(lastDiractrion!= "left")
                        playerDiraction="rigth";
                    break;

                case "KeyA":
                    if(lastDiractrion!= "rigth")
                        playerDiraction ="left";
                    break;

                case "KeyW":
                    if(lastDiractrion!= "down")
                        playerDiraction ="up";
                    break;

                case "KeyS":
                    if(lastDiractrion!= "up")
                        playerDiraction= "down";
                    break;
            }
        }
        
    }
    
    document.addEventListener("keydown",changeDiracrion);


    // Generating the matrix with position objects
    const boardWidth = 15;
    const boardHeight = 15;
    let board = [];
    for (let row = 0; row < boardHeight; row++) {
        board.push([]);
        // For each row, insert the row block list
        for (let col = 0; col < boardWidth; col++) {
            board[row].push({ row: row, col: col });
            // For each row, push objects that state the row and col
        }
    }

    // Turning the positions matrix into an array of block divs
    // Each block with the id like row colxrowx
    const mappedBlocks = board.flat().map(block => {
        return (
            <div
                key={`row${block.row + 1}col${block.col + 1}`}
                className="board-block"
                id={`row${block.row + 1}col${block.col + 1}`}
            />
        );
    });

    const colorPlayer = () => { //colors all the blocks of the player
        playerPositions.forEach((positon) =>{
            try{
            const current = document.getElementById(`row${positon.row}col${positon.col}`)
            current.style.backgroundColor="black";
            }
            catch{
            }
        })
    }

    const move = () =>{
        const playerHead = playerPositions[0];
        
        
        switch(playerDiraction){
            case "rigth":
                if(playerHead.col<15){
                    playerHead.col++;
                    lastDiractrion = "rigth";
                }   
                else
                    gameOver();
            break;

            case "down":
                if(playerHead.row<15){
                    playerHead.row++;
                    lastDiractrion = "down";
                }   
                else
                    gameOver();
            break;

            case "left":
                if(playerHead.col>0){
                    playerHead.col--;
                    lastDiractrion = "left";
                }   
                else
                    gameOver();
            break;

            case "up":
                if(playerHead.row>0){
                    playerHead.row--;
                    lastDiractrion = "up";
                }   
                else
                    gameOver();
            break;


        }
        
        
    }

    const clearNonePlayerBlocks = () =>{
        const allBlocks = document.querySelectorAll(".board-block");
        allBlocks.forEach(block =>{
            const blockId = block.id;
            const blockPosition = Position.extractPostionFromString(blockId);
            if(!playerPositions.includes(blockPosition)){
                block.style.backgroundColor = "white";
            }
        });

    }
    let intrevals =[]
    const reStartGame = () =>{
        const gameTick = 500; //game ticks every x
        playerPositions = [(new Position(2,2))];
        intrevals.push(setInterval(move,gameTick));
        intrevals.push(setInterval(clearNonePlayerBlocks,gameTick));
        intrevals.push(setInterval(colorPlayer,gameTick));
        
        gameRunning=true;
        
    }
    reStartGame(); //imediatly starts the game
    
    
    const gameOver = ()=>{
        intrevals.forEach(intreval => {
            clearInterval(intreval);
        });
        console.log("gameover");
        gameRunning=false;
        
    }
    

    return (
        <div id="board-container">
            {mappedBlocks}
        </div>
    );
}

class Position{
    constructor(row,col){
        this.row = row
        this.col = col;
    }
    // Function to extract numbers
    static extractPostionFromString(str) {
        const rowAndCol = str.match(/\d+/g).map(Number);
        return new Position(rowAndCol[0], rowAndCol[1]);
    }
    
}


export default GameBoard;
