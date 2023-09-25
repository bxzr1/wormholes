import React from 'react';
import './App.css';
import { GameBoardLayout } from './GameBoardLayout';
import { GameBoard } from './GameBoard';

function App() {

    const gameBoard = new GameBoard(8);

    return (
        <div className="App" style={ { display: 'flex', flexWrap: 'wrap' } }>
            <GameBoardLayout gameBoardPieces={gameBoard.boardPieces}/>
        </div>
    );
}

export default App;
