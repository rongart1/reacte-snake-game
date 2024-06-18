import react,{useState} from 'react';
import GameBoard from './components/GameBoard';
import DashBoard from './components/DashBoard';
function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <DashBoard score={score}/>
      <GameBoard scoreDisplay={setScore}/>
    </div>
  );
}

export default App;
