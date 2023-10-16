import { Player } from './Player';

export function PlayerLayout ( props: { player: Player }) {
    

    return (
        <div>
            <h2>{props.player.getName()}</h2>
            <p>Score: {props.player.getScore()}</p>
        </div>
    );
};
