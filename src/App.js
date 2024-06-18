import React, { useState} from 'react';
import GameBoard from './components/GameBoard';
import DashBoard from './components/DashBoard';
import ScoreDisplay from './components/ScoreDisplay';
import GameMessage from './components/GameMessage';
function App() {
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("idle");

    return (
        <div className="App">
            <DashBoard  
              gameState={gameState} 
              setGameState={setGameState}/>
            <GameBoard 
              scoreDisplay={setScore} 
              gameState={gameState} 
              setGameState={setGameState} 
            />
            <ScoreDisplay score={score}/>
            <GameMessage
              setGameState={setGameState}
              gameState={gameState}
              score={score}
              />
        </div>
    );
}

export default App;
