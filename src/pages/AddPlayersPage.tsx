import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer, selectNumPlayers, selectPlayers } from "../reducers/PlayerReducer";
import styles from './AddPlayerPage.module.scss'
import { useNavigate } from 'react-router-dom';
import { initNewGame } from '../reducers/BoardReducer';

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
        dispatch( addPlayer( { name: playerName, score: 0, hexLocation: null } ))
        setPlayerName( '')
    }

    const onStartGame = () => {
        dispatch( initNewGame( 8 ) )
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
                <input type={ 'text' } value={ playerName} onChange={ onNameInputChange }/> 
            </div>
            <div>
                <button className={ styles.AddPlayerButton } disabled={numPlayers >= 3 || !playerName } onClick={ onAddPlayer }>Add Player</button>
                <button className={ styles.StartGameButton } disabled={numPlayers > 3 || numPlayers < 2} onClick={onStartGame}>Start Game</button>
            </div>
        </div>
    );
};
