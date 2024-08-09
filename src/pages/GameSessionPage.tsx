import React, { useEffect } from 'react';
import styles from './GameSessionPage.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { boardActions, selectGameBoard } from '../reducers/BoardReducer';
import { GameBoardLayout } from '../boardlayout/GameBoardLayout';
import { useNavigate } from 'react-router-dom';
import { playerActions } from '../reducers/PlayerReducer';
import { ClearGameSession } from '../utils/sessionutils';
import { ErrorBoundary } from 'react-error-boundary';
import { PlayerDetails } from '../playerlayout/PlayerDetails';
import { PassengerDeck } from '../boardlayout/PassengerDeck';
import { ExplorationTokens } from '../boardlayout/ExplorationTokens';

function GameSession() 
{
    const gameBoard = useSelector( selectGameBoard );
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const onReset = () => {
        dispatch( playerActions.clearPlayers() )
        dispatch( boardActions.clearBoard() )
        ClearGameSession();
        navigate('/')
    }
    
    return (
        <div className={ styles.GameSession }>
            <button className={ styles.ResetButton } onClick={ onReset } >Reset Game</button>
            <ErrorBoundary fallback={ <div>Failed to render board</div>}>
                <GameBoardLayout gameBoardPieces={ gameBoard } />
                <div className={ styles.GameParts }>
                    <ExplorationTokens/>
                    <PassengerDeck/>
                </div>
                <PlayerDetails />
            </ErrorBoundary>
        </div>
    );
}

export default GameSession;
