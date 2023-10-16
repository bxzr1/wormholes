import { useSelector } from "react-redux";
import { Player } from "./Player";
import { selectNumPlayers } from "./PlayerReducer";

export function InGameLogic (props: { players: Player[], currentPlayer?: Player }) {
    const nPlayers = useSelector( selectNumPlayers);
    return (
        //TODO - line 10-11-12
        <div style={{ position: 'fixed', top: 0, right: 0, fontSize: 72, color: 'white', paddingRight: 8, textAlign: 'right' }}>
            <p>Number of Players: {nPlayers}</p>
iv
            { props.players.map( player => <p>{player.getName()}</p>)}
            <p>Current player: {props.currentPlayer?.getName()}</p>
        </div>
    );
};

