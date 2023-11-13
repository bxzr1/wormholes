import { useSelector } from "react-redux";
import { Player } from "./Player";
import { selectNumPlayers, selectPlayers } from "./PlayerReducer";

export function InGameLogic () {
    const players = useSelector(selectPlayers);
    const nPlayers = useSelector(selectNumPlayers);
    return (
        //TODO - line 10-11-12
        <div style={{ position: 'fixed', top: 0, right: 0, fontSize: 72, color: 'white', paddingRight: 8, textAlign: 'right' }}>
            <p>Number of Players: {nPlayers}</p>
            { Object.keys(players).map( key => <p>{players[key].getName()}</p>)}
            {/* <p>Current player: {props.currentPlayer?.getName()}</p> */}
        </div>
    );
};