import React, { useState, useRef } from 'react';
import GameBoard from './components/GameBoard';
import DashBoard from './components/DashBoard';

function App() {
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("idle");

    const gameBoardRef = useRef();

    const handleRestart = () => {
        if (gameBoardRef.current) {
            gameBoardRef.current.reStartGame();
        }
    };

    return (
        <div className="App">
            <DashBoard 
              score={score} 
              gameState={gameState} 
              handleRestart={handleRestart} />
            <GameBoard 
              ref={gameBoardRef} 
              scoreDisplay={setScore} 
              gameState={gameState} 
              setGameState={setGameState} 
            />
        </div>
    );
}

export default App;
