import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playerActions, selectNumPlayers, selectPlayers } from "../reducers/PlayerReducer";
import styles from './AddPlayerPage.module.scss'
import { useNavigate } from 'react-router-dom';
import { boardActions } from '../reducers/BoardReducer';
import { GenerateDefaultWormholes, k_fuelPerRound } from '../utils/playerutils';
import { BoardPieceIndex_t, HexNodeIndex_t, PlayerIndex_t } from '../utils/aliasutils';
import { orbitNodesIndicies } from '../template';

export function AddPlayers() {

    const players = useSelector( selectPlayers );
    const numPlayers = useSelector( selectNumPlayers );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ playerName, setPlayerName ] = useState< string >('');

    const onNameInputChange = ( ev: React.FormEvent<HTMLInputElement> ) => {
        setPlayerName( ev.currentTarget.value )
    }

    const onAddPlayer = () => {
        dispatch( playerActions.addPlayer( {
            playerIndex: numPlayers as PlayerIndex_t,
            fuelLeft: k_fuelPerRound,
            hasPickedUp: false,
            wormholes: GenerateDefaultWormholes( numPlayers as PlayerIndex_t ),
            name: playerName, 
            score: 0, 
            hexLocation: { boardPieceIndex: 0 as BoardPieceIndex_t, hexNodeIndex: orbitNodesIndicies[ numPlayers as HexNodeIndex_t ]},
         } ))
        setPlayerName( '')
    }

    const onKeyDown = ( ev: React.KeyboardEvent) => {
        if( ev.key === 'Enter')
        {
            onAddPlayer();
        }
    }

    const onStartGame = () => {
        dispatch( boardActions.initNewGame( 8 ) )
        dispatch( playerActions.changeCurrentPlayer( 0 as PlayerIndex_t ) )
        navigate( '/play');
    };

    return (
        <div className={styles.AddPlayersPage }>
            <h1> Add 2 to 3 Players </h1>
           { numPlayers > 0 && 
            <div className={ styles.PlayerSummary }>
                <div className={ styles.PlayerHeader } >Current Players:</div>
                {
                    Object.values( players ).map( ( player ) => {
                        return <div className={ styles.PlayerName }>{ player.name }</div>
                    })
                }
            </div>
           }
            <div className={ styles.NameInput }>
                <div> Input Player Name: </div>
                <input type={ 'text' } value={ playerName} onChange={ onNameInputChange } onKeyDown={ onKeyDown } /> 
            </div>
            <div>
                <button className={ styles.AddPlayerButton } disabled={numPlayers >= 3 || !playerName } onClick={ onAddPlayer }>Add Player</button>
                <button className={ styles.StartGameButton } disabled={numPlayers > 3 || numPlayers < 2} onClick={onStartGame}>Start Game</button>
            </div>
        </div>
    );
};