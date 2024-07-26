import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { GameBoardLayout } from './layout/GameBoardLayout';
import { PreGameLogic } from './PreGameLogic';
import { InGameLogic } from './InGameLogic';
import {  selectNumPlayers } from "./reducers/PlayerReducer";
import { initGame, selectGameBoard } from './reducers/BoardReducer';

function App() 
{
    const dispatch = useDispatch();
    const numPlayers = useSelector( selectNumPlayers );
    const gameBoard = useSelector( selectGameBoard )

    useEffect(() => {
        dispatch( initGame( 8 ) )
    }, [ dispatch ]);

    if ( !gameBoard || Object.keys( gameBoard ).length <= 0 )
        return null;
    
    return (
        <div className="App" style={ { width: '100vw', height: '100vh', display: 'flex', flexWrap: 'wrap', fontSize: '36px' } }>
            { numPlayers ? 
                <>
                    <GameBoardLayout gameBoardPieces={ gameBoard }/>
                    <InGameLogic/>
                </> : 
                <PreGameLogic/> 
            }
        </div>
    );
}


export default App;
