import { useState,useEffect } from "react"

function DashBoard({score,gameState,setGameState,setTeleporters}){

    const startGame = () =>{
       setGameState("running");
    }

    
    const updateTeleporters =()=>{
        setTeleporters(document.getElementById("teleporterCheckBox").checked);
    }

    return(<div className="dash-board-container">
        <h1>game status: {gameState}</h1>
        <label htmlFor="teleporter">teleporters</label>
        <input type="checkbox" name="teleporter" id="teleporterCheckBox" onChange={updateTeleporters}/>
    </div>);


    
}

export default DashBoard