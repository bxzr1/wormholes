import { useSelector } from 'react-redux';
import { selectPlayers } from '../reducers/PlayerReducer';
import styles from './PlayerDetails.module.scss';
import classnames from 'classnames';
import { Player_t, Wormhole } from '../utils/playerutils';
import { PlayerIndex_t } from '../utils/aliasutils';

export const PlayerDetails = () => {
    const playerdetails = useSelector( selectPlayers )
    const players: Player_t[] = Object.values( playerdetails ); 
    return (
        < div className={ styles.Players }>
            {
                players.map( ( player ) => {
                    return (
                        <div className={ styles.PlayerDetails }>
                            <PlayerInfo player={ player } />
                            <PlayerWormholes playerIndex={ player.playerIndex } wormholes={ player.wormholes }/>
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
       <>
            <div className={ styles.PlayerName }>{ player.name }</div>
            <div className={ styles.PlayerInfo }>SCORE: { player.score }</div>
            <div className={ styles.PlayerInfo }>FUEL LEFT: { player.fuelLeft }</div>
            <div className={ styles.PlayerInfo }>HAS PICKED UP: { player.hasPickedUp ? 'yes': 'no' }</div>
       </>
    )
}

function PlayerWormholes( props: { playerIndex: PlayerIndex_t, wormholes: Wormhole[]})
{
    const { playerIndex, wormholes } = props; 
    return (
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
    )
}