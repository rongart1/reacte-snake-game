import React, { useState} from 'react';
import GameBoard from './components/GameBoard';
import DashBoard from './components/DashBoard';

function App() {
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("idle");

    return (
        <div className="App">
            <DashBoard 
              score={score} 
              gameState={gameState} 
              setGameState={setGameState}/>
            <GameBoard 
              scoreDisplay={setScore} 
              gameState={gameState} 
              setGameState={setGameState} 
            />
        </div>
    );
}

export default App;
