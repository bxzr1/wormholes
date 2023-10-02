import React, { useState, useEffect } from 'react';
import './App.css';
import { GameBoardLayout } from './GameBoardLayout';
import { GameBoard } from './GameBoard';

function App() {

    const [gameBoard, setGameBoard] = useState<GameBoard>();
    useEffect(() => {
        const storedGameBoard = sessionStorage.getItem("gameBoard");
        const board = new GameBoard();
        if (!storedGameBoard) {
            board.generateGameBoard(8);
            setGameBoard( board );
        } else {
            const gameBoardData = JSON.parse(storedGameBoard);
            board.loadGameBoard(gameBoardData);
            setGameBoard( board );
        }
    }, []);

    if ( !gameBoard || gameBoard.boardPieces.length <= 0 )
        return null;
    
    return (
        <div className="App" style={ { display: 'flex', flexWrap: 'wrap' } }>
            <GameBoardLayout gameBoardPieces={gameBoard.boardPieces}/>
        </div>
    );
}

export default App;
