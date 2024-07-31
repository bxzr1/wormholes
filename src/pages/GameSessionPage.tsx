import React, { useEffect } from 'react';
import styles from './GameSessionPage.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, selectGameBoard } from '../reducers/BoardReducer';
import { GameBoardLayout } from '../boardlayout/GameBoardLayout';
import { useNavigate } from 'react-router-dom';
import { clearPlayers } from '../reducers/PlayerReducer';
import { ClearGameSession } from '../utils/sessionutils';
import { ErrorBoundary } from 'react-error-boundary';
function GameSession() 
{
    const gameBoard = useSelector( selectGameBoard );
    const navigate = useNavigate();

    useEffect(() => 
    {
        const isValidBoard = Object.keys( gameBoard ).length > 0;
        if( !isValidBoard )
        {
            navigate( '/');
        }
    }, [ navigate, gameBoard ]);

    if ( !gameBoard || Object.keys( gameBoard ).length <= 0 )
        return null;
    
    return (
        <div className={ styles.GameSession }>
            <ResetGame/>
            <ErrorBoundary fallback={ <div>Failed to render board</div>}>
                <GameBoardLayout gameBoardPieces={ gameBoard } />
            </ErrorBoundary>
        </div>
    );
}

function ResetGame()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onReset = () => {
        dispatch( clearPlayers )
        dispatch( clearBoard )
        ClearGameSession();
        navigate('/')
    }
    return <button className={ styles.ResetButton } onClick={ onReset } >Reset Game</button>
}

export default GameSession;
