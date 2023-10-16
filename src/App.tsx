import React, { useState, useEffect } from 'react';
import './App.css';
import { GameBoardLayout } from './GameBoardLayout';
import { GameBoard } from './GameBoard';
import { PreGameLogic } from './PreGameLogic';
import { InGameLogic } from './InGameLogic';
import { Player } from './Player';

function App() {

    const [gameBoard, setGameBoard] = useState<GameBoard>();
    const [players, setPlayers] = useState<Player[]>([]);
    
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
        <div className="App" style={ { width: '100vw', height: '100vh', display: 'flex', flexWrap: 'wrap', fontSize: '36px' } }>
            { players.length
                ? <><GameBoardLayout gameBoardPieces={gameBoard.boardPieces}/>
                  <InGameLogic players={players}/></>
                : <PreGameLogic setPlayers={setPlayers}/> }
        </div>
    );
}

export default App;
