import { useState } from "react"

function DashBoard({score,gameState,setGameState}){

    const startGame = () =>{
       setGameState("running");
    }

    return(<div className="dash-board">

        <h1>Score : {score}</h1>
        <h1>game status: {gameState}</h1>
        <button onClick={startGame}>Start Game</button>
    </div>);


    
}

export default DashBoard