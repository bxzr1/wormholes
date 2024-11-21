import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPlayerIndex, selectPlayers } from '../reducers/PlayerReducer';
import styles from './PlayerDetails.module.scss';
import classnames from 'classnames';
import { Player_t, Wormhole } from '../utils/playerutils';
import { PlayerIndex_t } from '../utils/aliasutils';
import { PlanetTypes } from '../template';
import { planetImages } from '../image_assets/images';
import { playerActions } from '../reducers/PlayerReducer';

export const PlayerDetails = () => {
    const playerdetails = useSelector( selectPlayers )
    const currentPlayerIndex = useSelector( selectCurrentPlayerIndex )
    const players: Player_t[] = Object.values( playerdetails );

    return (
        < div className={ styles.Players }>
            {
                players.map( ( player ) => {
                    const isCurrentPlayer = currentPlayerIndex === player.playerIndex;
                    return (
                        <div className={ classnames( styles.PlayerDetails, isCurrentPlayer && styles.CurrentPlayer) }>
                            <PlayerInfo player={ player } />
                            <div className={ styles.PlayerPieces }>
                                <PlayerWormholes playerIndex={ player.playerIndex } wormholes={ player.wormholes }/>
                                <PlayerPassengers passengers={ player.passengers } />
                            </div>
                            { isCurrentPlayer && < PlayerButtons currentPlayerIndex={ currentPlayerIndex } /> }
                        </div>
                    )
                })
            }
        </ div >
    )
}

function PlayerInfo( props: { player: Player_t })
{
    const { player } = props; 
    return(
       <div className={ classnames(  styles.BasicInfo, styles[`Player${ player.playerIndex }`]) }>
            <div className={ styles.PlayerInfo }>{ player.name }</div>
            <div className={ styles.PlayerInfo }>SCORE: { player.score }</div>
            <div className={ styles.PlayerInfo }>FUEL LEFT: { player.fuelLeft }</div>
            <div className={ styles.PlayerInfo }>HAS PICKED UP: { player.hasPickedUp ? 'yes': 'no' }</div>
       </div>
    )
}

function PlayerWormholes( props: { playerIndex: PlayerIndex_t, wormholes: Wormhole[]})
{
    const { playerIndex, wormholes } = props; 
    return (
        <div className={ styles.PlayerWormholesCtn }>
            Wormholes: 
            <div className={ styles.PlayerWormholes } >
            {
                wormholes.map( ( wormhole ) => {
                    return (
                        <div className={ styles.WormholeContainer }>
                            <div className={ classnames( styles.Wormhole, styles[`Player${ playerIndex }`], wormhole.active && styles.Active ) }>
                                <div className={ styles.WormholeNumber } >{ wormhole.wormholeIndex }</div>
                                <div className={ styles.WormholeLocation }>
                                    { wormhole.locationA ? 
                                        `${wormhole.locationA.boardPieceIndex}_${ wormhole.locationA.hexNodeIndex }`:
                                        'N/A' 
                                    }
                                </div>
                            </div>
                            <div className={ classnames( styles.Wormhole, styles[`Player${ playerIndex }`], wormhole.active && styles.Active ) }>
                                <div className={ styles.WormholeNumber }>{ wormhole.wormholeIndex }</div>
                                <div className={ styles.WormholeLocation }>
                                    { wormhole.locationB ? 
                                        `${wormhole.locationB.boardPieceIndex}_${ wormhole.locationB.hexNodeIndex }`:
                                        'N/A' 
                                    }
                                </div>
                            </div>
                        </div>
                    )

                })
            }
        </div>
        </div>
    )
}

function PlayerPassengers( props: { passengers: PlanetTypes[]})
{
    const { passengers } = props; 
    return(
      <div className={ styles.PlayerPassengerCtn }>
            Passengers:
            <div className={ styles.PlayerPassengers }>
                {
                    passengers.map( ( passenger ) => 
                        {
                            const imageUrl = planetImages[passenger];
                            return (
                                <div className={ styles.Passenger }>
                                    <img className={ styles.PassengerImage } src={ imageUrl } alt=''></img>
                                </div>
                            )
                        })
                }
            </div>
      </div>
    )
}

function PlayerButtons( props: { currentPlayerIndex: PlayerIndex_t })
{
    const { currentPlayerIndex } = props;
    const dispatch = useDispatch();

    const onEndTurn = () =>
    {
        dispatch( playerActions.endTurn( currentPlayerIndex ));
    }

    return (
        <div className={ styles.PlayerButtons }>
            <button>CHANGE PASSENGERS</button>
            <button onClick={ onEndTurn }>END TURN</button>
        </div>
    )
}