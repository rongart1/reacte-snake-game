function GameMessage({gameState,setGameState,score}){




    return (
        <div className="game-message-container">
            <h1 id="game-over" className="game-over-text"
             style={{ display: gameState === "gameOver" ? 
                            "inline-block" :
                             "none" }}
            >GAME OVER</h1>

            <h1 className="game-over-text"
             style={{ display: gameState === "gameOver" ? 
                            "inline-block" :
                             "none" }}
            >Score: {score}</h1>

            <button className="start-btn"
                onClick={() =>setGameState("running")}
                style={{ display: gameState != "running" ? 
                    "inline-block" :
                     "none" }}
            >{gameState === "idle"? "start game!" : "restart game"}</button>
        </div>
    );
    
}
export default GameMessage