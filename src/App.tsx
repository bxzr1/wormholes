import React from 'react';
import './App.css';
import { GameBoard } from './GameBoardLayout';

function App() {
  return (
    <div className="App" style={ { display: 'flex', flexWrap: 'wrap' } }>
       <GameBoard />
    </div>
  );
}

export default App;
