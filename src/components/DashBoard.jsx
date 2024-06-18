import { useState } from "react"

function DashBoard({score,gameState,setGameState}){

    const startGame = () =>{
       setGameState("running");
    }

    return(<div className="dash-board-container">
        <h1>game status: {gameState}</h1>
        <button onClick={startGame}>Start Game</button>
    </div>);


    
}

export default DashBoard